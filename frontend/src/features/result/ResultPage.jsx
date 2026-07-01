import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import api from "../../lib/axios";
import { useLanguage } from "../../context/LanguageContext";
import confetti from "canvas-confetti";
import { AlertTriangle, CheckCircle, Leaf, Pill, ShieldCheck, ScanLine, Home } from "lucide-react";

const ResultPage = () => {
  const { uploadId } = useParams();
  const navigate = useNavigate();
  const { t, dt } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanData, setScanData] = useState(null);
  const [activeTab, setActiveTab] = useState("organic");
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  useEffect(() => {
    if (!scanData) return;
    const target = (scanData.confidence || 0) * 100;
    setAnimatedConfidence(0);

    const duration = 1500;
    const frameRate = 1000 / 60;
    const totalFrames = duration / frameRate;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easedProgress = progress * (2 - progress);
      const currentValue = easedProgress * target;

      if (frame >= totalFrames) {
        setAnimatedConfidence(target);
        clearInterval(timer);
      } else {
        setAnimatedConfidence(currentValue);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [scanData]);

  // Confetti celebration for healthy crops
  useEffect(() => {
    if (scanData?.is_healthy) {
      const end = Date.now() + 1500;
      const burst = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#22c55e", "#16a34a", "#86efac"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#22c55e", "#16a34a", "#86efac"],
        });
        if (Date.now() < end) requestAnimationFrame(burst);
      };
      burst();
    }
  }, [scanData]);

  useEffect(() => {
    const fetchScanData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/scans/${uploadId}`);
        setScanData(response.data);
      } catch (err) {
        console.error("Fetch scan details error:", err);
        const backendError = err.response?.data?.detail;
        setError(backendError || t("Failed to load scan details. Please try again.", "विवरण लोड करने में विफल।"));
      } finally {
        setLoading(false);
      }
    };

    if (uploadId) {
      fetchScanData();
    }
  }, [uploadId]);

  if (loading) {
    return (
      <PageLayout title={t("Analyzing Crop", "फसल विश्लेषण")} showBack={true}>
        <div className="max-w-md mx-auto flex flex-col gap-6 p-4">
          <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4 mx-auto" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mx-auto" />
          <div className="h-24 bg-gray-200 animate-pulse rounded-2xl" />
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={t("Error", "त्रुटि")} showBack={true}>
        <div className="max-w-md mx-auto p-4 flex flex-col gap-6">
          <Alert message={error} type="error" />
          <Button variant="primary" onClick={() => navigate("/scan")}>
            {t("Go Back", "वापस जाएं")}
          </Button>
        </div>
      </PageLayout>
    );
  }

  if (!scanData) {
    return (
      <PageLayout title={t("Not Found", "नहीं मिला")} showBack={true}>
        <div className="max-w-md mx-auto p-4 text-center">
          <p className="text-gray-600 mb-6">
            {t("Scan details not found.", "स्कैन विवरण नहीं मिला।")}
          </p>
          <Button variant="primary" onClick={() => navigate("/scan")}>
            {t("Go Back", "वापस जाएं")}
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Resolve Image URL
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const imageUrl = (scanData.image_url.startsWith("http") || scanData.image_url.startsWith("data:"))
    ? scanData.image_url
    : `${backendUrl}${scanData.image_url}`;

  // CASE 1: Low Confidence Response (Blurry/Non-plant photos)
  if (scanData.status === "low_confidence") {
    return (
      <PageLayout title={t("Analysis Unclear", "विश्लेषण अस्पष्ट")} showBack={true}>
        <Card className="max-w-md mx-auto p-6 flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100 shadow-sm animate-pulse">
            <AlertTriangle size={32} className="text-amber-500" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {t("Image Unclear", "छवि अस्पष्ट है")}
            </h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {scanData.message || t("The AI model could not detect a crop leaf. Please capture a clear, close-up photo of the leaf.", "एआई मॉडल फसल की पत्ती का पता नहीं लगा सका। कृपया पत्ती की साफ फोटो लें।")}
            </p>
          </div>

          <div className="w-full relative aspect-square overflow-hidden rounded-2xl border border-gray-200">
            <img src={imageUrl} alt="Scan Upload" className="w-full h-full object-cover grayscale opacity-60" />
          </div>

          <div className="flex flex-col gap-2.5 w-full">
            <Button variant="primary" onClick={() => navigate("/scan")} fullWidth className="font-bold">
              {t("Retake Photo", "दोबारा फोटो लें")}
            </Button>
            <Button variant="ghost" onClick={() => navigate("/dashboard")} fullWidth>
              {t("Go to Dashboard", "डैशबोर्ड पर जाएं")}
            </Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  // CASE 2: Healthy Crop Response
  if (scanData.is_healthy) {
    return (
      <PageLayout title={t("Healthy Crop", "स्वस्वस्थ फसल")} showBack={true}>
        <Card className="max-w-md mx-auto p-6 flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm animate-bounce" style={{ animationDuration: "3s" }}>
            <CheckCircle size={40} className="text-emerald-600 dark:text-emerald-400" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-emerald-950">
              {dt(scanData.crop)} {t("is Healthy!", "स्वस्थ है!")}
            </h2>
            <Badge variant="success" className="mt-2.5 font-bold uppercase text-xs">
              {t("Healthy", "स्वस्वस्थ")}
            </Badge>
          </div>

          <div className="w-full relative aspect-square overflow-hidden rounded-2xl border border-emerald-100 shadow-sm">
            <img src={imageUrl} alt="Healthy Crop" className="w-full h-full object-cover" />
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 w-full text-left">
            <h4 className="font-bold text-emerald-900 text-sm mb-1">
              {t("Advisory", "सलाह")}:
            </h4>
            <p className="text-xs text-emerald-700 leading-relaxed">
              {dt("No disease symptoms detected. Keep maintaining standard balanced fertilizer, regular watering, and good crop rotation practices.")}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 w-full">
            <Button variant="primary" onClick={() => navigate("/scan")} fullWidth className="font-bold">
              {t("Scan Another Crop", "अन्य फसल जाँचें")}
            </Button>
            <Button variant="ghost" onClick={() => navigate("/dashboard")} fullWidth>
              {t("Go to Dashboard", "डैशबोर्ड पर जाएं")}
            </Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  // CASE 3: Diseased Crop Dashboard
  const confidencePercent = animatedConfidence.toFixed(1);
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedConfidence / 100) * circumference;

  // Filter organic vs chemical treatment steps
  const organicSteps = scanData.treatment_steps.filter(
    (step) =>
      !step.toLowerCase().includes("fungicide") &&
      !step.toLowerCase().includes("chemical") &&
      !step.toLowerCase().includes("pesticide")
  );
  const chemicalSteps = scanData.treatment_steps.filter(
    (step) =>
      step.toLowerCase().includes("fungicide") ||
      step.toLowerCase().includes("chemical") ||
      step.toLowerCase().includes("pesticide")
  );

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-rose-50 border-rose-100 text-rose-700";
      case "medium":
        return "bg-amber-50 border-amber-100 text-amber-700";
      default:
        return "bg-emerald-50 border-emerald-100 text-emerald-700";
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return t("HIGH RISK", "उच्च जोखिम");
      case "medium":
        return t("MEDIUM RISK", "मध्यम जोखिम");
      default:
        return t("LOW RISK", "कम जोखिम");
    }
  };

  const getUrgencyBannerClass = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "immediate":
        return "bg-red-50 text-red-700 border-red-100";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "low":
        return "bg-green-50 text-green-700 border-green-100";
      default:
        return "bg-green-50 text-green-700 border-green-100";
    }
  };

  const getUrgencyLabel = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "immediate":
        return t("ATTENTION REQUIRED IMMEDIATELY", "तुरंत ध्यान देने की आवश्यकता है");
      case "high":
        return t("HIGH PRIORITY TREATMENT REQUIRED", "उच्च प्राथमिकता उपचार की आवश्यकता है");
      case "medium":
        return t("MODERATE ACTION ADVISED", "मध्यम कार्रवाई की सलाह दी जाती है");
      case "low":
        return t("ROUTINE CARE RECOMMENDED", "नियमित देखभाल की सिफारिश की जाती है");
      default:
        return t("ACTION ADVISED", "कार्रवाई की सलाह");
    }
  };

  return (
    <PageLayout title={t("Diagnosis", "रोग निदान")} showBack={true}>
      <div className="max-w-md mx-auto flex flex-col gap-5 p-4 pb-20">
        
        {/* Main Details Card */}
        <Card className="p-5 flex flex-col gap-4 animate-fadeSlideUp" style={{ animationDelay: "0ms" }}>
          <div className="flex justify-between items-center gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-700/70 tracking-wide uppercase flex items-center gap-1.5">
                <AlertTriangle size={16} className="text-red-500" />
                {t("Detected Disease", "बीमारी")}
              </span>
              <h2 className="text-xl font-extrabold text-emerald-950 mt-0.5 leading-snug">
                {dt(scanData.disease)}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-semibold text-gray-500">
                  {t("Crop:", "फसल:")} {dt(scanData.crop)}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getSeverityColor(scanData.severity)}`}>
                  {getSeverityLabel(scanData.severity)}
                </span>
              </div>
              
              {scanData.urgency && (
                <div className={`mt-3 px-3 py-2 rounded-xl border text-[11px] font-bold flex items-center gap-2 shadow-sm ${getUrgencyBannerClass(scanData.urgency)}`}>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                  </span>
                  {getUrgencyLabel(scanData.urgency)}
                </div>
              )}
            </div>

            {/* Circular Accuracy Progress Gauge */}
            <div className="relative flex items-center justify-center flex-shrink-0" style={{ filter: "drop-shadow(0 0 8px rgba(34,197,94,0.3))" }}>
              <svg className="w-20 h-20 transform -rotate-90">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <circle className="text-emerald-50 dark:text-emerald-950" strokeWidth="5" stroke="currentColor" fill="transparent" r={radius} cx="40" cy="40" />
                <circle strokeWidth="5" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="url(#gaugeGradient)" fill="transparent" r={radius} cx="40" cy="40" className="transition-all duration-700 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-sm font-extrabold text-emerald-950 dark:text-emerald-100">{confidencePercent}%</span>
                <span className="text-[8px] font-bold text-emerald-700/60 dark:text-emerald-400/60 uppercase">
                  {t("Accuracy", "सटीकता")}
                </span>
              </div>
            </div>
          </div>

          {/* Uploaded Crop Image Thumbnail */}
          <div className="w-full relative aspect-video overflow-hidden rounded-2xl border border-gray-100 shadow-sm mt-1">
            <img src={imageUrl} alt="Scan Result" className="w-full h-full object-cover" />
          </div>
        </Card>

        {/* Treatment Recommendations Tabs Card */}
        <Card className="overflow-hidden animate-fadeSlideUp" style={{ animationDelay: "100ms" }}>
          {/* Tabs header */}
          <div className="flex border-b border-emerald-50 bg-emerald-50/20">
            <button
              className={`flex-1 py-3.5 text-xs font-extrabold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "organic"
                  ? "border-emerald-600 text-emerald-900 bg-emerald-50/40"
                  : "border-transparent text-emerald-800/60 hover:text-emerald-700"
              }`}
              onClick={() => setActiveTab("organic")}
            >
              <Leaf size={16} />
              {t("Organic Care", "जैविक उपचार")}
            </button>
            <button
              className={`flex-1 py-3.5 text-xs font-extrabold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "chemical"
                  ? "border-emerald-600 text-emerald-900 bg-emerald-50/40"
                  : "border-transparent text-emerald-800/60 hover:text-emerald-700"
              }`}
              onClick={() => setActiveTab("chemical")}
            >
              <Pill size={16} />
              {t("Chemical Care", "रासायनिक उपचार")}
            </button>
          </div>

          {/* Tab contents */}
          <div className="p-5">
            {activeTab === "organic" ? (
              <div className="flex flex-col gap-3">
                {organicSteps.length > 0 ? (
                  organicSteps.map((step, idx) => (
                    <div
                      key={idx}
                      style={{
                        animation: "slideInUp 0.3s ease both",
                        animationDelay: `${idx * 150}ms`
                      }}
                      className="flex gap-3 items-start bg-emerald-50/30 border border-emerald-100/50 rounded-xl p-3 animate-[slideInUp_0.3s_ease_both]"
                    >
                      <span className="text-emerald-600 mt-0.5 text-sm font-extrabold">✓</span>
                      <p className="text-xs text-emerald-900 font-medium leading-relaxed">{dt(step)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center py-4">
                    {t("No organic treatment steps listed.", "कोई जैविक उपचार चरण सूचीबद्ध नहीं हैं।")}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {chemicalSteps.length > 0 ? (
                  chemicalSteps.map((step, idx) => (
                    <div
                      key={idx}
                      style={{
                        animation: "slideInUp 0.3s ease both",
                        animationDelay: `${idx * 150}ms`
                      }}
                      className="flex gap-3 items-start bg-rose-50/20 border border-rose-100/40 rounded-xl p-3 animate-[slideInUp_0.3s_ease_both]"
                    >
                      <span className="text-rose-500 mt-0.5 text-sm font-extrabold">⚠</span>
                      <p className="text-xs text-rose-950 font-medium leading-relaxed">{dt(step)}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-3 items-start bg-emerald-50/30 border border-emerald-100/50 rounded-xl p-4 text-center justify-center">
                    <p className="text-xs text-emerald-800 font-medium">
                      {t("No chemical inputs required. Keep using standard organic preventions.", "किसी रासायनिक इनपुट की आवश्यकता नहीं है। जैविक निवारणों का उपयोग जारी रखें।")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Fertilizer & Prevention Card */}
        {(scanData.fertilizer || scanData.prevention) && (
          <Card className="p-5 flex flex-col gap-4 animate-fadeSlideUp" style={{ animationDelay: "200ms" }}>
            <h3 className="text-sm font-extrabold text-emerald-950 dark:text-emerald-100 tracking-wide uppercase border-b border-emerald-50 pb-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-green-600" />
              {t("Soil & Prevention", "मिट्टी और रोकथाम")}
            </h3>

            {scanData.fertilizer && (
              <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-3">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">
                  {t("Fertilizer Advisory", "खाद सलाह")}
                </span>
                <p className="text-xs text-emerald-950 font-medium mt-1 leading-relaxed">{dt(scanData.fertilizer)}</p>
              </div>
            )}

            {scanData.prevention && (
              <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-3">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">
                  {t("Prevention Plan", "बचाव योजना")}
                </span>
                <p className="text-xs text-emerald-950 font-medium mt-1 leading-relaxed">{dt(scanData.prevention)}</p>
              </div>
            )}
          </Card>
        )}

        {/* Similar Diseases Section */}
        {scanData.similar_diseases && scanData.similar_diseases.length > 0 && (
          <div className="flex flex-col gap-2.5 animate-fadeSlideUp" style={{ animationDelay: "300ms" }}>
            <h3 className="text-xs font-bold text-emerald-800 tracking-wider uppercase pl-1">
              {t("Similar Matches", "मिलते-जुलते रोग")}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {scanData.similar_diseases.map((disease, idx) => (
                <Card key={idx} className="p-3.5 flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-emerald-950 truncate">{dt(disease.name)}</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-semibold text-gray-500">{t("Match:", "तुलना:")}</span>
                    <span className="font-extrabold text-emerald-700">{(disease.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-semibold text-gray-500">{t("Risk:", "जोखिम:")}</span>
                    <span className="font-bold text-amber-700 uppercase">{disease.severity}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Model Disclaimer */}
        {scanData.disclaimer && (
          <p className="text-[10px] text-center text-emerald-800/50 italic leading-relaxed px-4 mt-2">
            {scanData.disclaimer}
          </p>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 w-full mt-4 animate-fadeSlideUp" style={{ animationDelay: "400ms" }}>
          <Button variant="primary" onClick={() => navigate("/scan")} fullWidth className="font-bold py-3.5">
            <ScanLine size={18} className="mr-1 inline-block align-middle" />
            <span className="inline-block align-middle">{t("Scan Another Crop", "नई फसल जाँचें")}</span>
          </Button>
          <Button variant="secondary" onClick={() => navigate("/dashboard")} fullWidth className="border-emerald-100 text-emerald-800 hover:bg-emerald-50 font-bold">
            <Home size={18} className="mr-1 inline-block align-middle" />
            <span className="inline-block align-middle">{t("Back to Dashboard", "वापस जाएं")}</span>
          </Button>
        </div>

      </div>
    </PageLayout>
  );
};

export default ResultPage;
