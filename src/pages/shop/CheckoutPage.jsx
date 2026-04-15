import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import CartSummary from "../../components/cart/CartSummary";
import CheckoutForm from "../../components/cart/CheckoutForm";
import "../../features/cart/styles/CheckoutPage.css";

const CheckoutPage = () => {
  const { itemCount } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h2>Tu carrito está vacío</h2>
          <p>Debes agregar productos antes de hacer checkout.</p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Ver catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Finalizar Compra</h1>
      <div className="checkout-page-grid">
        <div>
          <CheckoutForm />
        </div>
        <div className="checkout-page-summary">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
