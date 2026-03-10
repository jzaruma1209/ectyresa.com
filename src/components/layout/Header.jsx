import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PromoBanner from "../../features/shared/PromoBanner";
import "../../features/shared/styles/Header.css";

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className={`header ${isHidden ? "header--hidden" : ""}`}>

      {/* ── TOP INFO BAR ── */}
      <div className="header-topbar">
        <div className="header-topbar-inner">
          <div className="topbar-left">
            <span className="topbar-item">
              <svg className="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" rx="1" />
                <path d="M16 8h4l3 4v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              Envío gratis
            </span>
            <span className="topbar-divider">|</span>
            <span className="topbar-item">
              <svg className="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Instalamos tus llantas
            </span>
          </div>
          <div className="topbar-right desktop-only">
            <a href="#" className="topbar-link">Seguimiento de pedido</a>
            <span className="topbar-divider">|</span>
            <a href="#" className="topbar-link">Sucursales</a>
          </div>
        </div>
      </div>

      {/* ── MAIN HEADER ── */}
      <div className="header-main">
        <div className="header-main-inner">

          {/* Logo */}
          <Link to="/" className="header-logo-link">
            <img src="/2.png" alt="ECTYRE S.A." className="header-logo-img" />
          </Link>

          {/* Search bar */}
          <div className="header-search-bar">
            <svg className="search-icon-left" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Busca llantas por medida, marca o vehículo..."
            />
            <button className="search-btn">BUSCAR</button>
          </div>

          {/* Right actions */}
          <div className="header-actions">
            {/* Chat */}
            <div className="action-chat desktop-only">
              <div className="chat-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="action-svg">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="online-dot"></span>
              </div>
            </div>

            {/* Mi Cuenta */}
            <Link to="/account" className="action-account desktop-only">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="action-svg">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <div className="account-text-block">
                <span className="account-label">MI CUENTA</span>
                <span className="account-sub">Ingresar</span>
              </div>
            </Link>

            {/* Carrito */}
            <Link to="/cart" className="action-cart">
              <div className="cart-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="action-svg cart-svg">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </div>
              <div className="account-text-block">
                <span className="account-label">CARRITO</span>
                <span className="account-sub">$0.00</span>
              </div>
            </Link>

            {/* Mobile hamburger */}
            <button
              className="hamburger-btn mobile-only"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="26" height="26">
                {menuOpen
                  ? <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
                  : <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* ── MOBILE DROPDOWN ── */}
      {menuOpen && (
        <nav className="mobile-nav">
          <Link to="/" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/account" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Mi Cuenta</Link>
          <Link to="/cart" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            Carrito {cartItemCount > 0 && `(${cartItemCount})`}
          </Link>
          <a href="#" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Sucursales</a>
          <a href="#" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Seguimiento de pedido</a>
        </nav>
      )}

      {/* ── PROMO BANNER (sin cambios) ── */}
      <PromoBanner />

    </header>
  );
};

export default Header;
