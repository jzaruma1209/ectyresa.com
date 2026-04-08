import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import CartSummary from "../../components/cart/CartSummary";
import CheckoutForm from "../../components/cart/CheckoutForm";
import "../../features/cart/styles/CheckoutPage.css"; // Crearemos este archivo si es necesario o podemos usar el de CartPage temporalmente

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
            Ir a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Finalizar Compra</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <CheckoutForm />
        </div>
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
