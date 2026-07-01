import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const BottomNav = () => {
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full h-16 bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-50 flex justify-center">
      <div className="w-full max-w-6xl h-full flex items-center justify-around px-2">
        
        {/* HOME LINK */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-[11px] font-bold transition-transform duration-200 active:scale-110 ${
              isActive ? "text-green-700" : "text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <div className={`flex flex-col items-center justify-center px-3.5 py-1 rounded-xl transition-all duration-200 ${
              isActive ? "bg-green-50" : ""
            }`}>
              <i className={`text-xl mb-0.5 ${isActive ? "ri-home-5-fill" : "ri-home-5-line"}`}></i>
              <span>{t("Home", "होम")}</span>
            </div>
          )}
        </NavLink>

        {/* ADVISORY LINK */}
        <NavLink
          to="/advisory"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-[11px] font-bold transition-transform duration-200 active:scale-110 ${
              isActive ? "text-green-700" : "text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <div className={`flex flex-col items-center justify-center px-3.5 py-1 rounded-xl transition-all duration-200 ${
              isActive ? "bg-green-50" : ""
            }`}>
              <i className={`text-xl mb-0.5 ${isActive ? "ri-book-open-fill" : "ri-book-open-line"}`}></i>
              <span>{t("Advisory", "सलाह")}</span>
            </div>
          )}
        </NavLink>

        {/* SCAN LINK (CENTER BUTTON) */}
        <NavLink
          to="/scan"
          className="flex flex-col items-center justify-center flex-1 h-full relative transition-transform duration-200 active:scale-110"
        >
          {({ isActive }) => (
            <div
              className={`
                w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-2xl
                flex items-center justify-center shadow-lg shadow-green-500/40
                transition-all duration-200 ring-4 ring-green-100
                absolute -top-5
              `}
            >
              <i className="ri-camera-fill text-2xl animate-[pulse_2s_infinite]"></i>
            </div>
          )}
        </NavLink>

        {/* HISTORY LINK */}
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-[11px] font-bold transition-transform duration-200 active:scale-110 ${
              isActive ? "text-green-700" : "text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <div className={`flex flex-col items-center justify-center px-3.5 py-1 rounded-xl transition-all duration-200 ${
              isActive ? "bg-green-50" : ""
            }`}>
              <i className={`text-xl mb-0.5 ${isActive ? "ri-history-fill" : "ri-history-line"}`}></i>
              <span>{t("History", "इतिहास")}</span>
            </div>
          )}
        </NavLink>

        {/* PROFILE LINK */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-[11px] font-bold transition-transform duration-200 active:scale-110 ${
              isActive ? "text-green-700" : "text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <div className={`flex flex-col items-center justify-center px-3.5 py-1 rounded-xl transition-all duration-200 ${
              isActive ? "bg-green-50" : ""
            }`}>
              <i className={`text-xl mb-0.5 ${isActive ? "ri-user-3-fill" : "ri-user-3-line"}`}></i>
              <span>{t("Profile", "प्रोफाइल")}</span>
            </div>
          )}
        </NavLink>
        
      </div>
    </nav>
  );
};

export default BottomNav;

