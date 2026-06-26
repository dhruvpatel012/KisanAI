import { useState } from "react";
import PageLayout from "../../components/layout/PageLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { logoutUser } from "../auth/authService";

const ProfilePage = () => {
  const [language, setLanguage] = useState("en");

  const menuItems = [
    {
      icon: "ri-history-line",
      en: "My Scan History",
      hi: "मेरी जाँच का इतिहास",
      path: "/history",
    },
    {
      icon: "ri-plant-line",
      en: "My Crops",
      hi: "मेरी फसलें",
      path: "/dashboard",
    },
    {
      icon: "ri-notification-3-line",
      en: "Notifications",
      hi: "सूचनाएं",
      path: "/dashboard",
    },
    {
      icon: "ri-question-line",
      en: "Help and Support",
      hi: "सहायता और संपर्क",
      path: "/dashboard",
    },
  ];

  return (
    <PageLayout title="Profile / प्रोफाइल">
      {/* GRID FOR USER & LANGUAGE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* USER CARD */}
        <Card className="flex items-center gap-4 p-5">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-3xl shadow-md shrink-0">
            👨‍🌾
          </div>
          <div className="overflow-hidden">
            <h2 className="text-lg font-bold text-gray-900 truncate">
              Dhruv Patel
            </h2>
            <p className="text-sm text-gray-500 truncate">
              testfarmer2@kisanai.com
            </p>
            <div className="mt-2 inline-flex items-center gap-1 bg-brand-50 border border-brand-100 text-[10px] font-semibold text-brand-700 px-2 py-0.5 rounded-full">
              <i className="ri-checkbox-circle-fill"></i>
              12 scans this week / इस सप्ताह 12 जाँच
            </div>
          </div>
        </Card>

        {/* LANGUAGE CARD */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
            <i className="ri-global-line text-brand-600 text-lg"></i>
            App Language / ऐप की भाषा
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLanguage("en")}
              className={`py-2.5 rounded-xl font-bold text-sm border-2 transition-all duration-150 ${
                language === "en"
                  ? "bg-brand-50 border-brand-600 text-brand-700"
                  : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`py-2.5 rounded-xl font-bold text-sm border-2 transition-all duration-150 ${
                language === "hi"
                  ? "bg-brand-50 border-brand-600 text-brand-700"
                  : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100"
              }`}
            >
              हिंदी
            </button>
          </div>
        </Card>
      </div>

      {/* MENU CARD */}
      <Card padding={false} className="mb-6 overflow-hidden">
        <div className="flex flex-col">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border-b last:border-0 border-gray-100 hover:bg-gray-50 cursor-pointer active:bg-gray-100 transition-colors duration-150"
              onClick={() => {}}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100">
                  <i className={`${item.icon} text-lg`}></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {item.en}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.hi}
                  </p>
                </div>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400 text-lg"></i>
            </div>
          ))}
        </div>
      </Card>

      {/* LOGOUT */}
      <div className="mb-4">
        <Button
          variant="danger"
          onClick={logoutUser}
          className="font-bold py-3"
        >
          <i className="ri-logout-box-r-line text-lg"></i>
          Sign Out / लॉग आउट करें
        </Button>
        <p className="text-center text-[10px] text-gray-400 mt-4">
          KisanAI v1.0.0 • Made for farmers 🌱
        </p>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
