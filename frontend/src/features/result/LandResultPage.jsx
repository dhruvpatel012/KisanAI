import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import api from "../../lib/axios";
import { useLanguage } from "../../context/LanguageContext";
import { 
  Mountain, 
  Droplets, 
  Sprout, 
  FlaskConical, 
  CheckCircle2, 
  Leaf, 
  X, 
  AlertTriangle, 
  Info 
} from "lucide-react";

const LandResultPage = () => {
  const { uploadId } = useParams();
  const navigate = useNavigate();
  const { t, tDyn } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/scans/${uploadId}`);
        if (response.data?.land_result) {
          setResult(response.data.land_result);
        } else {
          setError(t("No land analysis result found.", "कोई भूमि विश्लेषण परिणाम नहीं मिला।"));
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
      <PageLayout title={t("Soil Analysis", "मिट्टी का विश्लेषण")} showBack={true}>
        <div className="max-w-md mx-auto p-4 flex flex-col gap-6">
          <div className="h-48 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-24 bg-gray-200 animate-pulse rounded-2xl" />
            <div className="h-24 bg-gray-200 animate-pulse rounded-2xl" />
            <div className="h-24 bg-gray-200 animate-pulse rounded-2xl" />
            <div className="h-24 bg-gray-200 animate-pulse rounded-2xl" />
          </div>
          <div className="h-32 bg-gray-200 animate-pulse rounded-2xl" />
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={t("Soil Analysis", "मिट्टी का विश्लेषण")} showBack={true}>
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
      <PageLayout title={t("Soil Analysis", "मिट्टी का विश्लेषण")} showBack={true}>
        <div className="max-w-md mx-auto p-4 flex flex-col gap-6 text-center">
          <p className="text-gray-600">{t("Result data is not available.", "परिणाम डेटा उपलब्ध नहीं है।")}</p>
          <Button variant="primary" onClick={() => navigate("/scan")} fullWidth>
            {t("Scan Another", "दूसरा स्कैन करें")}
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Color functions for badges
  const getPhColor = (ph) => {
    if (!ph) return "text-gray-600";
    const phLower = ph.toLowerCase();
    if (phLower.includes("acid")) return "text-amber-600 bg-amber-50";
    if (phLower.includes("alkaline")) return "text-blue-600 bg-blue-50";
    return "text-green-600 bg-green-50";
  };

  const getMoistureColor = (moisture) => {
    if (!moisture) return "text-gray-600";
    const moistLower = moisture.toLowerCase();
    if (moistLower.includes("dry")) return "text-red-500 bg-red-50";
    if (moistLower.includes("wet") || moistLower.includes("high")) return "text-blue-500 bg-blue-50";
    return "text-amber-500 bg-amber-50";
  };

  const getFertilityColor = (fertility) => {
    if (!fertility) return "text-gray-600";
    const fertLower = fertility.toLowerCase();
    if (fertLower.includes("high")) return "text-green-600 bg-green-50";
    if (fertLower.includes("low")) return "text-red-500 bg-red-50";
    return "text-amber-500 bg-amber-50";
  };

  return (
    <PageLayout title={t("Soil Analysis", "मिट्टी का विश्लेषण")} showBack={true}>
      <div className="max-w-md mx-auto p-4 flex flex-col gap-6">
        
        {/* SECTION 1 — Soil Overview Hero Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl p-5 border-none shadow-md">
          <Mountain className="absolute -top-4 -right-4 w-28 h-28 text-white opacity-20 transform rotate-12" />
          <div className="relative z-10 flex flex-col items-start text-white">
            <span className="text-amber-200 text-xs font-bold uppercase tracking-widest mb-1">
              {t("SOIL ANALYSIS RESULTS", "मिट्टी विश्लेषण परिणाम")}
            </span>
            <h2 className="text-2xl font-bold text-white leading-tight capitalize">
              {tDyn(result.soil_type)}
            </h2>
            {result.soil_color && (
              <p className="text-amber-200 text-sm mt-1">
                {tDyn(result.soil_color)}
              </p>
            )}
          </div>
        </Card>

        {/* SECTION 2 — Metrics 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* pH Level */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-gray-400">
              <FlaskConical className="w-4 h-4 text-gray-500" />
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                {t("pH Level", "पीएच स्तर")}
              </span>
            </div>
            <span className={`text-sm font-bold capitalize ${getPhColor(result.estimated_ph)} px-2 py-0.5 rounded-md inline-block w-fit`}>
              {tDyn(result.estimated_ph) || t("Unknown", "अज्ञात")}
            </span>
          </div>

          {/* Moisture */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                {t("Moisture", "नमी")}
              </span>
            </div>
            <span className={`text-sm font-bold capitalize ${getMoistureColor(result.moisture_level)} px-2 py-0.5 rounded-md inline-block w-fit`}>
              {tDyn(result.moisture_level) || t("Unknown", "अज्ञात")}
            </span>
          </div>

          {/* Fertility */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Sprout className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                {t("Fertility", "उर्वरता")}
              </span>
            </div>
            <span className={`text-sm font-bold capitalize ${getFertilityColor(result.fertility)} px-2 py-0.5 rounded-md inline-block w-fit`}>
              {tDyn(result.fertility) || t("Unknown", "अज्ञात")}
            </span>
          </div>

          {/* Soil Type */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Mountain className="w-4 h-4 text-amber-600" />
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                {t("Soil Type", "मिट्टी प्रकार")}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-700 bg-gray-50 px-2 py-0.5 rounded-md inline-block w-fit capitalize">
              {tDyn(result.soil_type) || t("Unknown", "अज्ञात")}
            </span>
          </div>
        </div>

        {/* SECTION 3 — Best Crops Card */}
        {result.best_crops && result.best_crops.length > 0 && (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-green-800 font-bold mb-2">
              <Sprout className="w-5 h-5 text-green-600" />
              <span>{t("Recommended Crops", "अनुशंसित फसलें")}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {result.best_crops.map((crop, idx) => (
                <span 
                  key={idx} 
                  className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full capitalize"
                >
                  {tDyn(crop)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4 — Avoid Crops Card */}
        {result.avoid_crops && result.avoid_crops.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-red-800 font-bold mb-2">
              <X className="w-5 h-5 text-red-500" />
              <span>{t("Avoid These Crops", "इन फसलों से बचें")}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {result.avoid_crops.map((crop, idx) => (
                <span 
                  key={idx} 
                  className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full capitalize"
                >
                  {tDyn(crop)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5 — Recommendations Card */}
        <Card className="bg-white shadow-sm rounded-2xl p-4 border border-gray-100 flex flex-col gap-4">
          {/* Fertilizer Advisory */}
          <div>
            <div className="flex items-center gap-2 text-green-600 font-bold">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="text-xs font-extrabold uppercase tracking-wide">
                {t("Fertilizer Advisory", "उर्वरक सलाह")}
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">
              {tDyn(result.fertilizer_recommendation) || t("No fertilizer advisory available.", "कोई उर्वरक सलाह उपलब्ध नहीं है।")}
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Irrigation Advice */}
          <div>
            <div className="flex items-center gap-2 text-blue-500 font-bold">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-extrabold uppercase tracking-wide">
                {t("Irrigation Advice", "सिंचाई सलाह")}
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">
              {tDyn(result.irrigation_advice) || t("No irrigation advice available.", "कोई सिंचाई सलाह उपलब्ध नहीं है।")}
            </p>
          </div>

          {result.soil_improvement_tips && result.soil_improvement_tips.length > 0 && (
            <>
              <hr className="border-gray-100" />
              {/* Soil Improvement Tips */}
              <div>
                <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wide mb-1.5 block">
                  {t("Improvement Tips", "सुधार के उपाय")}
                </span>
                <div className="flex flex-col gap-2 mt-1">
                  {result.soil_improvement_tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 leading-normal">{tDyn(tip)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </Card>

        {/* BOTTOM BUTTONS */}
        <div className="flex flex-col gap-3 mt-2">
          <Button variant="primary" onClick={() => navigate("/scan")} fullWidth>
            {t("Scan Another", "दूसरा स्कैन करें")}
          </Button>
          <Button variant="secondary" onClick={() => navigate("/dashboard")} fullWidth>
            {t("Dashboard", "डैशबोर्ड")}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default LandResultPage;
