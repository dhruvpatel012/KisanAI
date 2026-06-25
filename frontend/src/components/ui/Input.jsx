const Input = ({
  label,
  type = "text",
  placeholder = "",
  error = "",
  register,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium
          text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        {...(register || {})}
        {...props}
        className={`
          w-full px-4 py-3 rounded-xl border
          text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2
          focus:ring-brand-500 focus:border-transparent
          transition-all duration-200
          ${error
            ? "border-red-400 bg-red-50"
            : "border-gray-200 bg-white"
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
