const Input = ({
  label,
  type = "text",
  placeholder = "",
  error = "",
  register,
  variant = "box",
  icon,
  rightElement,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className={`text-sm font-medium ${variant === 'line' ? 'text-green-900/80 dark:text-green-300 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-gray-400 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          {...(register || {})}
          {...props}
          className={`
            w-full focus:outline-none transition-all duration-200
            ${icon ? "pl-10" : ""}
            ${rightElement ? "pr-10" : ""}
            ${variant === 'line'
              ? `bg-transparent border-b-2 py-2 px-1 text-gray-900 dark:text-white placeholder-gray-400/60 dark:placeholder-gray-500 ${
                  error
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-green-600 dark:border-gray-700"
                }`
              : `px-4 py-3 rounded-xl border text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                  error
                    ? "border-red-400 bg-red-50 dark:bg-red-950/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                }`
            }
          `}
        />
        {rightElement && (
          <div className="absolute right-3 text-gray-400 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
