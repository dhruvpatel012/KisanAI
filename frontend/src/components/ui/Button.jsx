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
  const baseStyles = `
    inline-flex items-center justify-center font-semibold
    transition-all duration-200 ease-out
    active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    gap-2 rounded-[14px] min-h-[44px]
    relative overflow-hidden
  `;
  
  const variants = {
    primary: "bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 hover:-translate-y-0.5",
    secondary: "bg-white border-2 border-brand-600 text-brand-600 hover:bg-brand-50 hover:shadow-md hover:-translate-y-0.5",
    ghost: "bg-transparent text-brand-600 hover:bg-brand-50",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-600/25 hover:shadow-red-600/40 hover:-translate-y-0.5",
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
