import { useCart } from '../../hooks/useCart';
import '../../features/cart/styles/CartSummary.css';

const CartSummary = () => {
  // Los totales ahora vienen directamente del backend (Regla 4.6),
  // a través de useCart(), que expone subtotal, iva y total.
  const { subtotal, iva, total, itemCount, loading } = useCart();

  return (
    <div className="cart-summary">
      <h2>Resumen del Carrito</h2>
      <div className="summary-details">
        <div className="summary-row">
          <span>Productos ({itemCount})</span>
          <span>${(subtotal || 0).toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>IVA (15%)</span>
          <span>${(iva || 0).toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>${(total || 0).toFixed(2)}</span>
        </div>
      </div>
      {loading && (
        <div className="cart-summary-loading">
          <small>Actualizando...</small>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
