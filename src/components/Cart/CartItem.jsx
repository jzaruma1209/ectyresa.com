import { useCart } from '../../hooks/useCart';
import './styles/CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item.productId);
    } else {
      updateQuantity(item.productId, newQuantity);
    }
  };

  const price = item.product.finalPrice || item.product.price;
  const subtotal = price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img
          src={item.product.image || '/placeholder-tire.png'}
          alt={item.product.name}
          onError={(e) => {
            e.target.src = '/placeholder-tire.png';
          }}
        />
      </div>
      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.product.name}</h3>
        <p className="cart-item-brand">{item.product.brand}</p>
        <p className="cart-item-measure">{item.product.measure}</p>
      </div>
      <div className="cart-item-quantity">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="quantity-btn"
        >
          -
        </button>
        <span className="quantity-value">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="quantity-btn"
        >
          +
        </button>
      </div>
      <div className="cart-item-price">
        <span className="price-per-unit">${price.toFixed(2)} c/u</span>
        <span className="price-subtotal">${subtotal.toFixed(2)}</span>
      </div>
      <button
        className="cart-item-remove"
        onClick={() => removeFromCart(item.productId)}
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;

