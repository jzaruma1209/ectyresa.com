import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HomePage from "../pages/shop/HomePage";
import ProductDetailsPage from "../pages/shop/ProductDetailsPage";
import CartPage from "../pages/shop/CartPage";
import SearchResultsPage from "../pages/shop/SearchResultsPage";
import NotFoundPage from "../pages/shop/NotFoundPage";

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
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}
