import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CartIcon from "./CartIcon";
import PromoBanner from "./PromoBanner";
import "./styles/Header.css";

const Header = () => {
  const cartItemCount = useSelector((state) => state.cart.itemCount);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY;

      if (scrollingDown && currentY > 80) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Cerrar menu al cambiar tamaño
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className={`header ${isHidden ? "header--hidden" : ""}`}>
      {/* Top Bar - Red */}
      <div className="top-bar">
        <div className="top-bar-container">
          {/* Desktop: ubicacion a la izquierda */}
          <div className="top-bar-left desktop-only">
            <span className="location-text">
              📍 ubicacion: la troncal av. 25 de agosto y galapagos
            </span>
          </div>

          {/* Mobile: social icons a la izquierda */}
          <div className="top-bar-left mobile-only">
            <div className="social-icons">
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp">W</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook">f</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram">📷</a>
            </div>
          </div>

          {/* Desktop: social + links a la derecha */}
          <div className="top-bar-right desktop-only">
            <div className="social-icons">
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp">W</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook">f</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram">📷</a>
            </div>
            <span className="login-text">Ingresar / registrarse</span>
            <span className="account-text">mi cuenta</span>
            <Link to="/cart" className="cart-link-top">carrito</Link>
          </div>

          {/* Mobile: carrito + hamburguesa a la derecha */}
          <div className="top-bar-right mobile-only">
            <Link to="/cart" className="mobile-cart-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && <span className="mobile-cart-badge">{cartItemCount}</span>}
            </Link>
            <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <a href="#" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Ingresar / Registrarse</a>
          <a href="#" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Mi cuenta</a>
          <Link to="/cart" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Carrito</Link>
        </div>
      )}

      {/* Main Navigation - White */}
      <div className="main-nav">
        <div className="main-nav-container">
          <Link to="/" className="logo">
            <img src="/2.png" alt="ECTYRE S.A." className="logo-image" />
          </Link>
          <nav className="nav desktop-only">
            <Link to="/" className="nav-link">INICIO</Link>
          </nav>
          <Link to="/cart" className="cart-link desktop-only">
            <CartIcon itemCount={cartItemCount} />
          </Link>
        </div>
      </div>

      {/* Promo Banner - Black */}
      <PromoBanner />
    </header>
  );
};

export default Header;
