import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HomePage from "../pages/shop/HomePage";
import ProductDetailsPage from "../pages/shop/ProductDetailsPage";
import CartPage from "../pages/shop/CartPage";
import SearchResultsPage from "../pages/shop/SearchResultsPage";
import LoginPage from "../pages/shop/LoginPage";
import RegisterPage from "../pages/shop/RegisterPage";
import ProfilePage from "../pages/shop/ProfilePage";
import NotFoundPage from "../pages/shop/NotFoundPage";
import CheckoutPage from "../pages/shop/CheckoutPage";
import OrdersPage from "../pages/shop/OrdersPage";
import OrderDetailPage from "../pages/shop/OrderDetailPage";
import ProtectedRoute from "../components/shared/ProtectedRoute";

export default function AppRouter() {
    return (
        <Router>
            <div className="app">
                <Header />
                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/product/:id" element={<ProductDetailsPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/search" element={<SearchResultsPage />} />
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
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}
