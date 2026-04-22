import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
const AdminLayout    = lazy(() => import("../components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminPedidos   = lazy(() => import("../pages/admin/AdminPedidos"));
const AdminClientes  = lazy(() => import("../pages/admin/AdminClientes"));
const AdminProductos = lazy(() => import("../pages/admin/AdminProductos"));
const AdminInventario = lazy(() => import("../pages/admin/AdminInventario"));
const AdminCatalogos  = lazy(() => import("../pages/admin/AdminCatalogos"));
const AdminReportes  = lazy(() => import("../pages/admin/AdminReportes"));

export default function AppRouter() {
    return (
        <Router>
            <ScrollToTop />
            <AuthModal />
            <CartToast />
            <div className="app">
                <Header />
                <main className="app-main">
                    {/* Suspense raíz: muestra AppLoader mientras se descarga cualquier chunk de ruta */}
                    <Suspense fallback={<AppLoader />}>
                        <Routes>
                            {/* ═══════════════════════════════════════
                                RUTAS DE LA TIENDA (SHOP)
                                ═══════════════════════════════════════ */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/product/:id" element={<ProductDetailsPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            
                            {/* NUEVA RUTA DE BÚSQUEDA */}
                            <Route path="/busqueda" element={<SearchResultsPage />} />
                            
                            {/* MANTENER ALIAS /search POR SI ACASO */}
                            <Route path="/search" element={<Navigate to="/busqueda" replace />} />
                            
                            <Route path="/ubicacion" element={<UbicacionPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/registro" element={<RegisterPage />} />
                            {/* ── Ruta callback Google OAuth ── */}
                            <Route path="/auth/callback" element={<AuthCallback />} />
                            
                            {/* ── Ruta Marca ── */}
                            <Route path="/brand/:brandId" element={<BrandCatalogPage />} />
                            
                            <Route
                                path="/perfil"
                                element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/checkout"
                                element={
                                    <ProtectedRoute>
                                        <CheckoutPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/mis-pedidos"
                                element={
                                    <ProtectedRoute>
                                        <OrdersPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/mis-pedidos/:id"
                                element={
                                    <ProtectedRoute>
                                        <OrderDetailPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* ═══════════════════════════════════════
                                RUTAS DEL ADMIN PANEL
                                Integrado dentro del mismo sitio
                                con Header y Footer visibles.
                                ═══════════════════════════════════════ */}
                            <Route
                                path="/admin"
                                element={
                                    <AdminRoute>
                                        <AdminLayout />
                                    </AdminRoute>
                                }
                            >
                                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                                <Route path="dashboard"  element={<AdminDashboard />} />
                                <Route path="pedidos"    element={<AdminPedidos />} />
                                <Route path="clientes"   element={<AdminClientes />} />
                                <Route path="productos"  element={<AdminProductos />} />
                                <Route path="inventario" element={<AdminInventario />} />
                                <Route path="catalogos"  element={<AdminCatalogos />} />
                                <Route path="reportes"   element={<AdminReportes />} />
                            </Route>

                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Suspense>
                </main>
                <Footer />
            </div>
        </Router>
    );
}
