import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../lib/axios";
import { useLanguage } from "../../../context/LanguageContext";

export const useAnalyze = () => {
  const { t } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getPosition = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: 20.5937, lng: 78.9629 });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Fallback to default coordinates on error or permission denial
          resolve({ lat: 20.5937, lng: 78.9629 });
        },
        { timeout: 5000 }
      );
    });
  };

  const analyzeImage = async (uploadId) => {
    if (!uploadId) {
      setError(t("Invalid upload ID.", "अमान्य अपलोड आईडी।"));
      return;
    }

    setAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    const { lat, lng } = await getPosition();

    try {
      const response = await api.post("/api/analyze", {
        upload_id: uploadId,
        lat,
        lng,
      });
      setAnalysisResult(response.data);
      navigate(`/result/${uploadId}`);
    } catch (err) {
      console.error("Analysis error details:", err);
      const backendError = err.response?.data?.detail;
      setError(backendError || t("Failed to analyze image. Please try again.", "छवि का विश्लेषण करने में विफल। कृपया पुनः प्रयास करें।"));
    } finally {
      setAnalyzing(false);
    }
  };

  return {
    analyzeImage,
    analyzing,
    analysisResult,
    error,
  };
};
