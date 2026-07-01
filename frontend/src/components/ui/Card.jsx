const Card = ({
  children,
  className = "",
  onClick,
  padding = true,
  style,
}) => {
  const isClickable = !!onClick;
  
  return (
    <div
      onClick={onClick}
      style={style}
      className={`
        bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-[20px]
        border border-white/60 dark:border-gray-700/40
        shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]
        ${padding ? "p-4" : ""}
        ${isClickable ? "cursor-pointer active:scale-[0.98] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-200" : "transition-shadow duration-200"}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
