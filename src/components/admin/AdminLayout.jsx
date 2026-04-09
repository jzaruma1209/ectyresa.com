import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/auth.slice';
import adminService from '../../services/admin.service';
import './AdminLayout.css';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: '⚡', label: 'Dashboard' },
  { to: '/admin/pedidos', icon: '📦', label: 'Pedidos' },
  { to: '/admin/clientes', icon: '👥', label: 'Clientes' },
  { to: '/admin/productos', icon: '🛞', label: 'Productos' },
  { to: '/admin/inventario', icon: '📊', label: 'Inventario' },
  { to: '/admin/reportes', icon: '📈', label: 'Reportes' },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pedidosPendientes, setPedidosPendientes] = useState(0);

  // Polling de pedidos pendientes cada 60 segundos
  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const data = await adminService.getDashboard();
        setPedidosPendientes(data.pedidosPendientes || 0);
      } catch {
        // silencioso — no romper el layout por un fallo de polling
      }
    };

    fetchPendientes();
    const interval = setInterval(fetchPendientes, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className={`admin-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* ── SIDEBAR ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__logo">
            <span className="logo-e">E</span>ctyre
          </span>
          <span className="admin-sidebar__badge">Admin</span>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`
              }
            >
              <span className="admin-nav-item__icon">{icon}</span>
              <span className="admin-nav-item__label">{label}</span>
              {label === 'Pedidos' && pedidosPendientes > 0 && (
                <span className="admin-nav-item__badge">{pedidosPendientes}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">
              {user?.nombre?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="admin-sidebar__user-info">
              <span className="admin-sidebar__user-name">{user?.nombre || 'Administrador'}</span>
              <span className="admin-sidebar__user-role">Admin</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout} title="Cerrar sesión">
            🚪
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="admin-main">
        <header className="admin-header">
          <button
            className="admin-header__toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="admin-header__right">
            {pedidosPendientes > 0 && (
              <div className="admin-header__alert">
                🔔 {pedidosPendientes} pedido{pedidosPendientes !== 1 ? 's' : ''} pendiente{pedidosPendientes !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
