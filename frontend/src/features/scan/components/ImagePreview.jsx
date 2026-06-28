import React from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";

const ImagePreview = ({
  preview,
  uploading,
  uploadResult,
  error,
  handleUpload,
  resetUpload,
}) => {
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

        {/* Success Alert Display */}
        {uploadResult && (
          <Alert message={`Upload Successful! Scan ID: ${uploadResult.upload_id}`} type="success" />
        )}

        {/* Error Alert Display */}
        {error && <Alert message={error} type="error" />}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mt-2">
          <Button
            onClick={handleUpload}
            loading={uploading}
            variant="primary"
            fullWidth
          >
            Analyze This Crop →
          </Button>

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
