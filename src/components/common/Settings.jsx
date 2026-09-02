import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle, FaShieldAlt } from "react-icons/fa";

const Settings = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const clearAlert = () => setAlert({ type: "", message: "" });

  const resetForm = () => {
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setFieldErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });
    clearAlert();
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return "";
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;

    if (score <= 1) return "weak";
    if (score === 2) return "fair";
    if (score === 3) return "good";
    return "strong";
  };

  const getStrengthBadge = (strength) => {
    switch (strength) {
      case "weak":
        return { label: "Weak", color: "bg-red-500", text: "text-red-600", width: "w-1/4" };
      case "fair":
        return { label: "Fair", color: "bg-orange-500", text: "text-orange-600", width: "w-2/4" };
      case "good":
        return { label: "Good", color: "bg-amber-500", text: "text-amber-600", width: "w-3/4" };
      case "strong":
        return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-600", width: "w-full" };
      default:
        return { label: "", color: "bg-slate-200", text: "", width: "w-0" };
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.currentPassword) {
      errors.currentPassword = "Current password is required.";
      isValid = false;
    }

    if (!formData.newPassword) {
      errors.newPassword = "New password is required.";
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      clearAlert();

      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAlert({ type: "success", message: "Password changed successfully!" });
        resetForm();
      } else {
        setAlert({ type: "error", message: data.message || "Failed to change password." });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setAlert({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const strength = getPasswordStrength(formData.newPassword);
  const badge = getStrengthBadge(strength);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your security, password, and preferences
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center text-lg">
            <FaShieldAlt />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
            <p className="text-xs text-slate-500">
              Ensure your account is using a long, random password to stay secure
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {alert.message && (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
                alert.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                  : "bg-red-50 text-red-800 border border-red-200/60"
              }`}
            >
              {alert.type === "success" ? (
                <FaCheckCircle className="text-emerald-500 text-lg shrink-0" />
              ) : (
                <FaExclamationCircle className="text-red-500 text-lg shrink-0" />
              )}
              <span>{alert.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {fieldErrors.currentPassword && (
                <p className="text-xs font-medium text-red-600">{fieldErrors.currentPassword}</p>
              )}
            </div>

            <div className="border-t border-slate-100 pt-2"></div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {fieldErrors.newPassword && (
                <p className="text-xs font-medium text-red-600">{fieldErrors.newPassword}</p>
              )}

              {formData.newPassword && (
                <div className="pt-2 space-y-1.5">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${badge.color} ${badge.width} transition-all duration-300`}></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Password Strength:</span>
                    <span className={`font-semibold ${badge.text}`}>{badge.label}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-xs font-medium text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-sm transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
