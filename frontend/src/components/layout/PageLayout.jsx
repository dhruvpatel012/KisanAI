import { useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";

const PageLayout = ({
  children,
  title,
  showBack = false,
  headerRight,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-cream flex flex-col pb-20">
      {/* Header */}
      {title && (
        <header className="sticky top-0 w-full h-[60px] bg-white border-b border-gray-100 flex items-center justify-center px-4 z-40">
          <div className="w-full max-w-6xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              {showBack && (
                <button
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 active:scale-95 transition-all text-gray-600"
                >
                  <i className="ri-arrow-left-line text-xl"></i>
                </button>
              )}
              <h1 className="text-lg font-bold text-gray-900">
                {title}
              </h1>
            </div>
            {headerRight && (
              <div className="flex items-center">
                {headerRight}
              </div>
            )}
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main 
        className="flex-1 w-full max-w-6xl mx-auto p-4 overflow-y-auto"
        style={{ paddingBottom: "calc(var(--bottom-nav-height) + 48px)" }}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default PageLayout;
