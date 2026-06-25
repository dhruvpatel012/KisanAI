const Alert = ({ message, type = "error" }) => {
  if (!message) return null;

  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
  };

  return (
    <div className={`
      px-4 py-3 rounded-xl border text-sm
      font-medium ${styles[type]}
    `}>
      {type === "error" ? "⚠️ " : "✅ "}
      {message}
    </div>
  );
};

export default Alert;
