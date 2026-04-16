import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HomePage from "../pages/shop/HomePage";
import ProductDetailsPage from "../pages/shop/ProductDetailsPage";
import CartPage from "../pages/shop/CartPage";
import SearchResultsPage from "../pages/shop/SearchResultsPage";
import LoginPage from "../pages/shop/LoginPage";
import RegisterPage from "../pages/shop/RegisterPage";
import ProfilePage from "../pages/shop/ProfilePage";
import UbicacionPage from "../pages/shop/UbicacionPage";
import NotFoundPage from "../pages/shop/NotFoundPage";
import CheckoutPage from "../pages/shop/CheckoutPage";
import OrdersPage from "../pages/shop/OrdersPage";
import OrderDetailPage from "../pages/shop/OrderDetailPage";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import ScrollToTop from "../components/shared/ScrollToTop";

// ── Admin imports ──
import AdminLayout from "../components/admin/AdminLayout";
import AdminRoute from "../components/shared/AdminRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminPedidos from "../pages/admin/AdminPedidos";
import AdminClientes from "../pages/admin/AdminClientes";
import AdminProductos from "../pages/admin/AdminProductos";
import AdminInventario from "../pages/admin/AdminInventario";
import AdminReportes from "../pages/admin/AdminReportes";

export default function AppRouter() {
    return (
        <Router>
            <ScrollToTop />
            <div className="app">
                <Header />
                <main className="app-main">
                    <Routes>
                        {/* ═══════════════════════════════════════
                            RUTAS DE LA TIENDA (SHOP)
                            ═══════════════════════════════════════ */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/product/:id" element={<ProductDetailsPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/search" element={<SearchResultsPage />} />
                        <Route path="/ubicacion" element={<UbicacionPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/registro" element={<RegisterPage />} />
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
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="pedidos" element={<AdminPedidos />} />
                            <Route path="clientes" element={<AdminClientes />} />
                            <Route path="productos" element={<AdminProductos />} />
                            <Route path="inventario" element={<AdminInventario />} />
                            <Route path="reportes" element={<AdminReportes />} />
                        </Route>

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}
