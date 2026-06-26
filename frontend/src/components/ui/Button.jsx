const Button = ({
  children,
  loading = false,
  disabled = false,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = true,
  onClick,
  className = "",
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none gap-2 rounded-[12px] min-h-[44px]";
  
  const variants = {
    primary: "bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/20",
    secondary: "bg-white border-2 border-brand-600 text-brand-600 hover:bg-brand-50",
    ghost: "bg-transparent text-brand-600 hover:bg-brand-50",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20",
  };

  const sizes = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-3.5 px-8 text-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${widthStyle}
        ${className}
      `}
    >
      {loading ? (
        <span className={`w-5 h-5 border-2 rounded-full animate-spin border-t-transparent ${
          variant === "secondary" || variant === "ghost" ? "border-brand-600" : "border-white"
        }`} />
      ) : children}
    </button>
  );
};

export default Button;
