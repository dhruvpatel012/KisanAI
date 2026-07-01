import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/axios";

const LanguageContext = createContext();

const translationDictionary = {
  // Crops
  "potato": "आलू",
  "tomato": "टमाटर",
  "wheat": "गेहूं",
  "rice": "चावल",
  "corn": "मक्का",

  // Diseases
  "potato early blight": "आलू का अगेती झुलसा रोग (Early Blight)",
  "potato late blight": "आलू का पछेती झुलसा रोग (Late Blight)",
  "tomato late blight": "टमाटर का पछेती झुलसा रोग (Late Blight)",
  "potato healthy": "स्वस्वस्थ आलू (Healthy)",
  "tomato healthy": "स्वस्वस्थ टमाटर (Healthy)",
  "wheat healthy": "स्वस्वस्थ गेहूं (Healthy)",

  // Treatment Steps
  "remove infected leaves immediately": "संक्रमित पत्तियों को तुरंत हटा दें",
  "apply copper-based fungicide": "तांबा आधारित कवकनाशी (Fungicide) का छिड़काव करें",
  "improve drainage around plants": "पौधों के आसपास जल निकासी में सुधार करें",
  "remove all infected plants": "सभी संक्रमित पौधों को हटा दें",
  "apply fungicide immediately": "तुरंत कवकनाशी का छिड़काव करें",
  "avoid overhead irrigation": "ऊपर से पानी देने (सिंचाई) से बचें",
  "remove infected leaves and stems to prevent the spread of the disease": "बीमारी के प्रसार को रोकने के लिए संक्रमित पत्तियों और तनों को हटा दें",
  "improve air circulation around the plants to reduce moisture and promote drying": "नमी को कम करने और सूखने को बढ़ावा देने के लिए पौधों के आसपास हवा के संचार में सुधार करें",

  // Fertilizer
  "reduce nitrogen application": "नाइट्रोजन का उपयोग कम करें",
  "avoid high nitrogen fertilizers": "अत्यधिक नाइट्रोजन वाले उर्वरकों से बचें",
  "avoid using high-nitrogen fertilizers, which can promote leaf growth and make the plants more susceptible to disease. instead, use a balanced fertilizer with equal amounts of nitrogen, phosphorus, and potassium.": "अत्यधिक नाइट्रोजन वाले उर्वरकों का उपयोग करने से बचें, जो पत्तियों के विकास को बढ़ावा दे सकते हैं और पौधों को बीमारी के प्रति अधिक संवेदनशील बना सकते हैं। इसके बजाय, नाइट्रोजन, फास्फोरस और पोटेशियम की समान मात्रा वाले संतुलित उर्वरक का उपयोग करें।",
  "standard balanced fertilizer": "मानक संतुलित उर्वरक",

  // Prevention
  "use resistant varieties and crop rotation": "रोग प्रतिरोधी किस्मों और फसल चक्र का उपयोग करें",
  "use crop rotation and good sanitation": "फसल चक्र और अच्छी साफ-सफाई का पालन करें",
  "maintain current good practices": "वर्तमान अच्छी प्रथाओं को बनाए रखें",
  "maintain good crop rotation, remove weeds that can harbor the pathogen, and ensure adequate spacing between plants to improve air circulation.": "अच्छी फसल चक्र बनाए रखें, रोगजनक को शरण देने वाले खरपतवारों को हटा दें, और हवा के संचार को बेहतर बनाने के लिए पौधों के बीच पर्याप्त दूरी सुनिश्चित करें।",

  // Severity / Risk levels
  "high": "उच्च जोखिम",
  "medium": "मध्यम जोखिम",
  "low": "कम जोखिम",
  "none": "कोई जोखिम नहीं",

  // Disclaimers
  "model trained on lab images. real-world accuracy may vary.": "मॉडल प्रयोगशाला चित्रों पर प्रशिक्षित है। वास्तविक सटीकता भिन्न हो सकती है।",
  "model prediction results.": "मॉडल भविष्यवाणी परिणाम।"
};

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

  // Dynamic text translation helper function
  const dt = (text) => {
    if (!text) return text;
    if (language !== "hi") return text;
    const key = text.trim().toLowerCase().replace(/\s+/g, " ");
    return translationDictionary[key] || text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dt }}>
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
