const Button = ({
  children,
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        w-full py-3 px-6 rounded-xl font-semibold
        text-white bg-brand-600
        hover:bg-brand-700
        active:scale-[0.98]
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-white
          border-t-transparent rounded-full animate-spin"
        />
      ) : children}
    </button>
  );
};

export default Button;
