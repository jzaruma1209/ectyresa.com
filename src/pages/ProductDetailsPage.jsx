import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductGallery from '../components/ProductDetails/ProductGallery';
import ProductInfo from '../components/ProductDetails/ProductInfo';
import ProductSpecs from '../components/ProductDetails/ProductSpecs';
import ProductReviews from '../components/ProductDetails/ProductReviews';
import InstallInfo from '../components/ProductDetails/InstallInfo';
import './styles/ProductDetailsPage.css';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { selectedProduct, loading, loadProductById } = useProducts();

  useEffect(() => {
    if (id) {
      loadProductById(id);
    }
  }, [id, loadProductById]);

  if (loading) {
    return <div className="loading">Cargando producto...</div>;
  }

  if (!selectedProduct) {
    return <div className="error">Producto no encontrado</div>;
  }

  return (
    <div className="product-details-page">
      <div className="product-details-main">
        <div className="product-details-gallery">
          <ProductGallery product={selectedProduct} />
        </div>
        <div className="product-details-info">
          <ProductInfo product={selectedProduct} />
        </div>
      </div>
      <div className="product-details-specs">
        <ProductSpecs product={selectedProduct} />
      </div>
      <div className="product-details-reviews">
        <ProductReviews product={selectedProduct} />
      </div>
      <div className="product-details-install">
        <InstallInfo />
      </div>
    </div>
  );
};

export default ProductDetailsPage;

