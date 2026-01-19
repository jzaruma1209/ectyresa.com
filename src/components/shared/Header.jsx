import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CartIcon from "./CartIcon";
import "./styles/Header.css";

const Header = () => {
  const cartItemCount = useSelector((state) => state.cart.itemCount);

  return (
    <header className="header">
      {/* Top Bar - Red */}
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="top-bar-left">
            <span className="location-text">
              📍 ubicacion: la troncal av. 25 de agosto y galapagos
            </span>
          </div>
          <div className="top-bar-right">
            <div className="social-icons">
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon whatsapp"
              >
                W
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon facebook"
              >
                f
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon instagram"
              >
                📷
              </a>
            </div>
            <span className="login-text">Ingresar / registrarse</span>
            <span className="account-text">mi cuenta</span>
            <Link to="/cart" className="cart-link-top">
              carrito
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation - White */}
      <div className="main-nav">
        <div className="main-nav-container">
          <Link to="/" className="logo">
            <img src="/2.png" alt="ECTYRE S.A." className="logo-image" />
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">
              INICIO
            </Link>
            <Link to="/products" className="nav-link">
              PRODUCTOS
            </Link>
            <Link to="/marcas" className="nav-link">
              MARCAS
            </Link>
            <Link to="/liquidacion" className="nav-link">
              LIQUIDACIÓN
            </Link>
          </nav>
          <Link to="/cart" className="cart-link">
            <CartIcon itemCount={cartItemCount} />
          </Link>
        </div>
      </div>

      {/* Promo Banner - Black */}
      <div className="promo-banner">
        <div className="promo-content">
          <span className="promo-text">
            SUMER TIRE SALE - UP TO 20% OFF ALL BRANDS
          </span>
          <span className="promo-icon">🎁</span>
          <a href="#" className="promo-link">
            mas informacion.
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
