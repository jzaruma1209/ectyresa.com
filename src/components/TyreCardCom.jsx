import PropTypes from "prop-types";
import ButtonCom from "./ButtonCom";

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
      className={`relative w-full overflow-hidden rounded-lg bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow border border-gray-50 ${className || 'max-w-[240px]'}`}
      onClick={onClick}
    >
      {/* Badge Compacto */}
      {badge && (
        <div className="absolute top-0 right-0 z-10">
          <span className="bg-[#E32619] text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg uppercase">
            {badge}
          </span>
        </div>
      )}

      {/* Imagen de la llanta */}
      <div className="h-32 w-full overflow-hidden bg-[#F8F9FA] p-3 flex items-center justify-center">
        <img
          className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
          src={image}
          alt={title}
        />
      </div>

      <div className="px-3 pb-3 pt-1">
        {/* Logo de la marca compactado */}
        <div className="flex items-center justify-center py-1 border-b border-gray-100 mb-1">
          <img
            className="h-5 sm:h-6 object-contain"
            src={brandImage || "/marca.svg"}
            alt={brandName || "Marca"}
          />
        </div>

        {/* Info del producto con menos márgenes */}
        <div className="text-center">
          {model && (
            <h5 className="text-[13px] font-bold text-slate-900 leading-tight">
              .{model}
            </h5>
          )}

          {measure && (
            <p className="text-[11px] text-gray-600 mt-0.5">
              <span className="font-semibold text-slate-700">Medida:</span> {measure}
            </p>
          )}

          {description && (
            <p className="mt-1 text-[10px] leading-tight text-gray-500 line-clamp-2 px-1">
              {description}
            </p>
          )}
        </div>

        {/* Línea de Precios Unificada y Ultra-Compacta */}
        <div className="mt-1 flex items-baseline justify-center gap-1.5">
          {originalPrice && (
            <span className="text-[10px] text-gray-400 line-through decoration-gray-300">
              ${originalPrice}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-[#E32619] leading-none">
              ${price}
            </span>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
              + IVA
            </span>
          </div>
        </div>

        {/* Boton comprar compacto */}
        <div className="mt-2 text-center">
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
