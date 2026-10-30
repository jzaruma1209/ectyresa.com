import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useProducts, PRODUCT_NOT_FOUND } from "../../hooks/useProducts";
import { usePageMeta } from "../../hooks/usePageMeta";
import ProductCard from "../../components/products/ProductCard";
import AppLoader from "../../components/shared/AppLoader";
import MarkdownText from "../../components/shared/MarkdownText";
import productsService from "../../services/products.service";
import { optimizeImage } from "../../utils/cloudinaryImage";
import { productPath, parseProductId } from "../../utils/productSlug";
import { stripMarkdown } from "../../utils/stripMarkdown";
import { buildProductMessage, openWhatsApp } from "../../utils/whatsapp";
import "../styles/ProductDetailsPage.css";

/* ── Imágenes de respaldo ── */
const PLACEHOLDER_GALLERY = [
  "/llanta1.webp",
  "/llanta2.webp",
  "/llanta1.webp",
  "/llanta2.webp",
];

const ProductDetailsPage = () => {
  // La URL es /product/8-nombre-del-producto; también se acepta /product/8 y se redirige a la canónica.
  const { id: idParam } = useParams();
  const id = parseProductId(idParam);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { selectedProduct: storedProduct, loading, error, loadProductById } = useProducts();
  // Solo vale el producto del id de la URL: evita mostrar el anterior mientras carga el nuevo.
  const selectedProduct = storedProduct && String(storedProduct.id) === String(id) ? storedProduct : null;

  const [mainImg, setMainImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);

  // Título y descripción para Google con los datos reales (solo cuando el producto cargó).
  // Marca y medida se agregan solo si el nombre no las trae ya.
  const metaName = selectedProduct?.name || "";
  const nameIncludes = (part) =>
    Boolean(part) && metaName.replace(/\s/g, "").toLowerCase().includes(part.replace(/\s/g, "").toLowerCase());
  // Si el nombre trae una medida distinta a la registrada (dato por corregir en el panel) no se usa ninguna en los metadatos.
  const measureKey = (text) => {
    const m = /(\d{3})\s*\/\s*(\d{2})\s*[Rr]\s*(\d{2})/.exec(text || "");
    return m ? `${Number(m[1])}/${Number(m[2])}R${Number(m[3])}` : null;
  };
  const measureConflict =
    Boolean(measureKey(metaName) && measureKey(selectedProduct?.measure)) &&
    measureKey(metaName) !== measureKey(selectedProduct?.measure);
  const metaMeasure =
    selectedProduct?.measure && !measureConflict && !nameIncludes(selectedProduct.measure) ? selectedProduct.measure : "";
  const metaBrand = selectedProduct?.brand && !nameIncludes(selectedProduct.brand) ? selectedProduct.brand : "";
  const metaPrice = selectedProduct ? Number(selectedProduct.finalPrice || selectedProduct.price || 0).toFixed(2) : null;
  usePageMeta(
    selectedProduct
      ? {
          title: [metaBrand, metaName, metaMeasure].filter(Boolean).join(" "),
          // Las llantas mencionan la ubicación real del local; el resto de productos no la fuerza
          description: `${[metaBrand, metaName, metaMeasure].filter(Boolean).join(" ")}. Precio: $${metaPrice}. ${
            (selectedProduct.category || "").toLowerCase().includes("llanta")
              ? "Consulta disponibilidad en ECTYRE S.A., La Troncal, Cañar, y pide por WhatsApp."
              : "Pide por WhatsApp a ECTYRE S.A., envíos a todo Ecuador."
          }`,
          image: optimizeImage(selectedProduct.image, 1200),
          path: productPath(selectedProduct),
        }
      // Producto inexistente o desactivado: no debe indexarse (soft 404). Un fallo temporal de la API no lo marca.
      : { path: pathname, noindex: error === PRODUCT_NOT_FOUND }
  );

  // Respaldo en el navegador: el servidor ya redirige con 308; esto cubre la navegación interna de la SPA.
  const canonicalPath = selectedProduct ? productPath(selectedProduct) : null;
  useEffect(() => {
    if (canonicalPath && pathname !== canonicalPath) navigate(canonicalPath, { replace: true });
  }, [canonicalPath, pathname, navigate]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedType, setRelatedType] = useState("medida"); // 'medida' | 'marca' | 'disponibles'

  useEffect(() => {
    if (id) loadProductById(id);
  }, [id, loadProductById]);

  // Cargar productos relacionados: Prioridad 1: Misma Medida -> Prioridad 2: Misma Marca -> Prioridad 3: Disponibles
  useEffect(() => {
    let isMounted = true;
    const fetchRelated = async () => {
      try {
        const all = await productsService.getAllProducts();
        if (!isMounted || !Array.isArray(all)) return;

        const currentId = id;
        const currentMeasure = selectedProduct?.measure;
        const currentBrand = selectedProduct?.brand;

        // 1. Filtrar los que no sean el producto actual
        const pool = all.filter((p) => String(p.id) !== String(currentId));

        // 2. Intentar buscar por misma medida
        let matched = [];
        let type = "medida";

        if (currentMeasure) {
          matched = pool.filter((p) => p.measure && p.measure.trim().toLowerCase() === currentMeasure.trim().toLowerCase());
        }

        // 3. Si no hay por medida o son muy pocos, buscar por misma marca
        if (matched.length < 2 && currentBrand) {
          const byBrand = pool.filter((p) => p.brand && p.brand.trim().toLowerCase() === currentBrand.trim().toLowerCase());
          if (byBrand.length > 0) {
            matched = [...matched, ...byBrand.filter((b) => !matched.some((m) => m.id === b.id))];
            type = "marca";
          }
        }

        // 4. Si aún no hay suficientes, rellenar con productos disponibles
        if (matched.length < 4) {
          const rest = pool.filter((p) => !matched.some((m) => m.id === p.id));
          matched = [...matched, ...rest];
          if (matched.length > 0 && type !== "medida" && type !== "marca") {
            type = "disponibles";
          }
        }

        if (isMounted) {
          setRelatedProducts(matched.slice(0, 4));
          setRelatedType(type);
        }
      } catch (e) {
        console.error("Error al cargar productos similares:", e);
      }
    };

    fetchRelated();
    return () => {
      isMounted = false;
    };
  }, [id, selectedProduct?.measure, selectedProduct?.brand]);

  /* ── Galería de imágenes ── */
  const gallery =
    selectedProduct?.images?.length > 0
      ? selectedProduct.images
      : selectedProduct?.image
      ? [selectedProduct.image, ...PLACEHOLDER_GALLERY.slice(1)]
      : PLACEHOLDER_GALLERY;

  // Pedido por WhatsApp: el único camino de compra de la tienda
  const handleWhatsAppOrder = () => {
    if (!selectedProduct) return;
    const variant = selectedVariant > 0 ? variants[selectedVariant]?.label : undefined;
    openWhatsApp({
      message: buildProductMessage(selectedProduct, { qty, variant }),
      source: "ficha_producto",
      product: selectedProduct,
      qty,
    });
  };

  const handleImagePointerMove = (event) => {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    event.currentTarget.style.setProperty("--zoom-x", `${x}%`);
    event.currentTarget.style.setProperty("--zoom-y", `${y}%`);
  };

  /* ── Estados de carga ── */
  // No se muestra ningún producto de ejemplo: precio y nombre deben ser siempre los reales.
  if (!selectedProduct) {
    if (!error || loading) {
      return <AppLoader />;
    }

    // Producto inexistente o desactivado vs. fallo temporal de conexión: mensajes distintos
    if (error !== PRODUCT_NOT_FOUND) {
      return (
        <div className="pdp-loading">
          <p>No pudimos cargar el producto. Revisa tu conexión e inténtalo de nuevo.</p>
          <button type="button" onClick={() => loadProductById(id)}>Reintentar</button>
          <Link to="/">Ver catálogo</Link>
        </div>
      );
    }

    return (
      <div className="pdp-loading">
        <p>Este producto no está disponible.</p>
        <Link to="/">Ver catálogo</Link>
      </div>
    );
  }

  const product = selectedProduct;

  // Garantías y servicios: el envío nacional y la instalación de llantas son ofertas de la tienda
  // (barra superior y banner); garantía, devoluciones y envío gratis dependen de lo marcado en el panel.
  const isTire = (product.category || "").toLowerCase().includes("llanta");
  const trustItems = [
    {
      label: "Entrega",
      desc: product.freeShipping
        ? "Envío gratis a todo Ecuador. Coordinamos la entrega por WhatsApp."
        : "Envíos a todo Ecuador. Coordinamos la entrega por WhatsApp.",
    },
    isTire && { label: "Instalación", desc: "Instalación incluida sin costo adicional." },
    product.warranty && { label: "Garantía", desc: "Producto con garantía. Te explicamos las condiciones por WhatsApp." },
    product.returns && { label: "Devoluciones", desc: "Acepta devoluciones. Te explicamos las condiciones por WhatsApp." },
  ].filter(Boolean);

  const finalPrice = product.finalPrice || product.price;
  const hasDiscount = product.discount && product.discount > 0;
  const [intPart, decPart] = Number(finalPrice).toFixed(2).split(".");

  // Variantes calculadas para la selección estilo DTC/Brand
  const variants = [
    {
      label: product.measure || "265/70R16",
      sublabel: "Medida estándar recomendada",
      price: finalPrice,
    },
    ...(product.rim ? [
      {
        label: `${product.measure || "Medida"} (Pack x2)`,
        sublabel: "Kit 2 neumáticos",
        price: Number(finalPrice * 1.95).toFixed(2),
      }
    ] : [])
  ];

  return (
    <div className="pdp-page">
      {/* ── Subheader / Breadcrumb minimalista ── */}
      <nav className="pdp-breadcrumb">
        <div className="pdp-breadcrumb-inner">
          <div className="pdp-breadcrumb-links">
            <Link to="/">Inicio</Link>
            <span className="pdp-sep">/</span>
            <Link to="/search">Catálogo</Link>
            <span className="pdp-sep">/</span>
            <span className="pdp-current">{product.brand} · {product.name}</span>
          </div>
          <span className="pdp-breadcrumb-sku">REF: ECT-{product.id || "001"}</span>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          SECCIÓN PRINCIPAL: Galería + Info Brand
      ══════════════════════════════════════ */}
      <main className="pdp-main">
        {/* ── Galería Izquierda ── */}
        {/* ── Galería Izquierda con Miniaturas de Lado ── */}
        <div className="pdp-gallery-container">
          <div className="pdp-gallery-layout">
            {/* Tira de miniaturas lateral (columna vertical) */}
            <div className="pdp-thumbnails-side">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pdp-thumb-btn ${mainImg === i ? "active" : ""}`}
                  onClick={() => setMainImg(i)}
                  title={`Ver imagen 0${i + 1}`}
                >
                  <img
                    src={optimizeImage(src, 200)}
                    alt={`Miniatura 0${i + 1}`}
                    onError={(e) => (e.target.src = "/llanta1.webp")}
                  />
                  <span className="pdp-thumb-index">0{i + 1}</span>
                </button>
              ))}
            </div>

            {/* Imagen principal */}
            <div
              className="pdp-main-image-wrap"
              onPointerMove={handleImagePointerMove}
              onPointerLeave={(event) => {
                event.currentTarget.style.removeProperty("--zoom-x");
                event.currentTarget.style.removeProperty("--zoom-y");
              }}
            >
              {hasDiscount && (
                <span className="pdp-badge-discount">-{product.discount}% OFF</span>
              )}
              <img
                src={optimizeImage(gallery[mainImg], 1000)}
                alt={product.name}
                className="pdp-hero-img"
                onError={(e) => (e.target.src = "/llanta1.webp")}
              />
              <span className="pdp-zoom-hint pdp-zoom-hint--desktop">Pasa el cursor para ampliar</span>
            </div>
          </div>

          <p className="pdp-gallery-caption">
            0{mainImg + 1} · Vista detallada de ingeniería y labrado. Fotografías reales de producto.
          </p>

          {/* ══════════════════════════════════════
              TABS: Descripción / Ficha Técnica (debajo de las fotos)
          ══════════════════════════════════════ */}
          <ProductTabs product={product} />
        </div>

        {/* ── Panel de Información Derecho (Editorial Brand) ── */}
        <section className="pdp-info-panel">
          {/* Header de Marca y Nombre */}
          <div className="pdp-brand-bar">
            <span className="pdp-brand-tag">{product.brand || "ECTYRE PERFORMANCE"}</span>
            {product.modelUse?.descripcion && (
              <span className="pdp-tech-tag">{product.modelUse.descripcion}</span>
            )}
          </div>

          <h1 className="pdp-title">{product.name}</h1>

          <p className="pdp-subtitle-lead">
            {stripMarkdown(product.description, 130) || "Neumático de alta resistencia diseñado para máxima tracción y agarre en carretera y todoterreno."}
          </p>

          {/* Stock real (sin valoraciones: la tienda aún no tiene opiniones de clientes) */}
          {product.inStock && product.stock > 0 && (
            <div className="pdp-meta-row">
              <div className="pdp-stock-urgency">
                <span className="pdp-urgency-dot" />
                <span>{product.stock} en stock</span>
              </div>
            </div>
          )}

          {/* Bloque de Precio */}
          <div className="pdp-price-section">
            <div className="pdp-price-digits">
              <span className="pdp-currency">$</span>
              <span className="pdp-int">{intPart}</span>
              <span className="pdp-dec">.{decPart}</span>
              <span className="pdp-vat-text">IVA incluido</span>
            </div>
            {hasDiscount && (
              <div className="pdp-savings-badge">
                <span className="pdp-strike">${Number(product.price).toFixed(2)}</span>
                <span className="pdp-saved">Ahorras ${(Number(product.price) - Number(finalPrice)).toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Selector de Medida / Variantes Ras */}
          <div className="pdp-variant-selector">
            <div className="pdp-variant-header">
              <span className="pdp-variant-title">MEDIDA / CONFIGURACIÓN</span>
              <span className="pdp-variant-guide">Ver guía de equivalencias</span>
            </div>
            <div className="pdp-variant-options">
              {variants.map((v, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`pdp-variant-card ${selectedVariant === idx ? "selected" : ""}`}
                  onClick={() => setSelectedVariant(idx)}
                >
                  <div className="pdp-variant-info">
                    <span className="pdp-variant-name">{v.label}</span>
                    <span className="pdp-variant-sub">{v.sublabel}</span>
                  </div>
                  <span className="pdp-variant-price">${v.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Cantidad + CTA Add to Bag Ras */}
          <div className="pdp-purchase-actions">
            <div className="pdp-stepper-ras">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <span className="pdp-qty-display">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="pdp-cta-add"
              onClick={handleWhatsAppOrder}
              disabled={!product.inStock}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>{product.inStock ? `PEDIR POR WHATSAPP · $${(finalPrice * qty).toFixed(2)}` : "AGOTADO"}</span>
            </button>
          </div>

          {/* Bloque de Confianza: solo lo que ofrece la tienda o lo marcado en el producto desde el panel */}
          <div className="pdp-shipping-box">
            {trustItems.map((item) => (
              <div key={item.label} className="pdp-shipping-item">
                <div className="pdp-shipping-label">{item.label}</div>
                <div className="pdp-shipping-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════
          SECCIÓN: PRODUCTOS DE LA MISMA MEDIDA / MARCA / COMPATIBLES
      ══════════════════════════════════════ */}
      {relatedProducts.length > 0 && (
        <section className="pdp-related-section">
          <div className="pdp-related-header">
            <div className="pdp-related-titles">
              <span className="pdp-related-tag">
                {relatedType === "medida"
                  ? `EQUIVALENCIAS EN MEDIDA ${product.measure || ""}`
                  : relatedType === "marca"
                  ? `MÁS DE LA MARCA ${product.brand || ""}`
                  : "PRODUCTOS DISPONIBLES EN STOCK"}
              </span>
              <h2 className="pdp-related-title">
                {relatedType === "medida"
                  ? "Otras Opciones en tu Misma Medida"
                  : relatedType === "marca"
                  ? `Explora más neumáticos ${product.brand}`
                  : "También te puede interesar"}
              </h2>
            </div>
            <Link to="/search" className="pdp-related-link">
              VER CATÁLOGO COMPLETO →
            </Link>
          </div>

          <div className="pdp-related-grid">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

/* ── Sub-componente de Tabs estilo Ras ── */
const ProductTabs = ({ product }) => {
  const [tab, setTab] = useState("desc");

  const specRows = Array.isArray(product.specs)
    ? [
        { label: "Tipo de producto", value: product.category || null },
        { label: "Modelo", value: product.model || null },
        { label: "Tipo de uso", value: product.modelUse ? `${product.modelUse.codigo} — ${product.modelUse.descripcion}` : null },
        { label: "Ancho", value: product.width != null ? `${product.width} mm` : null },
        { label: "Alto / Perfil", value: product.height != null ? `${product.height}%` : null },
        { label: "Rin / Aro", value: product.rim != null ? `${product.rim}"` : null },
        ...product.specs.map((spec) => ({ label: spec.name, value: spec.value, icon: spec.icon })),
        { label: "Garantía", value: product.warranty ? "Garantía de Fábrica Ectyre" : null },
      ].filter((r) => r.value)
    : (() => {
        const specs = product.specs || {};
        return [
          { label: "Ancho de sección", value: specs.width ? `${specs.width} mm` : null },
          { label: "Perfil / Serie", value: specs.height ? `${specs.height}%` : null },
          { label: "Aro / Rin", value: specs.rim ? `${specs.rim}"` : null },
          { label: "Índice de Carga", value: specs.loadIndex || null },
          { label: "Índice de Velocidad", value: specs.speedIndex || null },
          { label: "Tipo de Terreno", value: specs.terrain || null },
          { label: "Categoría de Vehículo", value: specs.category || null },
        ].filter((r) => r.value);
      })();

  return (
    <section className="pdp-tabs-ras">
      <div className="pdp-tabs-nav">
        <button
          type="button"
          className={tab === "desc" ? "active" : ""}
          onClick={() => setTab("desc")}
        >
          DESCRIPCIÓN DEL PRODUCTO
        </button>
        <button
          type="button"
          className={tab === "specs" ? "active" : ""}
          onClick={() => setTab("specs")}
        >
          FICHA TÉCNICA
        </button>
      </div>

      <div className="pdp-tabs-body">
        {tab === "desc" && (
          <div className="pdp-tab-panel">
            <MarkdownText
              className="pdp-tab-text"
              texto={product.description || "Descripción detallada del neumático y recomendaciones de ensamblaje en taller."}
            />
          </div>
        )}

        {tab === "specs" && (
          <div className="pdp-tab-panel">
            {specRows.length > 0 ? (
              <table className="pdp-table-ras">
                <tbody>
                  {specRows.map((row) => (
                    <tr key={row.label}>
                      <th>{row.label}</th>
                      <td>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="pdp-tab-text">Especificaciones técnicas no disponibles temporalmente.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetailsPage;
