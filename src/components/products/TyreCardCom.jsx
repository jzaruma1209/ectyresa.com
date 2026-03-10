import PropTypes from "prop-types";
import ButtonCom from "../ui/ButtonCom";

const TyreCardCom = ({
  image,
  title,
  brandImage,
  brandName,
  model,
  measure,
  description,
  price,
  originalPrice,
  badge,
  onAddToCart,
  onClick,
  className,
}) => {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg cursor-pointer transition-shadow border border-white/10 hover:shadow-lg flex flex-col ${className || 'max-w-[240px]'}`}
      style={{ background: "rgba(17, 24, 39, 0.80)" }}
      onClick={onClick}
    >
      {/* Blob izquierdo glassmorphism */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 top-1/2 -translate-y-1/2 blur-2xl opacity-35"
        style={{ clipPath: "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)" }}
      >
        <div className="aspect-[577/310] w-[10rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc]" />
      </div>
      {/* Blob derecho glassmorphism */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 blur-2xl opacity-35"
        style={{ clipPath: "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)" }}
      >
        <div className="aspect-[577/310] w-[10rem] bg-gradient-to-r from-[#9089fc] to-[#ff80b5]" />
      </div>
      {/* Badge Compacto */}
      {badge && (
        <div className="absolute top-0 right-0 z-10">
          <span className="bg-[#E32619] text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg uppercase">
            {badge}
          </span>
        </div>
      )}

      {/* Imagen de la llanta */}
      <div className="h-24 w-full overflow-hidden bg-white/10 p-2 flex items-center justify-center relative z-10">
        <img
          className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
          src={image}
          alt={title}
        />
      </div>

      <div className="px-2 pb-2 pt-1 relative z-10 flex-grow flex flex-col">
        {/* Logo de la marca compactado */}
        <div className="flex items-center justify-center py-1 border-b border-white/10 mb-1">
          <img
            className="h-5 sm:h-6 object-contain"
            src={brandImage || "/marca.svg"}
            alt={brandName || "Marca"}
          />
        </div>

        {/* Info del producto con menos márgenes */}
        <div className="text-center flex-grow">
          {model && (
            <h5 className="text-[13px] font-bold text-white leading-tight">
              .{model}
            </h5>
          )}

          {measure && (
            <p className="text-[11px] text-white/60 mt-0.5">
              <span className="font-semibold text-white/80">Medida:</span> {measure}
            </p>
          )}

          {description && (
            <p className="mt-1 text-[10px] leading-tight text-white/50 line-clamp-2 px-1">
              {description}
            </p>
          )}
        </div>

        {/* Línea de Precios */}
        <div className="mt-1 flex items-baseline justify-center gap-1.5">
          {originalPrice && (
            <span className="text-[10px] text-white/40 line-through">
              ${originalPrice}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-[#ff80b5] leading-none">
              ${price}
            </span>
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-tighter">
              + IVA
            </span>
          </div>
        </div>

        {/* Boton comprar compacto */}
        <div className="mt-1 text-center">
          <ButtonCom
            size="sm"
            variant="primary"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.();
            }}
          >
            Comprar
          </ButtonCom>
        </div>
      </div>
    </div>
  );
};

TyreCardCom.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  brandImage: PropTypes.string,
  brandName: PropTypes.string,
  model: PropTypes.string,
  measure: PropTypes.string,
  description: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  originalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  badge: PropTypes.string,
  onAddToCart: PropTypes.func,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

TyreCardCom.defaultProps = {
  brandImage: "/marca.svg",
  brandName: "Marca",
  model: null,
  measure: null,
  description: null,
  originalPrice: null,
  badge: null,
  onAddToCart: undefined,
  onClick: undefined,
  className: null,
};

export default TyreCardCom;
