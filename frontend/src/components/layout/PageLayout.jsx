import { useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";
import { ChevronLeft } from "lucide-react";

const PageLayout = ({
  children,
  title,
  showBack = false,
  headerRight,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-cream dark:bg-[#0c0f0a] flex flex-col pb-20 transition-colors duration-300">
      {/* Header */}
      {title && (
        <header className="sticky top-0 w-full h-[60px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-center px-4 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
          <div className="w-full max-w-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              {showBack && (
                <button
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all text-gray-600 dark:text-gray-300"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
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
        className="flex-1 w-full max-w-md mx-auto p-4 overflow-y-auto"
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
