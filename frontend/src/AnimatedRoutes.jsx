import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProtectedRoute from "./routes/ProtectedRoute";

const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("./features/auth/pages/RegisterPage"));
const DashboardPage = lazy(() => import("./features/dashboard/DashboardPage"));
const ScanPage = lazy(() => import("./features/scan/ScanPage"));
const HistoryPage = lazy(() => import("./features/history/HistoryPage"));
const ProfilePage = lazy(() => import("./features/profile/ProfilePage"));
const ResultPage = lazy(() => import("./features/result/ResultPage"));
const PlantResultPage = lazy(() => import("./features/result/PlantResultPage"));
const LandResultPage = lazy(() => import("./features/result/LandResultPage"));
const AdvisoryPage = lazy(() => import("./features/advisory/AdvisoryPage"));

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
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
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
          <Route path="/plant-result/:uploadId" element={
            <ProtectedRoute>
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <PlantResultPage />
              </motion.div>
            </ProtectedRoute>
          } />
          <Route path="/land-result/:uploadId" element={
            <ProtectedRoute>
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <LandResultPage />
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
    </Suspense>
  );
};

export default AnimatedRoutes;
