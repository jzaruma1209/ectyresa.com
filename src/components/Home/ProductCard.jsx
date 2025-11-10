import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import './styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const finalPrice = product.finalPrice || product.price;
  const hasDiscount = product.discount && product.discount > 0;

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-image">
        {hasDiscount && (
          <span className="product-discount-badge">
            -{product.discount}%
          </span>
        )}
        <img
          src={product.image || '/placeholder-tire.png'}
          alt={product.name}
          onError={(e) => {
            e.target.src = '/placeholder-tire.png';
          }}
        />
      </div>
      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-brand">{product.brand}</p>
        <p className="product-card-measure">{product.measure}</p>
        <div className="product-card-price">
          {hasDiscount && (
            <span className="product-card-original-price">
              ${product.price.toFixed(2)}
            </span>
          )}
          <span className="product-card-final-price">
            ${finalPrice.toFixed(2)}
          </span>
        </div>
        <button
          className="product-card-button"
          onClick={handleAddToCart}
        >
          Agregar al Carrito
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;

