import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
} from "../authService";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await loginUser(data);
      localStorage.setItem(
        "kisanai_token",
        result.access_token
      );
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await registerUser(data);
      localStorage.setItem(
        "kisanai_token",
        result.access_token
      );
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, error };
};
