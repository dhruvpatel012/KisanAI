import PageLayout from "../../components/layout/PageLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const ScanPage = () => {
  const tips = [
    {
      en: "Good lighting, avoid shadows",
      hi: "अच्छी रोशनी, छाया से बचें",
    },
    {
      en: "Focus on affected leaf only",
      hi: "केवल प्रभावित पत्ती पर ध्यान दें",
    },
    {
      en: "Keep phone camera steady",
      hi: "फोन कैमरा स्थिर रखें",
    },
    {
      en: "Include healthy and sick areas",
      hi: "स्वस्थ और बीमार दोनों हिस्सों को शामिल करें",
    },
  ];

  return (
    <PageLayout title="Scan Crop / फसल जाँच">
      {/* UPLOAD CARD */}
      <Card className="mb-6 flex flex-col items-center text-center p-6">
        {/* Dashed green border box 96px */}
        <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-brand-400 bg-brand-50 flex items-center justify-center mb-4">
          <i className="ri-camera-lens-line text-4xl text-brand-600"></i>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Take a Photo / फोटो लें
        </h2>
        <p className="text-sm text-gray-500 mb-6 max-w-[280px]">
          Position the affected crop leaf clearly inside the camera frame.
          / फसल की पत्ती को कैमरे के सामने रखें।
        </p>

        <div className="w-full flex flex-col gap-3">
          <Button
            variant="primary"
            className="font-bold py-3"
            onClick={() => {}}
          >
            <i className="ri-camera-fill text-lg"></i>
            Open Camera / कैमरा खोलें
          </Button>

          <div className="flex items-center justify-between w-full my-1">
            <span className="h-[1px] bg-gray-200 flex-1"></span>
            <span className="text-xs text-gray-400 px-3 uppercase tracking-wider font-semibold">
              OR / या
            </span>
            <span className="h-[1px] bg-gray-200 flex-1"></span>
          </div>

          <Button
            variant="secondary"
            className="font-bold py-3"
            onClick={() => {}}
          >
            <i className="ri-image-add-fill text-lg"></i>
            Upload from Gallery / गैलरी से चुनें
          </Button>
        </div>
      </Card>

      {/* TIPS CARD */}
      <Card className="mb-2 p-5 bg-white border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
          <i className="ri-pushpin-2-fill text-brand-600 text-lg"></i>
          Tips for Accurate Scan / सही जाँच के सुझाव
        </h3>

        <ul className="flex flex-col gap-3.5">
          {tips.map((tip, index) => (
            <li key={index} className="flex gap-3">
              <i className="ri-checkbox-circle-fill text-brand-600 text-lg mt-0.5 shrink-0"></i>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {tip.en}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {tip.hi}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </PageLayout>
  );
};

export default ScanPage;
