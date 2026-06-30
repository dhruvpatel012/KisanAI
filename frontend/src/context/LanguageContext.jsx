import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/axios";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Initialize from localStorage or default to English
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("kisanai_lang") || "en";
  });

  // Sync language from backend when user is logged in
  useEffect(() => {
    const syncProfileLanguage = async () => {
      const token = localStorage.getItem("kisanai_token");
      if (!token) return;
      
      try {
        const response = await api.get("/auth/me");
        const userLang = response.data.preferred_language || "en";
        if (userLang !== language) {
          setLanguageState(userLang);
          localStorage.setItem("kisanai_lang", userLang);
        }
      } catch (err) {
        console.error("Failed to sync language from profile:", err);
      }
    };

    syncProfileLanguage();
  }, []);

  const setLanguage = async (newLang) => {
    setLanguageState(newLang);
    localStorage.setItem("kisanai_lang", newLang);

    // If logged in, update on the backend too
    const token = localStorage.getItem("kisanai_token");
    if (token) {
      try {
        const profileResponse = await api.get("/auth/me");
        await api.put("/auth/profile", {
          full_name: profileResponse.data.full_name || "Kisan Farmer",
          preferred_language: newLang,
          farm_location: profileResponse.data.farm_location || ""
        });
      } catch (err) {
        console.error("Failed to update language on backend:", err);
      }
    }
  };

  // Translation helper function
  const t = (en, hi) => {
    return language === "hi" ? hi : en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
