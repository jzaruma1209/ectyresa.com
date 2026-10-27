import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useProducts, PRODUCT_NOT_FOUND } from "../../hooks/useProducts";
import { usePageMeta } from "../../hooks/usePageMeta";
import ProductCard from "../../components/products/ProductCard";
import AppLoader from "../../components/shared/AppLoader";
import productsService from "../../services/products.service";
import { optimizeImage } from "../../utils/cloudinaryImage";
import { productPath, parseProductId } from "../../utils/productSlug";
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
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!isZoomOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsZoomOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isZoomOpen]);

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

  const openImageZoom = () => {
    setZoomLevel(1);
    setIsZoomOpen(true);
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
              role="button"
              tabIndex={0}
              aria-label={`Ampliar imagen de ${product.name}`}
              onPointerMove={handleImagePointerMove}
              onPointerLeave={(event) => {
                event.currentTarget.style.removeProperty("--zoom-x");
                event.currentTarget.style.removeProperty("--zoom-y");
              }}
              onClick={openImageZoom}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openImageZoom();
                }
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
              <span className="pdp-zoom-hint pdp-zoom-hint--mobile">Toca para ampliar</span>
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
            {product.description?.slice(0, 130) || "Neumático de alta resistencia diseñado para máxima tracción y agarre en carretera y todoterreno."}...
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
              <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                <path d="M16.01 2.667c-7.364 0-13.343 5.98-13.343 13.343 0 2.357.617 4.57 1.7 6.494L2.667 29.333l6.99-1.833a13.28 13.28 0 0 0 6.353 1.617h.006c7.364 0 13.343-5.98 13.343-13.343S23.374 2.667 16.01 2.667zm0 24.42a11.02 11.02 0 0 1-5.617-1.54l-.403-.24-4.15 1.088 1.108-4.045-.263-.417a11.02 11.02 0 0 1-1.687-5.883c0-6.106 4.97-11.076 11.086-11.076 2.96 0 5.744 1.154 7.836 3.246a11 11 0 0 1 3.246 7.836c0 6.117-4.97 11.086-11.09 11.086z" />
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

      {isZoomOpen && (
        <div
          className="pdp-zoom-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada de ${product.name}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsZoomOpen(false);
          }}
        >
          <div className="pdp-zoom-dialog">
            <div className="pdp-zoom-header">
              <span>{product.name}</span>
              <button type="button" onClick={() => setIsZoomOpen(false)} aria-label="Cerrar vista ampliada">
                ×
              </button>
            </div>

            <div className="pdp-zoom-viewport">
              <div className="pdp-zoom-canvas" style={{ width: `${zoomLevel * 100}%` }}>
                <img
                  src={optimizeImage(gallery[mainImg], 1600)}
                  alt={`Vista ampliada de ${product.name}`}
                  draggable="false"
                  onError={(e) => (e.target.src = "/llanta1.webp")}
                />
              </div>
            </div>

            <div className="pdp-zoom-controls" aria-label="Controles de zoom">
              <button
                type="button"
                onClick={() => setZoomLevel((level) => Math.max(1, level - 0.5))}
                disabled={zoomLevel <= 1}
                aria-label="Alejar imagen"
              >
                −
              </button>
              <span>{Math.round(zoomLevel * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((level) => Math.min(3, level + 0.5))}
                disabled={zoomLevel >= 3}
                aria-label="Acercar imagen"
              >
                +
              </button>
            </div>
          </div>
        </div>
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
            <p className="pdp-tab-text">
              {product.description || "Descripción detallada del neumático y recomendaciones de ensamblaje en taller."}
            </p>
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
