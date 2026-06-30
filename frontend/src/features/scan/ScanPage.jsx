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
    </PageLayout>
  );
};

export default ScanPage;
