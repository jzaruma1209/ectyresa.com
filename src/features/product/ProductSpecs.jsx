import './styles/ProductSpecs.css';

const ProductSpecs = ({ product }) => {
  if (!product || !product.specs) {
    return <div>Especificaciones no disponibles</div>;
  }

  const specs = product.specs;

  return (
    <div className="product-specs">
      <h2>Especificaciones Técnicas</h2>
      <div className="specs-grid">
        {specs.loadIndex && (
          <div className="spec-item">
            <span className="spec-label">Índice de Carga:</span>
            <span className="spec-value">{specs.loadIndex}</span>
          </div>
        )}
        {specs.speedIndex && (
          <div className="spec-item">
            <span className="spec-label">Índice de Velocidad:</span>
            <span className="spec-value">{specs.speedIndex}</span>
          </div>
        )}
        {specs.width && (
          <div className="spec-item">
            <span className="spec-label">Ancho:</span>
            <span className="spec-value">{specs.width} mm</span>
          </div>
        )}
        {specs.height && (
          <div className="spec-item">
            <span className="spec-label">Alto:</span>
            <span className="spec-value">{specs.height}%</span>
          </div>
        )}
        {specs.rim && (
          <div className="spec-item">
            <span className="spec-label">Rin:</span>
            <span className="spec-value">{specs.rim} pulgadas</span>
          </div>
        )}
        {specs.terrain && (
          <div className="spec-item">
            <span className="spec-label">Terreno:</span>
            <span className="spec-value">{specs.terrain}</span>
          </div>
        )}
        {specs.category && (
          <div className="spec-item">
            <span className="spec-label">Categoría:</span>
            <span className="spec-value">{specs.category}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSpecs;

