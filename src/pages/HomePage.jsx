import { useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import SearchByMeasure from '../components/Home/SearchByMeasure';
import SearchByVehicle from '../components/Home/SearchByVehicle';
import FilterByCategory from '../components/Home/FilterByCategory';
import FilterByTerrain from '../components/Home/FilterByTerrain';
import ProductGrid from '../components/Home/ProductGrid';
import './styles/HomePage.css';

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
      <div className="home-page-header">
        <h1>Encuentra las Mejores Llantas</h1>
        <p>Busca por medida, vehículo o explora nuestras categorías</p>
      </div>

      <div className="home-page-search">
        <SearchByMeasure />
        <SearchByVehicle />
      </div>

      <div className="home-page-filters">
        <FilterByCategory />
        <FilterByTerrain />
      </div>

      <div className="home-page-products">
        <h2>Productos Destacados</h2>
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default HomePage;

