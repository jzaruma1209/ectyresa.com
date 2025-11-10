import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CartIcon from "./CartIcon";
import "./styles/Header.css";

const Header = () => {
  const cartItemCount = useSelector((state) => state.cart.itemCount);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src="/2.png" alt="ECTYRE S.A." className="logo-image" />
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">
            Inicio
          </Link>
          <Link to="/products" className="nav-link">
            Productos
          </Link>
          <Link to="/cart" className="nav-link">
            Carrito
          </Link>
        </nav>
        <Link to="/cart" className="cart-link">
          <CartIcon itemCount={cartItemCount} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
