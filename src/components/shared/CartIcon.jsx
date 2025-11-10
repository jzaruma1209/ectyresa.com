import { FaShoppingCart } from 'react-icons/fa';
import './styles/CartIcon.css';

const CartIcon = ({ itemCount = 0 }) => {
  return (
    <div className="cart-icon">
      <FaShoppingCart className="cart-icon-svg" />
      {itemCount > 0 && (
        <span className="cart-icon-badge">{itemCount}</span>
      )}
    </div>
  );
};

export default CartIcon;

