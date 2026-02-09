import PropTypes from "prop-types";

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
      className={`relative w-full overflow-hidden rounded-lg bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow ${className || 'max-w-xs'}`}
      onClick={onClick}
    >
      {/* Imagen de la llanta */}
      <div className="h-32 sm:h-40 w-full overflow-hidden bg-gray-50 p-2 flex items-center justify-center">
        <img
          className="max-h-full max-w-full object-contain"
          src={image}
          alt={title}
        />
      </div>

      {/* Badge */}
      {badge && (
        <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-bl-lg">
          {badge}
        </span>
      )}

      <div className="px-3 pb-3">
        {/* Logo de la marca */}
        <div className="flex items-center justify-center py-1.5 border-b border-gray-100">
          <img
            className="h-7 object-contain"
            src={brandImage || "/marca.svg"}
            alt={brandName || "Marca"}
          />
        </div>

        {/* Modelo */}
        {model && (
          <h5 className="mt-1.5 text-center text-sm font-bold text-slate-900">
            {model}
          </h5>
        )}

        {/* Medida */}
        {measure && (
          <p className="mt-0.5 text-center text-xs text-gray-600">
            <span className="font-semibold">Medida:</span> {measure}
          </p>
        )}

        {/* Descripcion */}
        {description && (
          <p className="mt-1 text-center text-[11px] text-gray-500 line-clamp-2">
            {description}
          </p>
        )}

        {/* Precios */}
        <div className="mt-2 flex flex-col items-center gap-0.5">
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              P.V.P ${originalPrice}
            </span>
          )}
          <span className="text-xl font-bold text-red-600">${price}</span>
          <span className="text-[10px] text-gray-400">+ IVA</span>
        </div>

        {/* Boton comprar */}
        <div className="mt-2 flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.();
            }}
            className="rounded-md bg-red-600 px-6 py-1.5 text-xs font-semibold uppercase text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
          >
            Comprar
          </button>
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
