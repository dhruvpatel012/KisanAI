import { NavLink } from "react-router-dom";

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full h-16 bg-white border-t border-gray-100 shadow-lg z-50 flex justify-center">
      <div className="w-full max-w-6xl h-full flex items-center justify-around px-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-[11px] font-medium ${
              isActive ? "text-brand-600" : "text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <i className={`text-xl mb-0.5 ${isActive ? "ri-home-5-fill" : "ri-home-5-line"}`}></i>
              <span>Home</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/advisory"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-[11px] font-medium ${
              isActive ? "text-brand-600" : "text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <i className={`text-xl mb-0.5 ${isActive ? "ri-book-open-fill" : "ri-book-open-line"}`}></i>
              <span>Advisory</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/scan"
          className="flex flex-col items-center justify-center flex-1 h-full relative"
        >
          {({ isActive }) => (
            <div
              className={`
                w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl
                flex items-center justify-center shadow-lg shadow-brand-600/40
                active:scale-95 transition-all duration-150 border-4 border-white
                absolute -top-5
                ${isActive ? "bg-brand-700 ring-2 ring-brand-600/30" : ""}
              `}
            >
              <i className="ri-camera-fill text-2xl"></i>
            </div>
          )}
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-[11px] font-medium ${
              isActive ? "text-brand-600" : "text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <i className={`text-xl mb-0.5 ${isActive ? "ri-history-fill" : "ri-history-line"}`}></i>
              <span>History</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-[11px] font-medium ${
              isActive ? "text-brand-600" : "text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <i className={`text-xl mb-0.5 ${isActive ? "ri-user-3-fill" : "ri-user-3-line"}`}></i>
              <span>Profile</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
