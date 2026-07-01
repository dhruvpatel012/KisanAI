const Alert = ({ message, type = "error" }) => {
  if (!message) return null;

  const styles = {
    error: "bg-red-50/80 dark:bg-red-950/20 backdrop-blur-sm border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300",
    success: "bg-green-50/80 dark:bg-green-950/20 backdrop-blur-sm border-green-200 dark:border-green-900/40 text-green-700 dark:text-green-300",
  };

  return (
    <div className={`
      px-4 py-3 rounded-xl border text-sm
      font-medium animate-fadeSlideUp
      ${styles[type]}
    `}>
      {type === "error" ? "⚠️ " : "✅ "}
      {message}
    </div>
  );
};

export default Alert;
