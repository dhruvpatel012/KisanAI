import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  const mockScans = [
    {
      id: "1",
      crop: "Tomato",
      disease: "Early Blight",
      severity: "warning",
      severityLabel: "Medium Risk",
      date: "Today",
      emoji: "🍅",
    },
    {
      id: "2",
      crop: "Wheat",
      disease: "Healthy",
      severity: "success",
      severityLabel: "Healthy",
      date: "Yesterday",
      emoji: "🌾",
    },
    {
      id: "3",
      crop: "Rice",
      disease: "Leaf Blast",
      severity: "danger",
      severityLabel: "High Risk",
      date: "2 days ago",
      emoji: "🌾",
    },
  ];

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

      <div className="flex flex-col gap-3">
        {mockScans.map((scan) => (
          <Card
            key={scan.id}
            onClick={() => navigate(`/history`)}
            className="flex items-center justify-between hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-2xl border border-brand-100/50">
                {scan.emoji}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  {scan.crop}
                </h4>
                <p className="text-xs text-gray-500">
                  {scan.disease}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {scan.date}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant={scan.severity}>
                {scan.severityLabel}
              </Badge>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </div>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
