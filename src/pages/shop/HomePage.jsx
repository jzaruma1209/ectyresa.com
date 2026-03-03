import { useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import FilterByCategory from "../../components/products/FilterByCategory";
import FilterByTerrain from "../../components/products/FilterByTerrain";
import ProductGrid from "../../components/products/ProductGrid";
import HeroBanner from "../../components/products/HeroBanner";
import HeroSearchOptions from "../../components/products/HeroSearchOptions";
import MainSearchBox from "../../components/products/MainSearchBox";
import HeroRightColumn from "../../components/products/HeroRightColumn";
import "../styles/HomePage.css";

const HomePage = () => {
  const { products, loadProducts } = useProducts();

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="home-page">
      {/* Hero Section with Banner */}

      <section className="hero-section">
        <div className="hero-left-column">
          {/* esta es la parte del banner que se va a usar para mostrar las imagenes de promocion y tambien se puede usar para mostrar promociones especiales o algo asi 
        <div className="hero-banner">
            <HeroBanner />
          </div>
        */}

          <div className="hero-search-wrapper">
            <HeroSearchOptions />

            {/* Main Search Box */}
            <MainSearchBox />
          </div>


        </div>
        <HeroRightColumn />
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
