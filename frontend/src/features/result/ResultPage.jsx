import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const ResultPage = () => {
  const { uploadId } = useParams();
  const navigate = useNavigate();

  return (
    <PageLayout title="Analysis Result / विश्लेषण परिणाम" showBack={true}>
      <Card className="max-w-md mx-auto text-center p-8 flex flex-col items-center gap-6">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm animate-bounce" style={{ animationDuration: "3s" }}>
          <svg
            className="w-10 h-10 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Heading */}
        <div>
          <h2 className="text-2xl font-extrabold text-emerald-950">
            Analysis Complete / विश्लेषण पूर्ण हुआ
          </h2>
          <p className="text-sm text-emerald-700/80 mt-1">
            Disease detected successfully / बीमारी का सफलतापूर्वक पता लगाया गया
          </p>
        </div>

        {/* Reference details */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 w-full text-left font-mono text-xs text-emerald-800">
          <span className="font-bold">Scan ID:</span> {uploadId}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full mt-4">
          <Button
            variant="primary"
            disabled={true}
            fullWidth
            className="opacity-50 cursor-not-allowed font-bold"
          >
            View Full Result / पूरा परिणाम देखें
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate("/scan")}
            fullWidth
            className="font-bold border-emerald-200 hover:bg-emerald-50 text-emerald-700"
          >
            Scan Another Crop / एक और फसल की जांच करें
          </Button>
        </div>
      </Card>
    </PageLayout>
  );
};

export default ResultPage;
