import ProductCard from './ProductCard';
import './styles/ProductGrid.css';

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

export default ProductGrid;

