import React, { useRef } from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { useLanguage } from "../../../context/LanguageContext";
import { Camera, ImagePlus, CheckCircle2, Lightbulb } from "lucide-react";

const ImagePicker = ({ onFileSelect, error }) => {
  const { t } = useLanguage();
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const tips = [
    {
      en: "Good lighting, avoid shadows",
      hi: "अच्छी रोशनी, छाया से बचें",
    },
    {
      en: "Focus on affected leaf only",
      hi: "केवल प्रभावित पत्ती पर ध्यान दें",
    },
    {
      en: "Keep phone camera steady",
      hi: "फोन कैमरा स्थिर रखें",
    },
    {
      en: "Include healthy and sick areas",
      hi: "स्वस्थ और बीमार दोनों हिस्सों को शामिल करें",
    },
  ];

  const handleInputChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hidden File Inputs */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleInputChange}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* UPLOAD CARD */}
      <Card className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-white to-green-50/30 border border-green-100/60 shadow-sm rounded-3xl">
        {/* Viewfinder corner brackets container */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-5 mt-2 animate-pulse">
          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-600 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-600 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-600 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-600 rounded-br-lg"></div>
          
          {/* Center camera icon */}
          <Camera size={48} className="text-green-600 dark:text-green-400" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {t("Take a Photo", "फोटो लें")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-[280px]">
          {t(
            "Position the affected crop leaf clearly inside the camera frame.",
            "फसल की पत्ती को कैमरे के सामने रखें।"
          )}
        </p>

        {/* Client side selection error */}
        {error && (
          <div className="w-full mb-4 px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold">
            ⚠️ {error}
          </div>
        )}

        <div className="w-full flex flex-col gap-3">
          <Button
            variant="primary"
            className="group font-bold py-3.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 active:scale-95 transition-all border-none text-white text-base rounded-xl"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera size={18} className="mr-2 group-hover:animate-[shake_0.3s_ease-in-out_infinite] transition-transform duration-200" />
            {t("Open Camera", "कैमरा खोलें")}
          </Button>

          <div className="flex items-center justify-between w-full my-1">
            <span className="h-[1px] bg-gray-200 dark:bg-gray-700 flex-1"></span>
            <span className="text-xs text-gray-400 px-3 uppercase tracking-wider font-semibold">
              {t("OR", "या")}
            </span>
            <span className="h-[1px] bg-gray-200 dark:bg-gray-700 flex-1"></span>
          </div>

          <Button
            variant="secondary"
            className="font-bold py-3 hover:bg-green-50/50 active:scale-[0.98] transition-all rounded-xl"
            onClick={() => galleryInputRef.current?.click()}
          >
            <ImagePlus size={18} className="mr-2" />
            {t("Upload from Gallery", "गैलरी से चुनें")}
          </Button>
        </div>
      </Card>

      {/* TIPS CARD */}
      <Card className="p-5 bg-white border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Lightbulb size={16} className="text-green-600 dark:text-green-400 mr-2" />
          {t("Tips for Accurate Scan", "सही जाँच के सुझाव")}
        </h3>

        <ul className="flex flex-col gap-3.5">
          {tips.map((tip, index) => (
            <li key={index} className="flex gap-3">
              <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                  {t(tip.en, tip.hi)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default ImagePicker;
