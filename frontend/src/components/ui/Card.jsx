const Card = ({
  children,
  className = "",
  onClick,
  padding = true,
}) => {
  const isClickable = !!onClick;
  
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-[16px] border border-gray-100 shadow-sm
        ${padding ? "p-4" : ""}
        ${isClickable ? "cursor-pointer active:scale-[0.98] transition-transform duration-150" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
