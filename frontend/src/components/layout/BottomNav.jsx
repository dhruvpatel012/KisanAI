import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const BottomNav = () => {
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-50">
      <div className="max-w-md mx-auto h-16 flex items-center justify-around px-2">
        
        {/* HOME LINK */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 flex-1 py-2 rounded-xl transition-colors duration-150 min-h-[44px] justify-center ${
              isActive ? "text-green-600 bg-green-50" : "text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <i className={`text-xl ${isActive ? "ri-home-5-fill" : "ri-home-5-line"}`}></i>
              <span className="text-[10px] font-semibold">{t("Home", "होम")}</span>
            </>
          )}
        </NavLink>

        {/* ADVISORY LINK */}
        <NavLink
          to="/advisory"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 flex-1 py-2 rounded-xl transition-colors duration-150 min-h-[44px] justify-center ${
              isActive ? "text-green-600 bg-green-50" : "text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <i className={`text-xl ${isActive ? "ri-book-open-fill" : "ri-book-open-line"}`}></i>
              <span className="text-[10px] font-semibold">{t("Advisory", "सलाह")}</span>
            </>
          )}
        </NavLink>

        {/* SCAN LINK (CENTER BUTTON) */}
        <NavLink
          to="/scan"
          className="flex flex-col items-center justify-center flex-1 -mt-5"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center active:scale-95 transition-transform duration-150"
            style={{
              background: "linear-gradient(135deg, #22c55e, #15803d)",
              boxShadow: "0 4px 20px rgba(34,197,94,0.4)"
            }}
          >
            <i className="ri-camera-fill text-2xl text-white"></i>
          </div>
          <span className="text-[10px] font-semibold text-green-600 mt-1">
            {t("Scan", "जाँच")}
          </span>
        </NavLink>

        {/* HISTORY LINK */}
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 flex-1 py-2 rounded-xl transition-colors duration-150 min-h-[44px] justify-center ${
              isActive ? "text-green-600 bg-green-50" : "text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <i className={`text-xl ${isActive ? "ri-history-fill" : "ri-history-line"}`}></i>
              <span className="text-[10px] font-semibold">{t("History", "इतिहास")}</span>
            </>
          )}
        </NavLink>

        {/* PROFILE LINK */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 flex-1 py-2 rounded-xl transition-colors duration-150 min-h-[44px] justify-center ${
              isActive ? "text-green-600 bg-green-50" : "text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <i className={`text-xl ${isActive ? "ri-user-3-fill" : "ri-user-3-line"}`}></i>
              <span className="text-[10px] font-semibold">{t("Profile", "प्रोफाइल")}</span>
            </>
          )}
        </NavLink>
        
      </div>
    </nav>
  );
};

export default BottomNav;

