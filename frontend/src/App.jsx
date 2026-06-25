import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";

const DashboardPage = () => {
  const token = localStorage.getItem("kisanai_token");
  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🌱 Dashboard</h1>
        <p className="text-gray-500 mb-6">Welcome to KisanAI Dashboard!</p>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 break-all text-xs font-mono text-left">
          <strong>Token:</strong> {token || "No Token Found"}
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("kisanai_token");
            window.location.href = "/login";
          }}
          className="mt-6 w-full py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
