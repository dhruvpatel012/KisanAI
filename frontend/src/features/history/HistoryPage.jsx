import React from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const HistoryPage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout title="Scan History / इतिहास">
      <Card className="flex flex-col items-center text-center p-8 max-w-md mx-auto">
        {/* Empty history icon */}
        <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-6">
          <i className="ri-history-line text-4xl text-gray-400"></i>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          No Scans Yet / कोई जाँच नहीं
        </h2>
        <p className="text-sm text-gray-500 mb-6 max-w-[280px]">
          Start by scanning your first crop to diagnose diseases.
          / अपनी पहली फसल की जाँच शुरू करें।
        </p>

        <Button
          variant="primary"
          onClick={() => navigate("/scan")}
          className="font-bold px-8"
        >
          Start Scan / जाँच शुरू करें
        </Button>
      </Card>
    </PageLayout>
  );
};

export default HistoryPage;
