import React, { useState, useEffect } from "react";
import PageLayout from "../../components/layout/PageLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import api from "../../lib/axios";
import { useLanguage } from "../../context/LanguageContext";

const AdvisoryPage = () => {
  const { t } = useLanguage();
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [activeAdvisory, setActiveAdvisory] = useState(null);

  const fetchAdvisories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/advisory");
      setAdvisories(response.data);
    } catch (err) {
      console.error("Failed to load advisories:", err);
      setError(t("Failed to load advisory documents. Please try again.", "सलाह दस्तावेज लोड करने में विफल।"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisories();
  }, []);

  const getCropEmoji = (cropId) => {
    switch (cropId) {
      case "tomato": return "🍅";
      case "potato": return "🥔";
      case "wheat": return "🌾";
      default: return "🌱";
    }
  };

  // Filter advisories based on search & chips
  const filteredAdvisories = advisories.filter((advisory) => {
    const matchesChip = selectedCrop === "all" || advisory.crop_id === selectedCrop;
    const matchesSearch =
      advisory.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      advisory.crop_name_hi.includes(searchQuery) ||
      advisory.soil_prep.toLowerCase().includes(searchQuery.toLowerCase()) ||
      advisory.pest_management.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChip && matchesSearch;
  });

  return (
    <PageLayout title={t("Crop Advisory", "फसल सलाह")}>
        {/* SEARCH BAR */}
        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
          <i className="ri-search-line text-gray-400 text-lg"></i>
          <input
            type="text"
            placeholder={t("Search crop or disease...", "खोजें...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-sm bg-transparent placeholder-gray-400"
          />
        </div>

        {/* CROP CHIPS */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "all", label: t("All", "सभी") },
            { id: "tomato", label: t("Tomato", "टमाटर") },
            { id: "potato", label: t("Potato", "आलू") },
            { id: "wheat", label: t("Wheat", "गेहूं") },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setSelectedCrop(chip.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer
                ${selectedCrop === chip.id
                  ? "bg-green-600 text-white shadow-md shadow-green-500/20 border-transparent"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }
              `}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-28 bg-gray-100 animate-pulse rounded-2xl border border-gray-200" />
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="flex flex-col gap-4">
            <Alert message={error} type="error" />
            <Button variant="primary" onClick={fetchAdvisories} fullWidth>
              {t("Retry", "पुनः प्रयास करें")}
            </Button>
          </div>
        )}

        {/* CARDS LIST */}
        {!loading && !error && (
          <div className="flex flex-col gap-3">
            {filteredAdvisories.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500 font-medium">
                {t("No advisory found", "कोई सलाह नहीं मिली")}
              </div>
            ) : (
              filteredAdvisories.map((advisory) => (
                <div
                  key={advisory.crop_id}
                  onClick={() => setActiveAdvisory(advisory)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 active:scale-[0.99] transition-all cursor-pointer hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-2xl flex-shrink-0">
                    {getCropEmoji(advisory.crop_id)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">
                      {t(advisory.crop_name, advisory.crop_name_hi)}
                    </h4>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                      {t(advisory.soil_prep, advisory.soil_prep_hi)}
                    </p>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-300 ml-auto text-lg flex-shrink-0"></i>
                </div>
              ))
            )}
          </div>
        )}

        {/* ARTICLE DETAIL MODAL */}
        {activeAdvisory && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setActiveAdvisory(null)}>
            <div 
              className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl z-50 p-5 pb-8 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-250"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar at top */}
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{getCropEmoji(activeAdvisory.crop_id)}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {t(activeAdvisory.crop_name, activeAdvisory.crop_name_hi)}
                    </h3>
                    <p className="text-xs text-green-600 font-bold">
                      {t("Agronomy Manual", "फसल विवरण")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveAdvisory(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Guide Contents */}
              <div className="flex flex-col gap-5">
                
                {/* Soil Preparation */}
                <div>
                  <h4 className="text-xs font-bold tracking-widest text-green-600 uppercase mb-2">
                    {t("🌱 Soil Preparation", "🌱 मिट्टी की तैयारी")}
                  </h4>
                  <div className="bg-green-50 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">
                    {t(activeAdvisory.soil_prep, activeAdvisory.soil_prep_hi)}
                  </div>
                </div>

                {/* Planting Time */}
                <div>
                  <h4 className="text-xs font-bold tracking-widest text-green-600 uppercase mb-2">
                    {t("📅 Planting Season", "📅 बोने का समय")}
                  </h4>
                  <div className="bg-green-50 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">
                    {t(activeAdvisory.planting_time, activeAdvisory.planting_time_hi)}
                  </div>
                </div>

                {/* Pest & Disease Prevention */}
                <div>
                  <h4 className="text-xs font-bold tracking-widest text-green-600 uppercase mb-2">
                    {t("🛡️ Organic Pest Control", "🛡️ कीट और रोग नियंत्रण")}
                  </h4>
                  <div className="bg-green-50 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">
                    {t(activeAdvisory.pest_management, activeAdvisory.pest_management_hi)}
                  </div>
                </div>

                {/* Irrigation */}
                <div>
                  <h4 className="text-xs font-bold tracking-widest text-green-600 uppercase mb-2">
                    {t("💧 Irrigation", "💧 सिंचाई नियम")}
                  </h4>
                  <div className="bg-green-50 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">
                    {t(activeAdvisory.irrigation, activeAdvisory.irrigation_hi)}
                  </div>
                </div>

              </div>

              <div className="mt-6 pt-2">
                <button
                  onClick={() => setActiveAdvisory(null)}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl shadow-md shadow-green-500/20 active:scale-98 transition-all"
                >
                  {t("Dismiss", "बंद करें")}
                </button>
              </div>

            </div>
          </div>
        )}

    </PageLayout>
  );
};

export default AdvisoryPage;
