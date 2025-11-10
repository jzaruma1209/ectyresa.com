import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/Home/ProductGrid';
import './styles/SearchResultsPage.css';

const SearchResultsPage = () => {
  const filters = useSelector((state) => state.filters);
  const { products, loading, searchProducts } = useProducts();

  const hasFilters = useMemo(() => {
    return Object.values(filters).some(
      (value) => value !== null && value !== ''
    );
  }, [filters]);

  useEffect(() => {
    if (hasFilters) {
      searchProducts(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFilters, searchProducts]);

  if (loading) {
    return <div className="loading">Buscando productos...</div>;
  }

  return (
    <div className="search-results-page">
      <h1>Resultados de Búsqueda</h1>
      <div className="search-results-info">
        <p>
          {products.length > 0
            ? `Se encontraron ${products.length} productos`
            : 'No se encontraron productos'}
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
};

export default SearchResultsPage;

