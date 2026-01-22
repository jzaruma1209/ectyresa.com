import { useState } from 'react';
import './styles/ProductGallery.css';

const ProductGallery = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return <div>Cargando imágenes...</div>;
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : product.image
    ? [product.image]
    : ['/placeholder-tire.png'];

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <img
          src={images[selectedImage]}
          alt={product.name}
          onError={(e) => {
            e.target.src = '/placeholder-tire.png';
          }}
        />
      </div>
      {images.length > 1 && (
        <div className="product-gallery-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                onError={(e) => {
                  e.target.src = '/placeholder-tire.png';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;

