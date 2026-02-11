import PropTypes from "prop-types";

/**
 * Botón universal reutilizable para toda la app.
 *
 * Tamaños disponibles: "xs", "sm", "md", "lg"
 * Variantes: "primary" (rojo), "dark" (negro), "outline" (borde rojo)
 *
 * Ejemplo de uso:
 *   <ButtonCom size="md" variant="primary" onClick={fn}>Comprar</ButtonCom>
 *   <ButtonCom size="lg" variant="dark" fullWidth>¡DA CLICK AQUÍ!</ButtonCom>
 */

const sizeClasses = {
  xs: "px-3 py-1 text-[10px]",
  sm: "px-4 py-1.5 text-[11px]",
  md: "px-6 py-2 text-sm",
  lg: "px-8 py-2.5 text-base",
};

const variantClasses = {
  primary:
    "bg-[#E32619] text-white hover:bg-[#c41f14] shadow-sm hover:shadow-md",
  dark:
    "bg-[#1a1a1a] text-white hover:bg-[#E32619] shadow-sm hover:shadow-md",
  outline:
    "bg-transparent border-2 border-[#E32619] text-[#E32619] hover:bg-[#E32619] hover:text-white",
};

const ButtonCom = ({
  children,
  onClick,
  size = "md",
  variant = "primary",
  fullWidth = false,
  uppercase = true,
  className = "",
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        rounded-md font-bold tracking-wide
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-0
        disabled:opacity-50 disabled:cursor-not-allowed
        ${uppercase ? "uppercase" : ""}
        ${fullWidth ? "w-full" : ""}
        ${sizeClasses[size] || sizeClasses.md}
        ${variantClasses[variant] || variantClasses.primary}
        ${className}
      `.trim()}
    >
      {children}
    </button>
  );
};

ButtonCom.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg"]),
  variant: PropTypes.oneOf(["primary", "dark", "outline"]),
  fullWidth: PropTypes.bool,
  uppercase: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ButtonCom;
