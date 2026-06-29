import React, { useEffect } from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";
import { useAnalyze } from "../hooks/useAnalyze";
import AnalyzingState from "./AnalyzingState";

const ImagePreview = ({
  preview,
  uploading,
  uploadResult,
  error: uploadError,
  handleUpload,
  resetUpload,
}) => {
  const { analyzeImage, analyzing, error: analyzeError } = useAnalyze();

  // Trigger analysis automatically once upload succeeds
  useEffect(() => {
    if (uploadResult?.upload_id) {
      analyzeImage(uploadResult.upload_id);
    }
  }, [uploadResult]);

  // Show AnalyzingState screen while analyzing
  if (analyzing) {
    return (
      <Card className="max-w-md mx-auto overflow-hidden p-6">
        <AnalyzingState previewImage={preview} onCancel={resetUpload} />
      </Card>
    );
  }

  const displayError = uploadError || analyzeError;

  return (
    <Card className="max-w-md mx-auto overflow-hidden p-6">
      <div className="flex flex-col gap-5">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Selected Photo</h2>
          <p className="text-sm text-gray-500 mt-1">
            Confirm the photo is clear before running the analysis.
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
          {analyzeError ? (
            <Button
              onClick={() => uploadResult?.upload_id ? analyzeImage(uploadResult.upload_id) : handleUpload()}
              variant="primary"
              fullWidth
            >
              Retry Analysis / दोबारा प्रयास करें
            </Button>
          ) : (
            <Button
              onClick={handleUpload}
              loading={uploading}
              variant="primary"
              fullWidth
            >
              Analyze This Crop →
            </Button>
          )}

          <Button
            onClick={resetUpload}
            disabled={uploading}
            variant="ghost"
            fullWidth
          >
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ImagePreview;

