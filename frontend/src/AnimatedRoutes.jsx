import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import DashboardPage from "./features/dashboard/DashboardPage";
import ScanPage from "./features/scan/ScanPage";
import HistoryPage from "./features/history/HistoryPage";
import ProfilePage from "./features/profile/ProfilePage";
import ResultPage from "./features/result/ResultPage";
import AdvisoryPage from "./features/advisory/AdvisoryPage";
import ProtectedRoute from "./routes/ProtectedRoute";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.25,
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth routes */}
        <Route path="/login" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <LoginPage />
          </motion.div>
        } />
        <Route path="/register" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <RegisterPage />
          </motion.div>
        } />
        
        {/* Core app routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <DashboardPage />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/scan" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <ScanPage />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/result/:uploadId" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <ResultPage />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <HistoryPage />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/advisory" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <AdvisoryPage />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
              <ProfilePage />
            </motion.div>
          </ProtectedRoute>
        } />

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
