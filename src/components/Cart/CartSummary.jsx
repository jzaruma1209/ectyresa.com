import { useCart } from '../../hooks/useCart';
import './styles/CartSummary.css';

const CartSummary = () => {
  const { total, totalWithIVA, itemCount } = useCart();

  const iva = total * 0.16;

  return (
    <div className="cart-summary">
      <h2>Resumen del Carrito</h2>
      <div className="summary-details">
        <div className="summary-row">
          <span>Productos ({itemCount})</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>IVA (16%)</span>
          <span>${iva.toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>${totalWithIVA.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;

