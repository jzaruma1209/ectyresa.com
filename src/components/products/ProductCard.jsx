import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useCart } from '../../hooks/useCart';
import { openAuthModal } from '../../store/slices/authModal.slice';
import '../../features/home/styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const phoneNumber = "593999601748";
    const message = `Hola, estoy interesado en el producto: ${product.name} y la cantidad: 1 por ahora.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const finalPrice = product.finalPrice || product.price;
  const hasDiscount = product.discount && product.discount > 0;

  return (
    <Link to={`/product/${product.id}`} className="product-card" target="_blank" rel="noopener noreferrer">
      <div className="product-card-image">
        {hasDiscount && (
          <span className="product-discount-badge">
            -{product.discount}%
          </span>
        )}
        <img
          src={product.image || '/placeholder-tire.png'}
          alt={product.name}
          loading="lazy"
          decoding="async"
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

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string,
    measure: PropTypes.string,
    price: PropTypes.number.isRequired,
    finalPrice: PropTypes.number,
    discount: PropTypes.number,
    image: PropTypes.string,
  }).isRequired,
};

export default ProductCard;
