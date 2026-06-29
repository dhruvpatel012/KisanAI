import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import api from "../../lib/axios";

const ResultPage = () => {
  const { uploadId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanData, setScanData] = useState(null);
  const [activeTab, setActiveTab] = useState("organic");

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
        setError(backendError || "Failed to load scan details. Please try again.");
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
      <PageLayout title="Analyzing Crop / फसल विश्लेषण" showBack={true}>
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
      <PageLayout title="Error / त्रुटि" showBack={true}>
        <div className="max-w-md mx-auto p-4 flex flex-col gap-6">
          <Alert message={error} type="error" />
          <Button variant="primary" onClick={() => navigate("/scan")}>
            Go Back / वापस जाएं
          </Button>
        </div>
      </PageLayout>
    );
  }

  if (!scanData) {
    return (
      <PageLayout title="Not Found / नहीं मिला" showBack={true}>
        <div className="max-w-md mx-auto p-4 text-center">
          <p className="text-gray-600 mb-6">Scan details not found. / स्कैन विवरण नहीं मिला।</p>
          <Button variant="primary" onClick={() => navigate("/scan")}>
            Go Back / वापस जाएं
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Resolve Image URL
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const imageUrl = scanData.image_url.startsWith("http")
    ? scanData.image_url
    : `${backendUrl}${scanData.image_url}`;

  // CASE 1: Low Confidence Response (Blurry/Non-plant photos)
  if (scanData.status === "low_confidence") {
    return (
      <PageLayout title="Analysis Unclear / विश्लेषण अस्पष्ट" showBack={true}>
        <Card className="max-w-md mx-auto p-6 flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100 shadow-sm animate-pulse">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">Image Unclear / छवि अस्पष्ट है</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {scanData.message || "The AI model could not detect a crop leaf. Please capture a clear, close-up photo of the leaf."}
            </p>
          </div>

          <div className="w-full relative aspect-square overflow-hidden rounded-2xl border border-gray-200">
            <img src={imageUrl} alt="Scan Upload" className="w-full h-full object-cover grayscale opacity-60" />
          </div>

          <div className="flex flex-col gap-2.5 w-full">
            <Button variant="primary" onClick={() => navigate("/scan")} fullWidth className="font-bold">
              Retake Photo / दोबारा फोटो लें
            </Button>
            <Button variant="ghost" onClick={() => navigate("/dashboard")} fullWidth>
              Go to Dashboard / डैशबोर्ड पर जाएं
            </Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  // CASE 2: Healthy Crop Response
  if (scanData.is_healthy) {
    return (
      <PageLayout title="Healthy Crop / स्वस्थ फसल" showBack={true}>
        <Card className="max-w-md mx-auto p-6 flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm animate-bounce" style={{ animationDuration: "3s" }}>
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-emerald-950">Crop is Healthy! / फसल स्वस्थ है!</h2>
            <Badge variant="success" className="mt-2.5 font-bold uppercase text-xs">Healthy / स्वस्थ</Badge>
          </div>

          <div className="w-full relative aspect-square overflow-hidden rounded-2xl border border-emerald-100 shadow-sm">
            <img src={imageUrl} alt="Healthy Crop" className="w-full h-full object-cover" />
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 w-full text-left">
            <h4 className="font-bold text-emerald-900 text-sm mb-1">Advisory / सलाह:</h4>
            <p className="text-xs text-emerald-700 leading-relaxed">
              No disease symptoms detected. Keep maintaining standard balanced fertilizer, regular watering, and good crop rotation practices.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 w-full">
            <Button variant="primary" onClick={() => navigate("/scan")} fullWidth className="font-bold">
              Scan Another Crop / अन्य फसल जाँचें
            </Button>
            <Button variant="ghost" onClick={() => navigate("/dashboard")} fullWidth>
              Go to Dashboard / डैशबोर्ड पर जाएं
            </Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  // CASE 3: Diseased Crop Dashboard
  const confidencePercent = (scanData.confidence * 100).toFixed(1);
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidencePercent / 100) * circumference;

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

  return (
    <PageLayout title="Diagnosis / रोग निदान" showBack={true}>
      <div className="max-w-md mx-auto flex flex-col gap-5 p-4 pb-20">
        
        {/* Main Details Card */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-700/70 tracking-wide uppercase">Detected Disease / बीमारी</span>
              <h2 className="text-xl font-extrabold text-emerald-950 mt-0.5 leading-snug">
                {scanData.disease}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-semibold text-gray-500">Crop: {scanData.crop}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getSeverityColor(scanData.severity)}`}>
                  {scanData.severity?.toUpperCase()} RISK
                </span>
              </div>
            </div>

            {/* Circular Accuracy Progress Gauge */}
            <div className="relative flex items-center justify-center flex-shrink-0">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle className="text-emerald-50" strokeWidth="5" stroke="currentColor" fill="transparent" r={radius} cx="40" cy="40" />
                <circle className="text-emerald-600 transition-all duration-700 ease-out" strokeWidth="5" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="40" cy="40" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-sm font-extrabold text-emerald-950">{confidencePercent}%</span>
                <span className="text-[8px] font-bold text-emerald-700/60 uppercase">Accuracy</span>
              </div>
            </div>
          </div>

          {/* Uploaded Crop Image Thumbnail */}
          <div className="w-full relative aspect-video overflow-hidden rounded-2xl border border-gray-100 shadow-sm mt-1">
            <img src={imageUrl} alt="Scan Result" className="w-full h-full object-cover" />
          </div>
        </Card>

        {/* Treatment Recommendations Tabs Card */}
        <Card className="overflow-hidden">
          {/* Tabs header */}
          <div className="flex border-b border-emerald-50 bg-emerald-50/20">
            <button
              className={`flex-1 py-3.5 text-xs font-extrabold text-center border-b-2 transition-all ${
                activeTab === "organic"
                  ? "border-emerald-600 text-emerald-900 bg-emerald-50/40"
                  : "border-transparent text-emerald-800/60 hover:text-emerald-700"
              }`}
              onClick={() => setActiveTab("organic")}
            >
              Organic Care / जैविक उपचार
            </button>
            <button
              className={`flex-1 py-3.5 text-xs font-extrabold text-center border-b-2 transition-all ${
                activeTab === "chemical"
                  ? "border-emerald-600 text-emerald-900 bg-emerald-50/40"
                  : "border-transparent text-emerald-800/60 hover:text-emerald-700"
              }`}
              onClick={() => setActiveTab("chemical")}
            >
              Chemical Care / रासायनिक उपचार
            </button>
          </div>

          {/* Tab contents */}
          <div className="p-5">
            {activeTab === "organic" ? (
              <div className="flex flex-col gap-3">
                {organicSteps.length > 0 ? (
                  organicSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 items-start bg-emerald-50/30 border border-emerald-100/50 rounded-xl p-3">
                      <span className="text-emerald-600 mt-0.5 text-sm font-extrabold">✓</span>
                      <p className="text-xs text-emerald-900 font-medium leading-relaxed">{step}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center py-4">No organic treatment steps listed.</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {chemicalSteps.length > 0 ? (
                  chemicalSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 items-start bg-rose-50/20 border border-rose-100/40 rounded-xl p-3">
                      <span className="text-rose-500 mt-0.5 text-sm font-extrabold">⚠</span>
                      <p className="text-xs text-rose-950 font-medium leading-relaxed">{step}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-3 items-start bg-emerald-50/30 border border-emerald-100/50 rounded-xl p-4 text-center justify-center">
                    <p className="text-xs text-emerald-800 font-medium">
                      No chemical inputs required. Keep using standard organic preventions.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Fertilizer & Prevention Card */}
        {(scanData.fertilizer || scanData.prevention) && (
          <Card className="p-5 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-emerald-950 tracking-wide uppercase border-b border-emerald-50 pb-2">
              Soil & Prevention / मिट्टी और रोकथाम
            </h3>

            {scanData.fertilizer && (
              <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-3">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Fertilizer Advisory / खाद सलाह</span>
                <p className="text-xs text-emerald-950 font-medium mt-1 leading-relaxed">{scanData.fertilizer}</p>
              </div>
            )}

            {scanData.prevention && (
              <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-3">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Prevention Plan / बचाव योजना</span>
                <p className="text-xs text-emerald-950 font-medium mt-1 leading-relaxed">{scanData.prevention}</p>
              </div>
            )}
          </Card>
        )}

        {/* Similar Diseases Section */}
        {scanData.similar_diseases && scanData.similar_diseases.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold text-emerald-800 tracking-wider uppercase pl-1">
              Similar Matches / मिलते-जुलते रोग
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {scanData.similar_diseases.map((disease, idx) => (
                <Card key={idx} className="p-3.5 flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-emerald-950 truncate">{disease.name}</span>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-semibold text-gray-500">Match:</span>
                    <span className="font-extrabold text-emerald-700">{(disease.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-semibold text-gray-500">Risk:</span>
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
        <div className="flex flex-col gap-2 w-full mt-4">
          <Button variant="primary" onClick={() => navigate("/scan")} fullWidth className="font-bold py-3.5">
            Scan Another Crop / नई फसल जाँचें
          </Button>
          <Button variant="secondary" onClick={() => navigate("/dashboard")} fullWidth className="border-emerald-100 text-emerald-800 hover:bg-emerald-50 font-bold">
            Back to Dashboard / वापस जाएं
          </Button>
        </div>

      </div>
    </PageLayout>
  );
};

export default ResultPage;
