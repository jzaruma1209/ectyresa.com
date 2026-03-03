import PropTypes from 'prop-types';
import ProductCard from './ProductCard';
import '../../features/home/styles/ProductGrid.css';

const ProductGrid = ({ products = [] }) => {
  if (products.length === 0) {
    return (
      <div className="product-grid-empty">
        <p>No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ),
};

export default ProductGrid;

