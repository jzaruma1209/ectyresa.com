import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import PromoBanner from "../../features/shared/PromoBanner";
import SearchMegaMenu from "../ui/SearchMegaMenu";
import "../../features/shared/styles/Header.css";

const searchMegaMenuItems = [
  {
    label: "Llantas",
    bgColor: "#F5F5F5",
    textColor: "#000000",
    links: [
      { label: "Aro 12", href: "/busqueda?q=R12" },
      { label: "Aro 13", href: "/busqueda?q=R13" },
      { label: "Aro 14", href: "/busqueda?q=R14" },
      { label: "Aro 15", href: "/busqueda?q=R15" }
    ]
  },
  {
    label: "Aros", 
    bgColor: "#F5F5F5",
    textColor: "#000000",
    links: [
      { label: "Deportivos", href: "/busqueda?q=deportivos" },
      { label: "Clásicos", href: "/busqueda?q=clasicos" },
      { label: "Off-Road", href: "/busqueda?q=off-road" }
    ]
  },
  {
    label: "Accesorios",
    bgColor: "#FFFFFF", 
    textColor: "#000000",
    links: [
      { label: "Moquetas", href: "/busqueda?q=moquetas" },
      { label: "Conos de seguridad", href: "/busqueda?q=conos" },
      { label: "Kits de emergencia", href: "/busqueda?q=kits" }
    ]
  }
];

const Header = () => {
  const cartItemCount = useSelector((state) => state.cart.itemCount);
  const cartTotal = useSelector((state) => state.cart.total);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchWrapperRef = useRef(null);

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
    const handleClickOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setSearchFocused(false);
      navigate(`/busqueda?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Nombre a mostrar en el Header
  const displayName = user?.nombres
    ? user.nombres.split(' ')[0]
    : 'Mi Cuenta';

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
              Envío a todo el Ecuador
            </span>
            <span className="topbar-divider">|</span>
            <span className="topbar-item">
              <svg className="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Instalamos tus llantas
            </span>
          </div>
          <div className="topbar-right desktop-only" style={{ zIndex: 10, position: 'relative' }}>
            <a href="#" className="topbar-link">Seguimiento de pedido</a>
            <span className="topbar-divider">|</span>
            <a href="/ubicacion" className="topbar-link">Sucursales</a>
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
          <div ref={searchWrapperRef} style={{ flexGrow: 1, position: 'relative' }}>
            <form onSubmit={handleSearch} className={`header-search-bar ${searchFocused ? 'focused' : ''}`}>
              <svg className="search-icon-left" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Busca llantas por medida, marca o vehículo..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleKeyDown}
              />
              <button type="submit" className="search-btn">BUSCAR</button>
            </form>
            
            <SearchMegaMenu isOpen={searchFocused} items={searchMegaMenuItems} onClose={() => setSearchFocused(false)} />
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

            {/* Mi Cuenta — cambia según estado de autenticación */}
            {isAuthenticated ? (
                <div className="action-account desktop-only action-account--logged">
                  <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1rem', alignItems: 'flex-start' }}>
                    <Link to="/perfil" className="account-text-block" style={{ color: 'white', textDecoration: 'none', marginBottom: '4px', fontSize: '0.9rem' }}>
                      <span className="account-label">HOLA, {displayName}</span>
                      <span className="account-sub" style={{ textDecoration: 'underline' }}>Mi Perfil</span>
                    </Link>

                    {user?.role === 'admin' ? (
                       <Link to="/admin" className="account-text-block" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem' }}>
                         <span className="account-sub" style={{ color: '#E60000', fontWeight: 'bold' }}>Panel Admin</span>
                       </Link>
                    ) : (
                      <Link to="/mis-pedidos" className="account-text-block" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem' }}>
                        <span className="account-sub" style={{ color: '#E60000', fontWeight: 'bold' }}>Mis Pedidos</span>
                      </Link>
                    )}

                  </div>
                  <button className="header-logout-btn" onClick={handleLogout} title="Cerrar sesión">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link to="/login" className="action-account desktop-only">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="action-svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <div className="account-text-block">
                  <span className="account-label">MI CUENTA</span>
                  <span className="account-sub">Ingresar</span>
                </div>
              </Link>
            )}

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
                <span className="account-sub">${(cartTotal || 0).toFixed(2)}</span>
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
          {isAuthenticated ? (
            <>
              <Link to="/perfil" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                Mi Perfil ({displayName})
              </Link>
              
              {user?.role === 'admin' ? (
                <Link to="/admin" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                  Panel Admin
                </Link>
              ) : (
                <Link to="/mis-pedidos" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                  Mis Pedidos
                </Link>
              )}

              <button className="mobile-nav-link mobile-nav-btn" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Iniciar Sesión</Link>
          )}
          <Link to="/cart" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            Carrito {cartItemCount > 0 && `(${cartItemCount})`}
          </Link>
          <a href="/ubicacion" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Sucursales</a>
          <a href="#" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Seguimiento de pedido</a>
        </nav>
      )}

      {/* ── PROMO BANNER (sin cambios) ── */}
      <PromoBanner />

    </header>
  );
};

export default Header;
