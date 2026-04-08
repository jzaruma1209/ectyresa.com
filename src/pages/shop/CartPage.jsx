import { useCart } from "../../hooks/useCart";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import { useNavigate } from "react-router-dom";
import "../styles/CartPage.css";

const CartPage = () => {
  const { items, itemCount, loading } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0 && !loading) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega algunos productos para continuar</p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Ir a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Carrito de Compras</h1>
      <div className="cart-page-content">
        <div className="cart-page-items">
          <h2>Productos ({itemCount})</h2>
          {items.map((item) => (
            <CartItem key={item.cartItemId} item={item} />
          ))}
        </div>
        <div className="cart-page-summary">
          <CartSummary />
          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.2rem', backgroundColor: '#E60000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => navigate("/checkout")}
            disabled={loading}
          >
            Proceder al Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
