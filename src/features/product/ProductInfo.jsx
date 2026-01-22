import { useCart } from '../../hooks/useCart';
import './styles/ProductInfo.css';

const ProductInfo = ({ product }) => {
  const { addToCart } = useCart();

  if (!product) {
    return <div>Cargando producto...</div>;
  }

  const finalPrice = product.finalPrice || product.price;
  const hasDiscount = product.discount && product.discount > 0;

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="product-info">
      <h1 className="product-info-name">{product.name}</h1>
      <p className="product-info-brand">{product.brand}</p>
      <p className="product-info-measure">{product.measure}</p>
      
      <div className="product-info-price">
        {hasDiscount && (
          <span className="product-info-original-price">
            ${product.price.toFixed(2)}
          </span>
        )}
        <span className="product-info-final-price">
          ${finalPrice.toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="product-info-discount">
            -{product.discount}% de descuento
          </span>
        )}
      </div>

      <div className="product-info-description">
        <h3>Descripción</h3>
        <p>{product.description || 'Descripción no disponible'}</p>
      </div>

      <div className="product-info-stock">
        {product.inStock ? (
          <span className="stock-available">
            ✓ En stock ({product.stock} disponibles)
          </span>
        ) : (
          <span className="stock-unavailable">✗ Sin stock</span>
        )}
      </div>

      <button
        className="product-info-add-to-cart"
        onClick={handleAddToCart}
        disabled={!product.inStock}
      >
        Agregar al Carrito
      </button>
    </div>
  );
};

export default ProductInfo;

