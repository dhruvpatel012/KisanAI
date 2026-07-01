import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { Home, BookOpen, Camera, Clock, User } from "lucide-react";

const BottomNav = () => {
  const { t } = useLanguage();

  const navItemClass = ({ isActive }) =>
    `flex flex-col items-center gap-0.5 flex-1 py-2 rounded-xl transition-colors duration-150 min-h-[44px] justify-center ${
      isActive
        ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40"
        : "text-gray-400 dark:text-gray-500"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] z-50 transition-colors duration-300">
      <div className="max-w-md mx-auto h-16 flex items-center justify-around px-2">
        
        {/* HOME */}
        <NavLink to="/dashboard" className={navItemClass}>
          {({ isActive }) => (
            <>
              <Home size={20} />
              <span className="text-[10px] font-semibold">{t("Home", "होम")}</span>
            </>
          )}
        </NavLink>

        {/* ADVISORY */}
        <NavLink to="/advisory" className={navItemClass}>
          {({ isActive }) => (
            <>
              <BookOpen size={20} />
              <span className="text-[10px] font-semibold">{t("Advisory", "सलाह")}</span>
            </>
          )}
        </NavLink>

        {/* SCAN (CENTER) */}
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
            <Camera size={24} className="text-white" />
          </div>
          <span className="text-[10px] font-semibold text-green-600 dark:text-green-400 mt-1">
            {t("Scan", "जाँच")}
          </span>
        </NavLink>

        {/* HISTORY */}
        <NavLink to="/history" className={navItemClass}>
          {({ isActive }) => (
            <>
              <Clock size={20} />
              <span className="text-[10px] font-semibold">{t("History", "इतिहास")}</span>
            </>
          )}
        </NavLink>

        {/* PROFILE */}
        <NavLink to="/profile" className={navItemClass}>
          {({ isActive }) => (
            <>
              <User size={20} />
              <span className="text-[10px] font-semibold">{t("Profile", "प्रोफाइल")}</span>
            </>
          )}
        </NavLink>
        
      </div>
    </nav>
  );
};

export default BottomNav;
