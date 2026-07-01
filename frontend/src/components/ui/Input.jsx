const Input = ({
  label,
  type = "text",
  placeholder = "",
  error = "",
  register,
  variant = "box",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className={`text-sm font-medium ${variant === 'line' ? 'text-green-900/80 font-bold' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        {...(register || {})}
        {...props}
        className={`
          w-full focus:outline-none transition-all duration-200
          ${variant === 'line'
            ? `bg-transparent border-b-2 py-2 px-1 text-gray-900 placeholder-gray-400/60 ${
                error
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-300 focus:border-green-600"
              }`
            : `px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                error
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 bg-white"
              }`
          }
        `}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
