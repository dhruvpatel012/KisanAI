import React, { useState, useEffect } from "react";
import Button from "../../../components/ui/Button";
import { useLanguage } from "../../../context/LanguageContext";

const AnalyzingState = ({ previewImage, onCancel, message }) => {
  const { t } = useLanguage();
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    { en: "Checking for 38 disease types...", hi: "38 बीमारी प्रकारों की जाँच हो रही है..." },
    { en: "Analyzing leaf patterns...", hi: "पत्ती के पैटर्न का विश्लेषण हो रहा है..." },
    { en: "Comparing with 54,000 samples...", hi: "54,000 नमूनों के साथ तुलना की जा रही है..." },
    { en: "Generating treatment advice...", hi: "उपचार सलाह तैयार की जा रही है..." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      {/* Small Crop Image Preview */}
      {previewImage && (
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-emerald-100 shadow-md mb-8">
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[1px] flex items-center justify-center">
            {/* Pulsing Scan Line */}
            <div className="w-full h-1 bg-emerald-400 absolute top-0 left-0 animate-bounce" style={{ animationDuration: "2s" }} />
          </div>
        </div>
      )}

      {/* Pulsing Scanner Ring */}
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        <div className="absolute w-20 h-20 bg-emerald-500 rounded-full opacity-20 animate-ping" />
        <div className="absolute w-16 h-16 bg-emerald-600 rounded-full opacity-40 animate-pulse" />
        <div className="relative w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center shadow-inner">
          <svg
            className="w-6 h-6 text-white animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>

      {/* Main text */}
      <h3 className="text-xl font-extrabold text-emerald-950 mb-2">
        {message || t("Analyzing crop health...", "फसल स्वास्थ्य का विश्लेषण...")}
      </h3>
      <p className="text-sm text-emerald-700/80 mb-8">
        {t("This will take just a few seconds.", "इसमें कुछ ही सेकंड लगेंगे।")}
      </p>

      {/* Rotating tips */}
      <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 w-full mb-8 min-h-[76px] flex items-center justify-center transition-all duration-300">
        <p className="text-sm font-semibold text-emerald-800 animate-pulse">
          {t(tips[tipIndex].en, tips[tipIndex].hi)}
        </p>
      </div>

      {/* Cancel button */}
      <Button
        variant="secondary"
        onClick={onCancel}
        className="px-6 py-2 text-emerald-700 font-bold border-emerald-200 hover:bg-emerald-50"
      >
        {t("Cancel", "रद्द करें")}
      </Button>
    </div>
  );
};

export default AnalyzingState;
