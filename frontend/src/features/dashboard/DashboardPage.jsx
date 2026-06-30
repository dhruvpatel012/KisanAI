import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import api from "../../lib/axios";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("Hello");
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    const fetchRecentScans = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/scans");
        setScans(response.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch recent scans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentScans();
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
    if (scan.status === "low_confidence") return "Unclear / अस्पष्ट";
    if (scan.status === "uploaded") return "Analyzing / विश्लेषण...";
    if (scan.is_healthy) return "Healthy / स्वस्थ";

    switch (scan.severity?.toLowerCase()) {
      case "high":
        return "High Risk";
      case "medium":
        return "Medium Risk";
      case "low":
        return "Low Risk";
      default:
        return "Unknown";
    }
  };

  const getCropEmoji = (cropName) => {
    if (!cropName) return "🌱";
    const name = cropName.toLowerCase();
    if (name.includes("potato")) return "🥔";
    if (name.includes("tomato")) return "🍅";
    if (name.includes("wheat") || name.includes("rice")) return "🌾";
    return "🌱";
  };

  // Resolve Image URL
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const getImageUrl = (scan) => {
    if (!scan.image_url) return null;
    return scan.image_url.startsWith("http")
      ? scan.image_url
      : `${backendUrl}${scan.image_url}`;
  };

  return (
    <PageLayout>
      {/* SECTION 1 - Greeting */}
      <div className="mb-6 mt-2">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {greeting} <span className="animate-bounce">👋</span>
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          How are your crops today? / आज आपकी फसलें कैसी हैं?
        </p>
      </div>

      {/* SECTION 2 - Hero Scan Card */}
      <Card className="mb-6 bg-gradient-to-br from-brand-600 to-brand-800 text-white border-0 shadow-lg relative overflow-hidden">
        <div className="relative z-10 py-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs uppercase tracking-wider bg-brand-500/30 px-2.5 py-1 rounded-full font-semibold">
                Crop Health Scan / फसल जाँच
              </span>
              <h3 className="text-xl font-bold mt-2">Scan Your Crop</h3>
              <p className="text-brand-100 text-xs mt-1 max-w-[200px]">
                Detect diseases instantly using your mobile camera.
              </p>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
              📸
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate("/scan")}
            className="bg-white border-white text-brand-700 hover:bg-brand-50 font-bold"
          >
            Start Scan / जाँच शुरू करें →
          </Button>
        </div>
        {/* Background decorative crop shapes */}
        <div className="absolute right-[-20px] bottom-[-20px] text-white/5 text-[150px] pointer-events-none select-none font-bold">
          🌾
        </div>
      </Card>

      {/* SECTION 3 - Recent Scans */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">
          Recent Scans / हालिया जाँच
        </h3>
        <Link
          to="/history"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          See All / सभी देखें <i className="ri-arrow-right-s-line text-sm"></i>
        </Link>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 bg-gray-100 animate-pulse rounded-2xl border border-gray-200" />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && scans.length === 0 && (
        <div className="text-center py-6 text-sm text-gray-500 font-medium bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          No scans yet / कोई जाँच नहीं
        </div>
      )}

      {/* DYNAMIC SCANS FEED */}
      {!loading && scans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {scans.map((scan) => {
            const imgUrl = getImageUrl(scan);
            return (
              <Card
                key={scan.upload_id}
                onClick={() => navigate(`/result/${scan.upload_id}`)}
                className="flex items-center justify-between hover:shadow-md transition-all duration-200 cursor-pointer border border-emerald-50"
              >
                <div className="flex items-center gap-3">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt="Crop Thumbnail"
                      className="w-12 h-12 rounded-xl object-cover border border-emerald-100/50 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-2xl border border-brand-100/50 flex-shrink-0">
                      {getCropEmoji(scan.crop)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm truncate max-w-[150px]">
                      {scan.crop || "Unknown"}
                    </h4>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                      {scan.status === "uploaded"
                        ? "Analyzing..."
                        : scan.disease || (scan.status === "low_confidence" ? "Unclear Image" : "Healthy")}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {formatDate(scan.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge variant={getSeverityVariant(scan)}>
                    {getSeverityLabel(scan)}
                  </Badge>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
};

export default DashboardPage;
