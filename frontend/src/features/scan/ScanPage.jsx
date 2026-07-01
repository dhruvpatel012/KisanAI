import PageLayout from "../../components/layout/PageLayout";
import { useImageUpload } from "./hooks/useImageUpload";
import ImagePicker from "./components/ImagePicker";
import ImagePreview from "./components/ImagePreview";
import { useLanguage } from "../../context/LanguageContext";

const ScanPage = () => {
  const { t } = useLanguage();
  const {
    selectedFile,
    preview,
    uploading,
    uploadResult,
    error,
    handleFileSelect,
    handleUpload,
    resetUpload,
  } = useImageUpload();

  return (
    <PageLayout title={t("Scan Crop", "फसल जाँच")}>
      <div 
        className="min-h-[calc(100vh-140px)] p-4 relative rounded-3xl"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(22, 163, 74, 0.1) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px"
        }}
      >
        {!selectedFile ? (
          <ImagePicker onFileSelect={handleFileSelect} error={error} />
        ) : (
          <ImagePreview
            preview={preview}
            uploading={uploading}
            uploadResult={uploadResult}
            error={error}
            handleUpload={handleUpload}
            resetUpload={resetUpload}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default ScanPage;
