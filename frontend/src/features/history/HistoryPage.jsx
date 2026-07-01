import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import api from "../../lib/axios";
import { useLanguage } from "../../context/LanguageContext";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

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

  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedIds([]);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    const confirmMessage = selectedIds.length === 1
      ? t("Are you sure you want to delete this scan?", "क्या आप वाकई इस जाँच को हटाना चाहते हैं?")
      : t(`Are you sure you want to delete these ${selectedIds.length} scans?`, `क्या आप वाकई इन ${selectedIds.length} जाँचों को हटाना चाहते हैं?`);
      
    if (!window.confirm(confirmMessage)) return;

    try {
      setIsDeleting(true);
      await api.post("/api/scans/delete-bulk", { scan_ids: selectedIds });
      setScans(scans.filter((scan) => !selectedIds.includes(scan.upload_id)));
      setSelectedIds([]);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to delete scans:", err);
      alert(t("Failed to delete scans. Please try again.", "हटाने में विफल। कृपया पुनः प्रयास करें।"));
    } finally {
      setIsDeleting(false);
    }
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

  // Severity color/variant mapping helper
  const getSeverityVariant = (scan) => {
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

  // Resolve Image URL
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const getImageUrl = (scan) => {
    if (!scan.image_url) return null;
    return (scan.image_url.startsWith("http") || scan.image_url.startsWith("data:"))
      ? scan.image_url
      : `${backendUrl}${scan.image_url}`;
  };

  return (
    <PageLayout title={t("Scan History", "इतिहास")}>
      <div className="max-w-md mx-auto flex flex-col gap-4 p-4 pb-20">
        
        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-20 bg-gray-100 animate-pulse rounded-2xl border border-gray-200" />
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
                  >
                    {isDeleting ? t("Deleting...", "हटाया जा रहा है...") : t("Delete", "हटाएं")}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={isDeleting}
                    className="font-bold py-1 px-3 text-xs"
                  >
                    {t("Cancel", "रद्द करें")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-emerald-950">
                  {t(`${scans.length} scans saved`, `${scans.length} जाँचें सहेजी गईं`)}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditMode(true)}
                  className="font-bold py-1 px-3 text-xs"
                >
                  {t("Edit", "संपादित करें")}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* SCAN LIST STATE */}
        {!loading && !error && scans.length > 0 && (
          <div className="flex flex-col gap-3">
            {scans.map((scan) => {
              const imgUrl = getImageUrl(scan);
              const isSelected = selectedIds.includes(scan.upload_id);
              
              const handleCardClick = () => {
                if (editMode) {
                  toggleSelect(scan.upload_id);
                } else {
                  navigate(`/result/${scan.upload_id}`);
                }
              };

              return (
                <Card
                  key={scan.upload_id}
                  onClick={handleCardClick}
                  className={`flex items-center justify-between p-4 hover:shadow-md transition-all duration-200 cursor-pointer border ${
                    isSelected ? "border-emerald-500 bg-emerald-50/10" : "border-emerald-50"
                  }`}
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
                    ) : (
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-xl border border-emerald-100/50 flex-shrink-0">
                        🌱
                      </div>
                    )}
                    <div>
                      <h4 className="font-extrabold text-emerald-950 text-sm leading-tight">
                        {scan.status === "uploaded"
                          ? t("Analyzing...", "विश्लेषण...")
                          : scan.disease || (scan.status === "low_confidence" ? t("Unclear Image", "अस्पष्ट चित्र") : t("Healthy", "स्वस्थ"))}
                      </h4>
                      {scan.crop && (
                        <p className="text-xs text-emerald-800 font-bold mt-0.5">
                          {scan.crop}
                        </p>
                      )}
                      <p className="text-[10px] text-gray-400 font-medium mt-1">
                        {formatDate(scan.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <Badge variant={getSeverityVariant(scan)}>
                      {getSeverityLabel(scan)}
                    </Badge>
                    {!editMode && (
                      <svg className="w-4 h-4 text-emerald-700/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default HistoryPage;
