const Badge = ({
  children,
  variant = "gray",
  className = "",
}) => {
  const variants = {
    success: "bg-brand-50 text-brand-700 border-brand-100",
    warning: "bg-earth-amber-50 text-earth-amber-700 border-earth-amber-100",
    danger: "bg-red-50 text-red-700 border-red-100",
    info: "bg-blue-50 text-blue-700 border-blue-100",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border
        ${variants[variant] || variants.gray}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
