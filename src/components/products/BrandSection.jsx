import PropTypes from "prop-types";
import TireCard from "./TireCard";

/**
 * BrandSection — Sección de marca con header a la izquierda (logo + nombre)
 * y un grid horizontal de tarjetas de productos.
 */
const BrandSection = ({ brand, products }) => {
  return (
    <section className="brand-section">
      <div className="brand-section-inner">
        {/* ── HEADER IZQUIERDO ── */}
        <div className="brand-section-header">
          <div className="brand-logo-wrapper">
            <img
              src={brand.logo}
              alt={brand.name}
              className="brand-logo-img"
            />
          </div>
          <div className="brand-meta">
            <h2 className="brand-section-title">{brand.name}</h2>
            <p className="brand-section-tagline">{brand.tagline}</p>
            <a href={brand.link || "#"} className="brand-see-all-btn">
              Ver todos →
            </a>
          </div>
        </div>

        {/* ── GRID DE CARDS ── */}
        <div className="brand-cards-scroll">
          {products.map((product, i) => (
            <TireCard
              key={i}
              product={{
                ...product,
                name: product.title, // Mapping title to name
                // ensure price is there
                price: product.price,
                image: product.image
              }}
              brandLogoSrc={brand.logo}
              sashSrc={null}
              pvp={product.originalPrice || undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

BrandSection.propTypes = {
  brand: PropTypes.shape({
    name: PropTypes.string.isRequired,
    tagline: PropTypes.string,
    logo: PropTypes.string.isRequired,
    link: PropTypes.string,
  }).isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      model: PropTypes.string,
      measure: PropTypes.string,
      description: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      originalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      badge: PropTypes.string,
    })
  ).isRequired,
};

export default BrandSection;
