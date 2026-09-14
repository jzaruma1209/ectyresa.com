import { useMemo } from "react";
import PropTypes from "prop-types";
import "./SearchFilters.css";

/**
 * Filtros laterales (marca, categoría, precio) para los resultados de búsqueda.
 * Las opciones de marca/categoría se derivan de los productos ya cargados
 * (no hay endpoint de filtros en el backend), por lo que solo listan valores
 * presentes en los resultados actuales.
 */
const SearchFilters = ({ products, filters, onChange, onClear }) => {
  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean));
    return Array.from(set).sort();
  }, [products]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(set).sort();
  }, [products]);

  const maxPrice = useMemo(() => {
    const max = Math.max(0, ...products.map((p) => p.finalPrice ?? p.price ?? 0));
    return Math.ceil(max) || 0;
  }, [products]);

  const hasActiveFilters =
    filters.brand !== "all" || filters.category !== "all" || filters.maxPrice !== null;

  const toggleBrand = (brand) => {
    onChange({ ...filters, brand: filters.brand === brand ? "all" : brand });
  };

  const toggleCategory = (category) => {
    onChange({ ...filters, category: filters.category === category ? "all" : category });
  };

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    onChange({ ...filters, maxPrice: value });
  };

  if (products.length === 0) return null;

  return (
    <aside className="search-filters">
      <div className="search-filters-header">
        <h3>Filtros</h3>
        {hasActiveFilters && (
          <button type="button" className="search-filters-clear" onClick={onClear}>
            Limpiar
          </button>
        )}
      </div>

      {brands.length > 1 && (
        <div className="search-filters-group">
          <h4>Marca</h4>
          <ul className="search-filters-list">
            {brands.map((brand) => (
              <li key={brand}>
                <label className="search-filters-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.brand === brand}
                    onChange={() => toggleBrand(brand)}
                  />
                  <span>{brand}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {categories.length > 1 && (
        <div className="search-filters-group">
          <h4>Categoría</h4>
          <ul className="search-filters-list">
            {categories.map((category) => (
              <li key={category}>
                <label className="search-filters-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.category === category}
                    onChange={() => toggleCategory(category)}
                  />
                  <span>{category}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {maxPrice > 0 && (
        <div className="search-filters-group">
          <h4>Precio máximo</h4>
          <input
            type="range"
            min="0"
            max={maxPrice}
            step="1"
            value={filters.maxPrice ?? maxPrice}
            onChange={handlePriceChange}
            className="search-filters-range"
          />
          <div className="search-filters-price-value">
            Hasta ${(filters.maxPrice ?? maxPrice).toFixed(2)}
          </div>
        </div>
      )}
    </aside>
  );
};

SearchFilters.propTypes = {
  products: PropTypes.array.isRequired,
  filters: PropTypes.shape({
    brand: PropTypes.string,
    category: PropTypes.string,
    maxPrice: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default SearchFilters;
