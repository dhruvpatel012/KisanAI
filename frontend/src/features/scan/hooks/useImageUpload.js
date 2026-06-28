import { useState } from "react";
import api from "../../../lib/axios";

export const useImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    setError(null);
    setUploadResult(null);

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setError("Invalid file type. Please select a JPG, JPEG, PNG, or WEBP image.");
      setSelectedFile(null);
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
      return;
    }

    // Revoke previous preview URL to avoid memory leaks
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadResult(response.data);
    } catch (err) {
      console.error("Upload error details:", err);
      const backendError = err.response?.data?.detail;
      setError(backendError || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview(null);
    setUploading(false);
    setUploadResult(null);
    setError(null);
  };

  return {
    selectedFile,
    preview,
    uploading,
    uploadResult,
    error,
    handleFileSelect,
    handleUpload,
    resetUpload,
  };
};
