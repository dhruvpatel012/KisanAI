import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import api from "../../lib/axios";
import { useLanguage } from "../../context/LanguageContext";
import { ChevronRight, Trash2, Pencil, Clock, AlertCircle, CheckCircle2, Leaf, Mountain } from "lucide-react";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { t, dt } = useLanguage();

  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchScans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/scans");
      setScans(response.data);
    } catch (err) {
      console.error("Failed to fetch scans:", err);
      const backendError = err.response?.data?.detail;
      setError(backendError || t("Failed to load scan history. Please try again.", "इतिहास लोड करने में विफल। पुनः प्रयास करें।"));
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === scans.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(scans.map((scan) => scan.upload_id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    try {
      setIsDeleting(true);
      setError(null);
      await api.post("/api/scans/delete-bulk", { scan_ids: selectedIds });
      setScans(scans.filter((scan) => !selectedIds.includes(scan.upload_id)));
      setSelectedIds([]);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to delete scans:", err);
      const backendError = err.response?.data?.detail;
      setError(backendError || t("Failed to delete selected scans.", "चयनित स्कैन हटाने में विफल।"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedIds([]);
    setEditMode(false);
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getScanRoute = (scan) => {
    if (scan.scan_type === "plant_identify") return `/plant-result/${scan.upload_id}`;
    if (scan.scan_type === "land_analysis") return `/land-result/${scan.upload_id}`;
    return `/result/${scan.upload_id}`;
  };

  const getScanTitle = (scan) => {
    if (scan.scan_type === "plant_identify") {
      return scan.plant_result?.plant_name || t("Plant Scan", "पौधा स्कैन");
    }
    if (scan.scan_type === "land_analysis") {
      const soilType = scan.land_result?.soil_type;
      return soilType
        ? `${soilType.charAt(0).toUpperCase() + soilType.slice(1)} Soil`
        : t("Land Analysis", "भूमि विश्लेषण");
    }
    if (scan.status === "uploaded") return t("Analyzing...", "विश्लेषण...");
    return dt(scan.disease) || (scan.status === "low_confidence" ? t("Unclear Image", "अस्पष्ट चित्र") : t("Healthy", "स्वस्थ"));
  };

  const getScanSubtitle = (scan) => {
    if (scan.scan_type === "plant_identify") {
      return scan.plant_result?.scientific_name || t("Plant Identifier", "पौधा पहचानकर्ता");
    }
    if (scan.scan_type === "land_analysis") {
      return t("Land & Soil Analyzer", "भूमि और मिट्टी विश्लेषक");
    }
    return scan.crop ? dt(scan.crop) : null;
  };

  const getSeverityVariant = (scan) => {
    if (scan.scan_type === "plant_identify") return "success";
    if (scan.scan_type === "land_analysis") return "info";
    if (scan.status === "low_confidence") return "warning";
    if (scan.status === "uploaded") return "info";
    if (scan.is_healthy) return "success";
    
    switch (scan.severity?.toLowerCase()) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "gray";
    }
  };

  const getSeverityLabel = (scan) => {
    if (scan.scan_type === "plant_identify") {
      if (scan.status === "identify_failed") return t("ID Failed", "पहचान विफल");
      return t("Plant ID", "पौधा ID");
    }
    if (scan.scan_type === "land_analysis") {
      if (scan.status === "land_failed") return t("Analysis Failed", "विश्लेषण विफल");
      return t("Soil Analysis", "मिट्टी जाँच");
    }
    if (scan.status === "low_confidence") return t("Unclear", "अस्पष्ट");
    if (scan.status === "uploaded") return t("Analyzing...", "विश्लेषण...");
    if (scan.is_healthy) return t("Healthy", "स्वस्थ");

    switch (scan.severity?.toLowerCase()) {
      case "high":
        return t("High Risk", "उच्च जोखिम");
      case "medium":
        return t("Medium Risk", "मध्यम जोखिम");
      case "low":
        return t("Low Risk", "कम जोखिम");
      default:
        return t("Unknown", "अज्ञात");
    }
  };

  const getCropEmoji = (scan) => {
    if (scan.scan_type === "plant_identify") return null; // use Leaf icon
    if (scan.scan_type === "land_analysis") return null;  // use Mountain icon
    const name = scan.crop?.toLowerCase() || "";
    if (name.includes("potato")) return "🥔";
    if (name.includes("tomato")) return "🍅";
    if (name.includes("wheat") || name.includes("rice")) return "🌾";
    return "🌱";
  };

  const getImageUrl = (scan) => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    if (!scan.image_url) return null;
    return (scan.image_url.startsWith("http") || scan.image_url.startsWith("data:"))
      ? scan.image_url
      : `${backendUrl}${scan.image_url}`;
  };

  const getLeftBorderColor = (scan) => {
    if (scan.scan_type === "plant_identify") return "border-l-4 border-emerald-500";
    if (scan.scan_type === "land_analysis") return "border-l-4 border-amber-500";
    if (scan.status === "low_confidence") return "border-l-4 border-amber-500";
    if (scan.status === "uploaded") return "border-l-4 border-blue-500";
    if (scan.is_healthy) return "border-l-4 border-green-500";
    
    switch (scan.severity?.toLowerCase()) {
      case "high":
        return "border-l-4 border-red-500";
      case "medium":
        return "border-l-4 border-amber-500";
      case "low":
        return "border-l-4 border-blue-400";
      case "none":
        return "border-l-4 border-green-400";
      default:
        return "border-l-4 border-gray-300";
    }
  };

  return (
    <PageLayout
      title={
        <div className="flex items-center">
          <Clock size={20} className="text-green-600 dark:text-green-400 mr-2" />
          <span>{t("Scan History", "इतिहास")}</span>
        </div>
      }
    >
      <div className="max-w-md mx-auto flex flex-col gap-4 p-4 pb-20">
        
        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-20 bg-gray-150 animate-pulse rounded-2xl border border-gray-200" />
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="flex flex-col gap-4">
            <Alert message={error} type="error" />
            <Button variant="primary" onClick={fetchScans} fullWidth>
              {t("Retry", "पुनः प्रयास करें")}
            </Button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && scans.length === 0 && (
          <Card className="flex flex-col items-center text-center p-8">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 text-3xl">
              🌾
            </div>
            <h2 className="text-xl font-bold text-gray-950 mb-1">
              {t("No Scans Yet", "कोई जाँच नहीं")}
            </h2>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              {t("Start by scanning your first crop to diagnose diseases.", "अपनी पहली फसल की जाँच शुरू करें।")}
            </p>
            <Button variant="primary" onClick={() => navigate("/scan")} className="font-bold px-8">
              {t("Start Scan", "जाँच शुरू करें")}
            </Button>
          </Card>
        )}

        {/* ACTION BAR */}
        {!loading && !error && scans.length > 0 && (
          <div className="flex items-center justify-between bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/60 mb-2">
            {editMode ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={scans.length > 0 && selectedIds.length === scans.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                    id="select-all-checkbox"
                  />
                  <label htmlFor="select-all-checkbox" className="text-xs font-bold text-emerald-950 cursor-pointer select-none">
                    {t("Select All", "सभी चुनें")} ({selectedIds.length}/{scans.length})
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDeleteSelected}
                    disabled={selectedIds.length === 0 || isDeleting}
                    className="font-bold py-1 px-3 text-xs"
                    fullWidth={false}
                  >
                    <Trash2 size={15} className="shrink-0" />
                    <span>{isDeleting ? t("Deleting...", "हटाया जा रहा है...") : t("Delete", "हटाएं")}</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={isDeleting}
                    className="font-bold py-1 px-3 text-xs"
                    fullWidth={false}
                  >
                    {t("Cancel", "रद्द करें")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-emerald-950 pr-4">
                  {t(`${scans.length} scans saved`, `${scans.length} जाँचें सहेजी गईं`)}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditMode(true)}
                  className="font-bold py-1 px-3 text-xs"
                  fullWidth={false}
                >
                  <Pencil size={15} className="shrink-0" />
                  <span>{t("Edit", "संपादित करें")}</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* SCAN LIST STATE */}
        {!loading && !error && scans.length > 0 && (
          <div className="flex flex-col gap-3">
            {scans.map((scan, idx) => {
              const imgUrl = getImageUrl(scan);
              const isSelected = selectedIds.includes(scan.upload_id);
              
              const handleCardClick = () => {
                if (editMode) {
                  toggleSelect(scan.upload_id);
                } else {
                  navigate(getScanRoute(scan));
                }
              };

              return (
                <div
                  key={scan.upload_id}
                  onClick={handleCardClick}
                  style={{
                    animationDelay: `${idx * 80}ms`
                  }}
                  className={`animate-fadeSlideUp opacity-0 flex items-center justify-between p-4 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-sm overflow-hidden active:scale-[0.99] transition-all cursor-pointer ${
                    isSelected ? "bg-emerald-50/20 dark:bg-emerald-900/20" : ""
                  } ${getLeftBorderColor(scan)}`}
                >
                  <div className="flex items-center gap-3">
                    {editMode && (
                      <div className="flex items-center mr-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(scan.upload_id)}
                          className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                        />
                      </div>
                    )}
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt="Crop Thumbnail"
                        className="w-12 h-12 rounded-xl object-cover border border-emerald-100 flex-shrink-0"
                      />
                    ) : scan.scan_type === "plant_identify" ? (
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100/50 flex-shrink-0">
                        <Leaf size={22} className="text-emerald-600" />
                      </div>
                    ) : scan.scan_type === "land_analysis" ? (
                      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100/50 flex-shrink-0">
                        <Mountain size={22} className="text-amber-600" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-xl border border-emerald-100/50 flex-shrink-0">
                        {getCropEmoji(scan)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-extrabold text-emerald-950 dark:text-emerald-100 text-sm leading-tight">
                        {getScanTitle(scan)}
                      </h4>
                      {getScanSubtitle(scan) && (
                        <p className="text-xs text-emerald-800 dark:text-emerald-400 font-bold mt-0.5">
                          {getScanSubtitle(scan)}
                        </p>
                      )}
                      <p className="text-[10px] text-gray-400 font-medium mt-1">
                        {formatDate(scan.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <Badge variant={getSeverityVariant(scan)} className="gap-1 flex items-center">
                      {scan.is_healthy ? (
                        <CheckCircle2 size={12} />
                      ) : scan.severity?.toLowerCase() === "high" ? (
                        <AlertCircle size={12} />
                      ) : null}
                      {getSeverityLabel(scan)}
                    </Badge>
                    {!editMode && (
                      <ChevronRight size={16} className="text-gray-300" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default HistoryPage;
