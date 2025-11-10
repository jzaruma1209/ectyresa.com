import './styles/ProductReviews.css';

const ProductReviews = ({ product }) => {
  // Datos de ejemplo - estos deberían venir de una API
  const reviews = product?.reviews || [];

  if (reviews.length === 0) {
    return (
      <div className="product-reviews">
        <h2>Reseñas</h2>
        <p>No hay reseñas todavía. Sé el primero en escribir una.</p>
      </div>
    );
  }

  return (
    <div className="product-reviews">
      <h2>Reseñas ({reviews.length})</h2>
      <div className="reviews-list">
        {reviews.map((review, index) => (
          <div key={index} className="review-item">
            <div className="review-header">
              <span className="review-author">{review.author}</span>
              <span className="review-rating">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </span>
            </div>
            <p className="review-text">{review.text}</p>
            <span className="review-date">{review.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;

