import { useState } from "react";
import PageLayout from "../../components/layout/PageLayout";
import { useImageUpload } from "./hooks/useImageUpload";
import ImagePicker from "./components/ImagePicker";
import ImagePreview from "./components/ImagePreview";
import { useLanguage } from "../../context/LanguageContext";
import { ScanLine, Leaf, Mountain, ChevronRight, ArrowLeft } from "lucide-react";

const ScanPage = () => {
  const { t } = useLanguage();
  const [scanType, setScanType] = useState(null);
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
        {scanType === null ? (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Choose Scan Type <span className="font-normal text-gray-500 dark:text-gray-400 text-sm">(स्कैन प्रकार चुनें)</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              What would you like to analyze today?
            </p>
            <div className="flex flex-col gap-3">
              {/* CARD 1 */}
              <div
                onClick={() => setScanType("disease")}
                className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all duration-150 shadow-sm"
              >
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ScanLine size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Crop Disease Scanner</div>
                  <div className="text-xs text-green-600 dark:text-green-400">फसल रोग स्कैनर</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Detect diseases on crop leaves</div>
                  <div className="mt-1 inline-block text-[10px] bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
                    38 Disease Classes
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400 ml-auto flex-shrink-0" />
              </div>

              {/* CARD 2 */}
              <div
                onClick={() => setScanType("plant")}
                className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all duration-150 shadow-sm"
              >
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Leaf size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Plant Identifier</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">पौधा पहचानकर्ता</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Identify any plant or crop species</div>
                  <div className="mt-1 inline-block text-[10px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                    Powered by PlantNet
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400 ml-auto flex-shrink-0" />
              </div>

              {/* CARD 3 */}
              <div
                onClick={() => setScanType("land")}
                className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all duration-150 shadow-sm"
              >
                <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mountain size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Land & Soil Analyzer</div>
                  <div className="text-xs text-amber-600 dark:text-amber-400">भूमि व मिट्टी विश्लेषक</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Analyze soil quality and get crop recommendations</div>
                  <div className="mt-1 inline-block text-[10px] bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                    AI Vision Analysis
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400 ml-auto flex-shrink-0" />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setScanType(null)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 dark:hover:text-white mb-4 text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Change Scan Type
            </button>

            <div className="mb-4">
              {scanType === "disease" && (
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 text-xs font-semibold rounded-full border border-green-200/50 dark:border-green-800/30">
                  Crop Disease Scanner
                </span>
              )}
              {scanType === "plant" && (
                <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-full border border-emerald-200/50 dark:border-emerald-800/30">
                  Plant Identifier
                </span>
              )}
              {scanType === "land" && (
                <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold rounded-full border border-amber-200/50 dark:border-amber-800/30">
                  Land & Soil Analyzer
                </span>
              )}
            </div>

            {!selectedFile ? (
              <ImagePicker
                onFileSelect={handleFileSelect}
                error={error}
                scanType={scanType}
              />
            ) : (
              <ImagePreview
                preview={preview}
                uploading={uploading}
                uploadResult={uploadResult}
                error={error}
                handleUpload={handleUpload}
                resetUpload={resetUpload}
                scanType={scanType}
              />
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ScanPage;

