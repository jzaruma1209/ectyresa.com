import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Guard de ruta exclusivo para el panel de administración.
 * Verifica:
 *   1. Que el usuario esté autenticado (token presente)
 *   2. Que el rol del usuario sea "admin"
 *
 * Si alguna condición falla → redirige a /login (el login normal del sitio)
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
