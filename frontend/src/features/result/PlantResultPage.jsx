import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import api from "../../lib/axios";
import { useLanguage } from "../../context/LanguageContext";
import { Leaf, Info, AlertTriangle } from "lucide-react";

const PlantResultPage = () => {
  const { uploadId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/scans/${uploadId}`);
        if (response.data?.plant_result) {
          setResult(response.data.plant_result);
        } else {
          setError(t("No plant identification result found.", "कोई पौधा पहचान परिणाम नहीं मिला।"));
        }
      } catch (err) {
        console.error("Fetch scan details error:", err);
        setError(err.response?.data?.detail || t("Failed to load result details.", "विवरण लोड करने में विफल।"));
      } finally {
        setLoading(false);
      }
    };

    if (uploadId) {
      fetchResult();
    }
  }, [uploadId, t]);

  if (loading) {
    return (
      <PageLayout title={t("Plant Identity", "पौधे की पहचान")} showBack={true}>
        <div className="max-w-md mx-auto p-4 flex flex-col gap-6">
          <div className="h-48 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-32 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-24 bg-gray-200 animate-pulse rounded-2xl" />
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={t("Plant Identity", "पौधे की पहचान")} showBack={true}>
        <div className="max-w-md mx-auto p-4 flex flex-col gap-6">
          <Alert message={error} type="error" />
          <Button variant="primary" onClick={() => window.location.reload()} fullWidth>
            {t("Retry", "पुनः प्रयास करें")}
          </Button>
        </div>
      </PageLayout>
    );
  }

  if (!result) {
    return (
      <PageLayout title={t("Plant Identity", "पौधे की पहचान")} showBack={true}>
        <div className="max-w-md mx-auto p-4 flex flex-col gap-6 text-center">
          <p className="text-gray-600">{t("Result data is not available.", "परिणाम डेटा उपलब्ध नहीं है।")}</p>
          <Button variant="primary" onClick={() => navigate("/scan")} fullWidth>
            {t("Scan Another Plant", "दूसरा पौधा स्कैन करें")}
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Handle stored error responses (e.g. PlantNet API quota exceeded)
  if (result.error || (!result.status && !result.plant_name)) {
    const errorMsg = result.error
      ? (result.error.includes("401")
        ? t("Plant identification service is temporarily unavailable. The API quota may be exceeded. Please try again later.", "पौधा पहचान सेवा अस्थायी रूप से अनुपलब्ध है। कृपया बाद में पुनः प्रयास करें।")
        : result.error)
      : t("Could not get identification result. Please scan again.", "परिणाम प्राप्त नहीं हो सका। कृपया दोबारा स्कैन करें।");

    return (
      <PageLayout title={t("Plant Identity", "पौधे की पहचान")} showBack={true}>
        <div className="max-w-md mx-auto p-4 flex flex-col gap-6">
          <Card className="border-l-4 border-red-400 bg-red-50/60 dark:bg-red-950/20 dark:border-red-900/30 p-6 flex flex-col items-center text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">
              {t("Identification Failed", "पहचान विफल")}
            </h3>
            <p className="text-sm text-red-700 dark:text-red-200 mb-6">{errorMsg}</p>
            <Button variant="primary" onClick={() => navigate("/scan")} fullWidth>
              {t("Try Again", "पुनः प्रयास करें")}
            </Button>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (result.status === "low_confidence") {
    const confVal = result.confidence != null 
      ? (result.confidence <= 1 ? (result.confidence * 100).toFixed(0) : result.confidence) 
      : 0;

    return (
      <PageLayout title={t("Plant Identity", "पौधे की पहचान")} showBack={true}>
        <div className="max-w-md mx-auto p-4 flex flex-col gap-6">
          <Card className="border-l-4 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20 dark:border-yellow-900/30 p-6 flex flex-col items-center text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-300 mb-2">
              {t("Could Not Identify Plant", "पौधे की पहचान नहीं हो सकी")}
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-200 mb-4">{result.message}</p>
            {confVal > 0 && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold mb-6">
                {t(`Confidence Level: ${confVal}%`, `आत्मविश्वास स्तर: ${confVal}%`)}
              </p>
            )}
            <Button variant="primary" onClick={() => navigate("/scan")} fullWidth>
              {t("Try Again", "पुनः प्रयास करें")}
            </Button>
          </Card>
        </div>
      </PageLayout>
    );
  }

  const confidencePercentage = result.confidence != null
    ? (result.confidence <= 1 ? (result.confidence * 100).toFixed(0) : result.confidence)
    : 0;

  return (
    <PageLayout title={t("Plant Identity", "पौधे की पहचान")} showBack={true}>
      <div className="max-w-md mx-auto p-4 flex flex-col gap-6">
        {/* SECTION 1 — Plant Identity Hero Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-5 border-none shadow-md">
          <Leaf className="absolute -top-4 -right-4 w-28 h-28 text-white opacity-20 transform rotate-12" />
          <div className="relative z-10 flex flex-col items-start text-white">
            <span className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">
              {t("IDENTIFIED PLANT", "पहचाना गया पौधा")}
            </span>
            <h2 className="text-2xl font-bold text-white leading-tight">
              {result.plant_name}
            </h2>
            {result.scientific_name && (
              <p className="text-emerald-200 text-sm italic mt-1">
                {result.scientific_name}
              </p>
            )}
            <div className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mt-4">
              {confidencePercentage}% {t("Match", "मैच")}
            </div>
          </div>
        </Card>

        {/* SECTION 2 — Classification Card */}
        <Card className="bg-white dark:bg-gray-900/60 shadow-sm rounded-2xl p-5 border border-gray-100 dark:border-gray-800/50">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">
            {t("Scientific Classification", "वैज्ञानिक वर्गीकरण")}
          </h3>
          <div className="flex flex-col gap-3.5">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/50 pb-2.5">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t("Plant Name", "पौधे का नाम")}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{result.plant_name}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/50 pb-2.5">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t("Scientific Name", "वैज्ञानिक नाम")}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white italic">{result.scientific_name}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t("Plant Family", "पौधा कुल")}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{result.family || "N/A"}</span>
            </div>
          </div>
        </Card>

        {/* SECTION 3 — Info Note Card */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 flex gap-3 items-start shadow-sm">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            {t(
              "Results powered by PlantNet API. For medical or legal purposes always consult a qualified botanist.",
              "परिणाम प्लांटनेट एपीआई द्वारा संचालित हैं। चिकित्सा या कानूनी उद्देश्यों के लिए हमेशा एक योग्य वनस्पतिशास्त्री से परामर्श लें।"
            )}
          </p>
        </div>

        {/* BOTTOM BUTTONS */}
        <div className="flex flex-col gap-3 mt-2">
          <Button variant="primary" onClick={() => navigate("/scan")} fullWidth>
            {t("Scan Another Plant", "दूसरा पौधा स्कैन करें")}
          </Button>
          <Button variant="secondary" onClick={() => navigate("/dashboard")} fullWidth>
            {t("Back to Dashboard", "डैशबोर्ड पर वापस जाएं")}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default PlantResultPage;
