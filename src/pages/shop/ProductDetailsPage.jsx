import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useProducts } from "../../hooks/useProducts";
import { useCart } from "../../hooks/useCart";
import { openAuthModal } from "../../store/slices/authModal.slice";
import "../styles/ProductDetailsPage.css";

/* ── Imágenes de galería de respaldo mientras llegan las fotos reales ── */
const PLACEHOLDER_GALLERY = [
  "/llanta1.png",
  "/llanta2.png",
  "/llanta1.png",
  "/llanta2.png",
];

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, loadProductById } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [mainImg, setMainImg]   = useState(0);
  const [qty, setQty]           = useState(1);
  const [added, setAdded]       = useState(false);

  useEffect(() => {
    if (id) loadProductById(id);
  }, [id, loadProductById]);

  /* ── Galería: usa imágenes reales del producto o los placeholders ── */
  const gallery =
    selectedProduct?.images?.length > 0
      ? selectedProduct.images
      : selectedProduct?.image
      ? [selectedProduct.image, ...PLACEHOLDER_GALLERY.slice(1)]
      : PLACEHOLDER_GALLERY;

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    if (!isAuthenticated) {
      dispatch(openAuthModal({ type: 'ADD_TO_CART', payload: selectedProduct, quantity: qty }));
      return;
    }

    addToCart(selectedProduct, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  /* ── Estados de carga / error ── */
  if (loading) {
    return (
      <div className="pdp-loading">
        <div className="pdp-spinner" />
        <p>Cargando producto…</p>
      </div>
    );
  }

  /* Si no hay producto real, usamos datos de demostración para que la página no quede vacía */
  const product = selectedProduct || {
    id,
    name: "Llanta Todo Terreno 265/70R16",
    brand: "Trazano",
    measure: "265/70R16",
    price: 179.98,
    finalPrice: 89.99,
    discount: 50,
    inStock: true,
    stock: 12,
    description:
      "Llanta de alto rendimiento diseñada para todo tipo de terreno. Perfecta para camionetas y SUVs que necesitan agarre en carretera y fuera de ella. Construida con compuesto de caucho de alta tecnología para mayor durabilidad.",
    specs: {
      width: "265",
      height: "70",
      rim: "16",
      loadIndex: "112",
      speedIndex: "S",
      terrain: "Todo Terreno",
      category: "4x4 / SUV",
    },
  };

  const finalPrice  = product.finalPrice || product.price;
  const hasDiscount = product.discount && product.discount > 0;
  const [intPart, decPart] = Number(finalPrice).toFixed(2).split(".");

  return (
    <div className="pdp-page">

      {/* ── Breadcrumb ── */}
      <nav className="pdp-breadcrumb">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <Link to="/search">Tienda</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      {/* ══════════════════════════════════════
          SECCIÓN PRINCIPAL: Galería + Info
      ══════════════════════════════════════ */}
      <div className="pdp-main">

        {/* ── Galería izquierda ── */}
        <div className="pdp-gallery">
          {/* Tiras de miniaturas */}
          <div className="pdp-thumbnails">
            {gallery.map((src, i) => (
              <button
                key={i}
                className={`pdp-thumb ${mainImg === i ? "active" : ""}`}
                onClick={() => setMainImg(i)}
              >
                <img src={src} alt={`Vista ${i + 1}`} onError={(e) => (e.target.src = "/llanta1.png")} />
              </button>
            ))}
          </div>

          {/* Imagen principal */}
          <div className="pdp-main-image">
            {hasDiscount && (
              <span className="pdp-badge-discount">-{product.discount}%</span>
            )}
            <img
              src={gallery[mainImg]}
              alt={product.name}
              onError={(e) => (e.target.src = "/llanta1.png")}
            />
          </div>
        </div>

        {/* ── Panel de información derecha ── */}
        <div className="pdp-info">

          {/* Marca + nombre */}
          <p className="pdp-brand">{product.brand}</p>
          <h1 className="pdp-name">{product.name}</h1>
          <p className="pdp-measure">{product.measure}</p>

          {/* Precios */}
          <div className="pdp-price-block">
            {hasDiscount && (
              <span className="pdp-price-original">${Number(product.price).toFixed(2)}</span>
            )}
            <div className="pdp-price-final">
              <span className="pdp-price-int">${intPart}</span>
              <sup className="pdp-price-dec">.{decPart}</sup>
              <span className="pdp-price-tax">+ IVA</span>
            </div>
            {hasDiscount && (
              <span className="pdp-price-savings">
                Ahorras ${(Number(product.price) - Number(finalPrice)).toFixed(2)}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="pdp-divider" />

          {/* Stock */}
          <div className={`pdp-stock ${product.inStock ? "in" : "out"}`}>
            {product.inStock ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                En stock · {product.stock || "✓"} disponibles
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Sin stock
              </>
            )}
          </div>

          {/* Selector de cantidad + botón agregar */}
          <div className="pdp-actions">
            <div className="pdp-qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>

            <button
              className={`pdp-add-btn ${added ? "added" : ""}`}
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {added ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  ¡Agregado!
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  Agregar al Carrito
                </>
              )}
            </button>
          </div>

          {/* Beneficios */}
          <div className="pdp-benefits">
            <div className="pdp-benefit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span>Envío a todo el país</span>
            </div>
            <div className="pdp-benefit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Garantía de calidad Ectyre</span>
            </div>
            <div className="pdp-benefit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Entrega estimada: 24–48 hrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          TABS: Descripción / Especificaciones
      ══════════════════════════════════════ */}
      <ProductTabs product={product} />

    </div>
  );
};

/* ── Sub-componente de Tabs ── */
const ProductTabs = ({ product }) => {
  const [tab, setTab] = useState("desc");

  const specs = product.specs || {};
  const specRows = [
    { label: "Ancho",              value: specs.width     ? `${specs.width} mm`       : null },
    { label: "Perfil",             value: specs.height    ? `${specs.height}%`         : null },
    { label: "Rin",                value: specs.rim       ? `${specs.rim}"`            : null },
    { label: "Índice de Carga",    value: specs.loadIndex || null },
    { label: "Índice de Velocidad",value: specs.speedIndex || null },
    { label: "Tipo de Terreno",    value: specs.terrain   || null },
    { label: "Categoría",          value: specs.category  || null },
  ].filter((r) => r.value);

  return (
    <div className="pdp-tabs">
      <div className="pdp-tab-headers">
        <button className={tab === "desc"  ? "active" : ""} onClick={() => setTab("desc")}>Descripción</button>
        <button className={tab === "specs" ? "active" : ""} onClick={() => setTab("specs")}>Especificaciones</button>
      </div>

      {tab === "desc" && (
        <div className="pdp-tab-content">
          <p>{product.description || "Descripción no disponible para este producto."}</p>
        </div>
      )}

      {tab === "specs" && (
        <div className="pdp-tab-content">
          {specRows.length > 0 ? (
            <table className="pdp-specs-table">
              <tbody>
                {specRows.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Especificaciones no disponibles.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
