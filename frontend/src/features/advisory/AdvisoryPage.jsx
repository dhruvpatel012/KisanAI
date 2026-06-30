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
      <div className="max-w-md mx-auto flex flex-col gap-4 p-4 pb-20">
        
        {/* SEARCH BAR */}
        <div className="relative">
          <input
            type="text"
            placeholder={t("Search crop or disease...", "खोजें...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-500 text-sm font-medium"
          />
          <i className="ri-search-line absolute left-3 top-3.5 text-gray-400 text-base"></i>
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
              onClick={() => setSelectedCrop(chip.id)}
              className={`
                px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-150
                ${selectedCrop === chip.id
                  ? "bg-brand-600 text-white border-brand-650 shadow-sm"
                  : "bg-gray-50 text-gray-650 border-gray-200 hover:bg-gray-100"
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
                <Card
                  key={advisory.crop_id}
                  onClick={() => setActiveAdvisory(advisory)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:shadow-md transition-all duration-200 border border-emerald-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl bg-brand-50 w-12 h-12 rounded-xl flex items-center justify-center border border-brand-100/50">
                      {getCropEmoji(advisory.crop_id)}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-emerald-950 text-sm">
                        {t(advisory.crop_name, advisory.crop_name_hi)}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 max-w-[200px]">
                        {t(advisory.soil_prep, advisory.soil_prep_hi)}
                      </p>
                    </div>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400 text-lg"></i>
                </Card>
              ))
            )}
          </div>
        )}

        {/* ARTICLE DETAIL MODAL */}
        {activeAdvisory && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 max-h-[85vh] overflow-y-auto shadow-2xl relative animate-in slide-in-from-bottom duration-250">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{getCropEmoji(activeAdvisory.crop_id)}</span>
                  <div>
                    <h3 className="text-xl font-black text-emerald-950">
                      {t(activeAdvisory.crop_name, activeAdvisory.crop_name_hi)}
                    </h3>
                    <p className="text-xs text-emerald-700 font-bold">
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
                  <h4 className="text-xs uppercase tracking-wider text-emerald-800 font-extrabold mb-1 flex items-center gap-1.5">
                    {t("🌱 Soil Preparation", "🌱 मिट्टी की तैयारी")}
                  </h4>
                  <p className="text-xs text-gray-655 font-medium leading-relaxed bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                    {t(activeAdvisory.soil_prep, activeAdvisory.soil_prep_hi)}
                  </p>
                </div>

                {/* Planting Time */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-emerald-800 font-extrabold mb-1 flex items-center gap-1.5">
                    {t("📅 Planting Season", "📅 बोने का समय")}
                  </h4>
                  <p className="text-xs text-gray-655 font-medium leading-relaxed bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                    {t(activeAdvisory.planting_time, activeAdvisory.planting_time_hi)}
                  </p>
                </div>

                {/* Pest & Disease Prevention */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-emerald-800 font-extrabold mb-1 flex items-center gap-1.5">
                    {t("🛡️ Organic Pest Control", "🛡️ कीट और रोग नियंत्रण")}
                  </h4>
                  <p className="text-xs text-gray-655 font-medium leading-relaxed bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                    {t(activeAdvisory.pest_management, activeAdvisory.pest_management_hi)}
                  </p>
                </div>

                {/* Irrigation */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-emerald-800 font-extrabold mb-1 flex items-center gap-1.5">
                    {t("💧 Irrigation", "💧 सिंचाई नियम")}
                  </h4>
                  <p className="text-xs text-gray-655 font-medium leading-relaxed bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                    {t(activeAdvisory.irrigation, activeAdvisory.irrigation_hi)}
                  </p>
                </div>

              </div>

              <div className="mt-6 pt-2">
                <Button variant="primary" onClick={() => setActiveAdvisory(null)} fullWidth>
                  {t("Dismiss", "बंद करें")}
                </Button>
              </div>

            </div>
          </div>
        )}

      </div>
    </PageLayout>
  );
};

export default AdvisoryPage;
