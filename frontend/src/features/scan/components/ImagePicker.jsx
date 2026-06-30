import React, { useRef } from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { useLanguage } from "../../../context/LanguageContext";

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
      <Card className="flex flex-col items-center text-center p-6">
        {/* Dashed green border box */}
        <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-brand-400 bg-brand-50 flex items-center justify-center mb-4">
          <i className="ri-camera-lens-line text-4xl text-brand-600"></i>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {t("Take a Photo", "फोटो लें")}
        </h2>
        <p className="text-sm text-gray-500 mb-6 max-w-[280px]">
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
            className="font-bold py-3"
            onClick={() => cameraInputRef.current?.click()}
          >
            <i className="ri-camera-fill text-lg"></i>
            {t("Open Camera", "कैमरा खोलें")}
          </Button>

          <div className="flex items-center justify-between w-full my-1">
            <span className="h-[1px] bg-gray-200 flex-1"></span>
            <span className="text-xs text-gray-400 px-3 uppercase tracking-wider font-semibold">
              {t("OR", "या")}
            </span>
            <span className="h-[1px] bg-gray-200 flex-1"></span>
          </div>

          <Button
            variant="secondary"
            className="font-bold py-3"
            onClick={() => galleryInputRef.current?.click()}
          >
            <i className="ri-image-add-fill text-lg"></i>
            {t("Upload from Gallery", "गैलरी से चुनें")}
          </Button>
        </div>
      </Card>

      {/* TIPS CARD */}
      <Card className="p-5 bg-white border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
          <i className="ri-pushpin-2-fill text-brand-600 text-lg"></i>
          {t("Tips for Accurate Scan", "सही जाँच के सुझाव")}
        </h3>

        <ul className="flex flex-col gap-3.5">
          {tips.map((tip, index) => (
            <li key={index} className="flex gap-3">
              <i className="ri-checkbox-circle-fill text-brand-600 text-lg mt-0.5 shrink-0"></i>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-tight">
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
