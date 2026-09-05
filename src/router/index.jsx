import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import AppLoader from "../components/shared/AppLoader";

// ── Layout (siempre presente) — NO lazy ──
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import ScrollToTop from "../components/shared/ScrollToTop";
import AuthModal from "../components/Auth/AuthModal";
import CartToast from "../components/cart/CartToast";
import AdminRoute from "../components/shared/AdminRoute";

// ── Shop pages — lazy loaded ──
const HomePage           = lazy(() => import("../pages/shop/HomePage"));
const ProductDetailsPage = lazy(() => import("../pages/shop/ProductDetailsPage"));
const CartPage           = lazy(() => import("../pages/shop/CartPage"));
const SearchResultsPage  = lazy(() => import("../pages/shop/SearchResultsPage"));
const LoginPage          = lazy(() => import("../pages/shop/LoginPage"));
const RegisterPage       = lazy(() => import("../pages/shop/RegisterPage"));
const ProfilePage        = lazy(() => import("../pages/shop/ProfilePage"));
const UbicacionPage      = lazy(() => import("../pages/shop/UbicacionPage"));
const NotFoundPage       = lazy(() => import("../pages/shop/NotFoundPage"));
const CheckoutPage       = lazy(() => import("../pages/shop/CheckoutPage"));
const OrdersPage         = lazy(() => import("../pages/shop/OrdersPage"));
const OrderDetailPage    = lazy(() => import("../pages/shop/OrderDetailPage"));
const AuthCallback       = lazy(() => import("../pages/shop/AuthCallback"));
const BrandCatalogPage   = lazy(() => import("../pages/shop/BrandCatalogPage"));

// ── Admin pages — lazy loaded (chunk separado) ──
const AdminLayout = lazy(() => import("../components/admin/AdminLayout"));

/**
 * Layout público: Header + contenido + Footer.
 * Se usa para todas las rutas de la tienda.
 */
function PublicLayout() {
  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <Suspense fallback={<AppLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default function AppRouter() {
  return (
    <Router>
      <ScrollToTop />
      <AuthModal />
      <CartToast />
      <Routes>

        {/* ═══════════════════════════════════════════════════
            RUTAS DEL ADMIN PANEL
            Full-page — sin Header/Footer del sitio.
            El SidebarProvider de shadcn necesita ser el
            contenedor raíz para que position:fixed funcione.
            ═══════════════════════════════════════════════ */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Suspense fallback={<AppLoader />}>
                <AdminLayout />
              </Suspense>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/:tab"
          element={
            <AdminRoute>
              <Suspense fallback={<AppLoader />}>
                <AdminLayout />
              </Suspense>
            </AdminRoute>
          }
        />

        <Route path="/admin2" element={<Navigate to="/admin" replace />} />
        <Route path="/admin2/*" element={<Navigate to="/admin" replace />} />

        {/* ═══════════════════════════════════════════════════
            RUTAS DE LA TIENDA (SHOP)
            Con Header y Footer del sitio.
            ═══════════════════════════════════════════════ */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/busqueda" element={<SearchResultsPage />} />
          <Route path="/search" element={<Navigate to="/busqueda" replace />} />
          <Route path="/ubicacion" element={<UbicacionPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/brand/:brandId" element={<BrandCatalogPage />} />
          <Route
            path="/perfil"
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
          />
          <Route
            path="/checkout"
            element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
          />
          <Route
            path="/mis-pedidos"
            element={<ProtectedRoute><OrdersPage /></ProtectedRoute>}
          />
          <Route
            path="/mis-pedidos/:id"
            element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

      </Routes>
    </Router>
  );
}
