import { useState, useEffect, useRef } from "react";
import PageLayout from "../../components/layout/PageLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { logoutUser } from "../auth/authService";
import api from "../../lib/axios";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { UserCircle, Settings, ShieldCheck, KeyRound, Globe, LogOut, User, MapPin, X } from "lucide-react";

const ProfilePage = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const avatarInputRef = useRef(null);
  
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    preferred_language: "en",
    farm_location: "",
    avatar_url: ""
  });
  const [scanCount, setScanCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Password change states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/me");
      setProfile({
        full_name: response.data.full_name || "",
        email: response.data.email || "",
        preferred_language: response.data.preferred_language || "en",
        farm_location: response.data.farm_location || "",
        avatar_url: response.data.avatar_url || ""
      });
      const scansResponse = await api.get("/api/scans");
      setScanCount(scansResponse.data.length);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setProfileError(t("Could not retrieve profile information.", "प्रोफ़ाइल जानकारी पुनर्प्राप्त नहीं की जा सकी।"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update backend profile settings
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveSuccess(false);
      setProfileError(null);
      const response = await api.put("/auth/profile", {
        full_name: profile.full_name,
        preferred_language: profile.preferred_language,
        farm_location: profile.farm_location,
        avatar_url: profile.avatar_url
      });
      setProfile({
        full_name: response.data.full_name,
        email: response.data.email,
        preferred_language: response.data.preferred_language,
        farm_location: response.data.farm_location,
        avatar_url: response.data.avatar_url || ""
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setProfileError(err.response?.data?.detail || t("Failed to update profile.", "प्रोफ़ाइल अपडेट करने में विफल।"));
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    setProfileError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        // Target dimensions for profile avatar
        const targetWidth = 200;
        const targetHeight = 200;
        
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setProfileError(t("Failed to process image.", "छवि संसाधित करने में विफल।"));
          setSaving(false);
          return;
        }

        // Draw crop-centered image onto square canvas
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, targetWidth, targetHeight);
        
        // Export to low-overhead compressed Base64 JPEG
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
        
        // Update local state
        setProfile(prev => ({ ...prev, avatar_url: compressedBase64 }));
        
        // Save directly to the backend
        try {
          const response = await api.put("/auth/profile", {
            full_name: profile.full_name,
            preferred_language: profile.preferred_language,
            farm_location: profile.farm_location,
            avatar_url: compressedBase64
          });
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
        } catch (err) {
          console.error("Failed to upload avatar:", err);
          setProfileError(t("Failed to update profile picture.", "प्रोफ़ाइल चित्र अपडेट करने में विफल।"));
        } finally {
          setSaving(false);
        }
      };
      
      img.onerror = () => {
        setProfileError(t("Invalid image file.", "अमान्य छवि फ़ाइल।"));
        setSaving(false);
      };
      
      img.src = event.target.result;
    };
    
    reader.onerror = () => {
      setProfileError(t("Failed to read file.", "फ़ाइल पढ़ने में विफल।"));
      setSaving(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleLanguageChange = (lang) => {
    setProfile((prev) => ({ ...prev, preferred_language: lang }));
    setLanguage(lang); // Sync global context
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setPasswordError(t("Both password fields are required.", "दोनों पासवर्ड फ़ील्ड आवश्यक हैं।"));
      return;
    }
    try {
      setPasswordLoading(true);
      setPasswordSuccess(false);
      setPasswordError(null);
      await api.put("/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword
      });
      setPasswordSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setTimeout(() => {
        setPasswordSuccess(false);
        setShowPasswordModal(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to change password:", err);
      setPasswordError(err.response?.data?.detail || t("Incorrect old password.", "गलत वर्तमान पासवर्ड।"));
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <PageLayout title={t("Profile", "प्रोफाइल")}>
      <div className="max-w-md mx-auto flex flex-col gap-4 p-4 pb-20">
        
        {/* LOADING SHIMMER */}
        {loading && (
          <div className="flex flex-col gap-3">
            <div className="h-28 bg-gray-100 animate-pulse rounded-2xl border border-gray-200" />
            <div className="h-64 bg-gray-100 animate-pulse rounded-2xl border border-gray-200" />
          </div>
        )}

        {/* PROFILE CARD */}
        {!loading && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={avatarInputRef}
              onChange={handleAvatarChange}
              className="hidden"
            />
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-5 flex items-center gap-4">
              <div 
                className="relative shrink-0 cursor-pointer group active:scale-95 transition-transform" 
                onClick={() => avatarInputRef.current?.click()}
                title={t("Upload Profile Photo", "प्रोफ़ाइल फ़ोटो अपलोड करें")}
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center overflow-hidden border border-white/30">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle size={40} className="text-white" />
                  )}
                </div>
                {/* Plus Icon Overlay */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center shadow-md group-hover:bg-green-600 transition-colors">
                  <span className="text-white text-xs font-black leading-none">+</span>
                </div>
              </div>
              <div className="overflow-hidden">
                <h2 className="text-xl font-bold text-white truncate leading-tight">
                  {profile.full_name || "Kisan Farmer"}
                </h2>
                <p className="text-sm text-green-200 truncate mt-0.5">
                  {profile.email}
                </p>
                <div className="inline-flex mt-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {t(`${scanCount} Scans`, `${scanCount} जाँचें`)}
                </div>
              </div>
            </div>

            {/* EDIT PROFILE INPUTS */}
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-3">
              <div className="bg-white dark:bg-gray-900/60 rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                <h3 className="text-sm font-black text-emerald-950 dark:text-emerald-200 flex items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                  <Settings size={16} className="text-green-600 dark:text-green-400 mr-2" />
                  {t("Edit Profile Settings", "प्रोफ़ाइल संपादित करें")}
                </h3>

                {saveSuccess && (
                  <Alert
                    message={t("Profile updated successfully!", "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!")}
                    type="success"
                  />
                )}
                {profileError && <Alert message={profileError} type="error" />}

                {/* Name field */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {t("Full Name", "पूरा नाम")}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-gray-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl pl-10 pr-4 py-3 text-sm w-full focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                    />
                  </div>
                </div>

                {/* Farm Location field */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {t("Farm Location / State", "खेत का स्थान / क्षेत्र")}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-gray-400">
                      <MapPin size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Punjab, Gujarat"
                      value={profile.farm_location}
                      onChange={(e) => setProfile({ ...profile, farm_location: e.target.value })}
                      className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl pl-10 pr-4 py-3 text-sm w-full focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                    />
                  </div>
                </div>

                {/* Language Select */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center">
                    <Globe size={16} className="text-gray-600 dark:text-gray-400 mr-2" />
                    {t("App Language", "ऐप की भाषा")}
                  </label>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => handleLanguageChange("en")}
                      className={`py-2 flex-1 rounded-lg font-semibold text-sm transition-all duration-150 ${
                        profile.preferred_language === "en"
                          ? "bg-white dark:bg-gray-700 text-green-700 dark:text-green-300 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLanguageChange("hi")}
                      className={`py-2 flex-1 rounded-lg font-semibold text-sm transition-all duration-150 ${
                        profile.preferred_language === "hi"
                          ? "bg-white dark:bg-gray-700 text-green-700 dark:text-green-300 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      हिंदी
                    </button>
                  </div>
                </div>

                {/* Dark Mode Toggle */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {t("Theme", "थीम")}
                  </label>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => isDark && toggleTheme()}
                      className={`py-2 flex-1 rounded-lg font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-1.5 ${
                        !isDark
                          ? "bg-white dark:bg-gray-700 text-amber-600 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <i className="ri-sun-line"></i> {t("Light", "लाइट")}
                    </button>
                    <button
                      type="button"
                      onClick={() => !isDark && toggleTheme()}
                      className={`py-2 flex-1 rounded-lg font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-1.5 ${
                        isDark
                          ? "bg-white dark:bg-gray-700 text-indigo-500 shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <i className="ri-moon-line"></i> {t("Dark", "डार्क")}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-3 rounded-xl w-full shadow-md shadow-green-500/20 active:scale-98 transition-all"
                >
                  {saving ? t("Saving...", "सहेज रहा है...") : t("Save Preferences", "सहेजें")}
                </button>
              </div>
            </form>

            {/* SECURITY MANAGEMENT */}
            <div className="bg-white dark:bg-gray-900/60 rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-gray-800 flex flex-col gap-3">
              <h3 className="text-sm font-black text-emerald-950 dark:text-emerald-200 flex items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <ShieldCheck size={16} className="text-green-600 dark:text-green-400 mr-2" />
                {t("Security", "सुरक्षा")}
              </h3>
              <button
                onClick={() => {
                  setPasswordError(null);
                  setPasswordSuccess(false);
                  setShowPasswordModal(true);
                }}
                className="border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-500 font-semibold py-3 rounded-xl w-full hover:bg-green-50 dark:hover:bg-gray-800/40 transition-colors flex items-center justify-center"
              >
                <KeyRound size={16} className="text-green-600 dark:text-green-400 mr-2" />
                {t("Change Password", "पासवर्ड बदलें")}
              </button>
            </div>
          </>
        )}

        {/* LOGOUT */}
        <div className="mt-2">
          <button
            onClick={logoutUser}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 rounded-xl w-full shadow-md shadow-red-500/20 active:scale-98 transition-all flex items-center justify-center"
          >
            <LogOut size={16} className="text-white mr-2" />
            <span>{t("Sign Out", "लॉग आउट करें")}</span>
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-6 font-medium">
            KisanAI v1.1.0 • Made for farmers 🌱
          </p>
        </div>

        {/* CHANGE PASSWORD MODAL OVERLAY */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 z-[60] flex items-end justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md p-6 pb-8 mb-4 max-h-[85vh] overflow-y-auto shadow-2xl relative animate-in slide-in-from-bottom duration-250">
              
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-black text-emerald-950 dark:text-emerald-200">
                  {t("Change Password", "पासवर्ड बदलें")}
                </h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                {passwordSuccess && (
                  <Alert
                    message={t("Password updated successfully!", "पासवर्ड सफलतापूर्वक बदला गया!")}
                    type="success"
                  />
                )}
                {passwordError && <Alert message={passwordError} type="error" />}

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {t("Current Password", "वर्तमान पासवर्ड")}
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500 text-xs font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {t("New Password", "नया पासवर्ड")}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-brand-500 text-xs font-semibold"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    fullWidth
                  >
                    {t("Cancel", "रद्द करें")}
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    loading={passwordLoading}
                    fullWidth
                  >
                    {t("Update", "अपडेट करें")}
                  </Button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </PageLayout>
  );
};

export default ProfilePage;
