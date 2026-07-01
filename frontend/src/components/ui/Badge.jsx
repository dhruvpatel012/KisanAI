const Badge = ({
  children,
  variant = "gray",
  className = "",
}) => {
  const variants = {
    success: "bg-brand-50 dark:bg-brand-950/20 text-brand-700 dark:text-brand-300 border-brand-100 dark:border-brand-900/30",
    warning: "bg-earth-amber-50 dark:bg-amber-950/20 text-earth-amber-700 dark:text-amber-300 border-earth-amber-100 dark:border-amber-900/30",
    danger: "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 border-red-100 dark:border-red-900/30",
    info: "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/30",
    gray: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
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
