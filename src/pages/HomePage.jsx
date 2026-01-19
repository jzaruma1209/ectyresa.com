import { useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import SearchByMeasure from "../components/Home/SearchByMeasure";
import SearchByVehicle from "../components/Home/SearchByVehicle";
import FilterByCategory from "../components/Home/FilterByCategory";
import FilterByTerrain from "../components/Home/FilterByTerrain";
import ProductGrid from "../components/Home/ProductGrid";
import "./styles/HomePage.css";

const HomePage = () => {
  const { products, loading, loadProducts } = useProducts();

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="home-page">
      {/* Hero Section with Banner */}

      <section className="hero-section">
        <div className="hero-left-column">
          <div className="hero-banner">
            <img
              src="/1.png"
              alt="Banner promocional"
              className="hero-banner-image"
            />
          </div>

          <div className="hero-search-wrapper">
            <div className="hero-search-section">
              <div className="search-cards-grid">
                <div className="search-card-mini">
                  <SearchByVehicle />
                </div>
                <div className="search-card-mini">
                  <SearchByMeasure />
                </div>
                <div className="search-card-mini">
                  <SearchByVehicle />
                </div>
                <div className="search-card-mini">
                  <SearchByMeasure />
                </div>
              </div>
            </div>

            {/* Main Search Box */}
            <div className="main-search-box">
              <h2 className="search-box-title">
                Search The Ultimate Tire & Wheel Source
              </h2>

              <button className="search-option-btn primary">
                🚗 Shop by Vehicle
              </button>

              <button className="search-option-btn primary">
                📏 Search By Size
              </button>

              <div className="browse-category">
                <h3>Browse By Category</h3>
                <div className="category-grid">
                  <div className="category-item">
                    <div className="category-icon">⭕</div>
                    <span>Tires</span>
                  </div>
                  <div className="category-item">
                    <div className="category-icon">⚙️</div>
                    <span>Wheels</span>
                  </div>
                  <div className="category-item">
                    <div className="category-icon">📦</div>
                    <span>Packages</span>
                  </div>
                  <div className="category-item">
                    <div className="category-icon">🔧</div>
                    <span>Accessories</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="zone-content">
          <div className="zone-right">
            <img src="/1.png" alt="Vehículo" className="zone-image" />
          </div>
          <div className="zone-left">
            <div className="zone-card">
              <div className="zone-logo">ZONE B</div>
              <p className="zone-text">¿Es tu primera vez?</p>
              <button className="zone-btn">¡Te ayudaremos! →</button>
            </div>
          </div>
        </div>
      </section>



        {/* Filters Section, aqui estan los componenesque se  van a usar para mi card asi poder usarlo para filtrar por tipo de llanta */}
            <div className="home-page-filters">
              <FilterByCategory />
              <FilterByTerrain />
            </div>
      {/* Products Section esto es  mi card para poder generar o crear las card*/}
      <div className="home-page-products">
        <h2>Productos Destacados</h2>
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default HomePage;
