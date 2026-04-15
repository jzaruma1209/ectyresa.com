import { useCart } from "../../hooks/useCart";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import { useNavigate } from "react-router-dom";
import "../styles/CartPage.css";

const CartPage = () => {
  const { items, itemCount, loading, error, clearError } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0 && !loading) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <span className="cart-empty-icon">🛒</span>
          <h2>Tu carrito está vacío</h2>
          <p>Agrega llantas para continuar con tu compra.</p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Ver catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Carrito de Compras</h1>

      {/* Error del backend */}
      {error && (
        <div className="cart-error-banner">
          <span>{error}</span>
          <button className="cart-error-dismiss" onClick={clearError}>×</button>
        </div>
      )}

      <div className="cart-page-content">
        {/* Columna izquierda: items */}
        <div className="cart-page-items">
          <h2>Productos ({itemCount})</h2>
          {loading && items.length === 0 ? (
            <div className="cart-loading-indicator">Cargando carrito...</div>
          ) : (
            items.map((item) => (
              <CartItem key={item.cartItemId} item={item} />
            ))
          )}
        </div>

        {/* Columna derecha: resumen + CTA */}
        <div className="cart-sidebar">
          <CartSummary />
          <button
            className="cart-checkout-cta"
            onClick={() => navigate("/checkout")}
            disabled={loading || itemCount === 0}
          >
            {loading ? "Actualizando..." : "Proceder al Checkout →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
