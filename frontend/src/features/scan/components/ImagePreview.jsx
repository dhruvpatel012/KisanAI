import React, { useEffect } from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";
import { useAnalyze } from "../hooks/useAnalyze";
import { usePlantIdentify } from "../hooks/usePlantIdentify";
import { useLandAnalyze } from "../hooks/useLandAnalyze";
import AnalyzingState from "./AnalyzingState";
import { useLanguage } from "../../../context/LanguageContext";

const ImagePreview = ({
  preview,
  uploading,
  uploadResult,
  error: uploadError,
  handleUpload,
  resetUpload,
  scanType,
}) => {
  const { t } = useLanguage();
  const { analyzeImage, analyzing: analyzingDisease, error: analyzeError } = useAnalyze();
  const { identifyPlant, identifying, error: identifyError } = usePlantIdentify();
  const { analyzeLand, analyzing: analyzingLand, error: landError } = useLandAnalyze();

  const isAnalyzing = analyzingDisease || identifying || analyzingLand;

  // Trigger analysis automatically once upload succeeds
  useEffect(() => {
    if (uploadResult?.upload_id) {
      if (scanType === "disease") {
        analyzeImage(uploadResult.upload_id);
      } else if (scanType === "plant") {
        identifyPlant(uploadResult.upload_id);
      } else if (scanType === "land") {
        analyzeLand(uploadResult.upload_id);
      } else {
        analyzeImage(uploadResult.upload_id);
      }
    }
  }, [uploadResult, scanType]);

  let loadingText = t("Analyzing...", "विश्लेषण हो रहा है...");
  if (scanType === "disease") {
    loadingText = t("Analyzing crop disease...", "फसल रोग का विश्लेषण...");
  } else if (scanType === "plant") {
    loadingText = t("Identifying plant species...", "पौधे की प्रजाति की पहचान...");
  } else if (scanType === "land") {
    loadingText = t("Analyzing soil quality...", "मिट्टी की गुणवत्ता का विश्लेषण...");
  }

  // Show AnalyzingState screen while analyzing
  if (isAnalyzing) {
    return (
      <Card className="max-w-md mx-auto overflow-hidden p-6">
        <AnalyzingState 
          previewImage={preview} 
          onCancel={resetUpload} 
          message={loadingText}
        />
      </Card>
    );
  }

  const displayError = uploadError || analyzeError || identifyError || landError;

  const handleRetry = () => {
    if (uploadResult?.upload_id) {
      if (scanType === "disease") {
        analyzeImage(uploadResult.upload_id);
      } else if (scanType === "plant") {
        identifyPlant(uploadResult.upload_id);
      } else if (scanType === "land") {
        analyzeLand(uploadResult.upload_id);
      } else {
        analyzeImage(uploadResult.upload_id);
      }
    } else {
      handleUpload();
    }
  };

  const getButtonText = () => {
    if (scanType === "disease") return t("Analyze Disease →", "रोग विश्लेषण →");
    if (scanType === "plant") return t("Identify Plant →", "पौधे की पहचान →");
    if (scanType === "land") return t("Analyze Soil →", "मिट्टी की जाँच →");
    return t("Analyze →", "विश्लेषण करें →");
  };

  return (
    <Card className="max-w-md mx-auto overflow-hidden p-6">
      <div className="flex flex-col gap-5">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">
            {t("Selected Photo", "चयनित फोटो")}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t(
              "Confirm the photo is clear before running the analysis.",
              "विश्लेषण शुरू करने से पहले सुनिश्चित करें कि फोटो साफ है।"
            )}
          </p>
        </div>

        {/* Local Image Preview Box */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 border border-gray-200">
          <img
            src={preview}
            alt="Crop Preview"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Error Alert Display */}
        {displayError && <Alert message={displayError} type="error" />}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mt-2">
          {analyzeError || identifyError || landError ? (
            <Button
              onClick={handleRetry}
              variant="primary"
              fullWidth
            >
              {t("Retry Analysis", "दोबारा प्रयास करें")}
            </Button>
          ) : (
            <Button
              onClick={handleUpload}
              loading={uploading}
              variant="primary"
              fullWidth
            >
              {getButtonText()}
            </Button>
          )}

          <Button
            onClick={resetUpload}
            disabled={uploading}
            variant="ghost"
            fullWidth
          >
            {t("Cancel", "रद्द करें")}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ImagePreview;
