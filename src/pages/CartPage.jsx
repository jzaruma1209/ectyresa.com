import { useCart } from '../hooks/useCart';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';
import CheckoutForm from '../components/Cart/CheckoutForm';
import { useNavigate } from 'react-router-dom';
import './styles/CartPage.css';

const CartPage = () => {
  const { items, itemCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = (data) => {
    console.log('Checkout data:', data);
    // Aquí iría la lógica para procesar el checkout
    alert('¡Gracias por tu compra! (Esta es una demostración)');
  };

  if (itemCount === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega algunos productos para continuar</p>
          <button onClick={() => navigate('/')} className="btn-primary">
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
            <CartItem key={item.productId} item={item} />
          ))}
        </div>
        <div className="cart-page-summary">
          <CartSummary />
          <CheckoutForm onSubmit={handleCheckout} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;

