import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/common/Navbar";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaUserGraduate,
  FaCheckCircle,
} from "react-icons/fa";
import { Sparkles } from "lucide-react";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [forgotStep, setForgotStep] = useState(null); // null | 'email' | 'otp' | 'reset' | 'success'

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [forgotData, setForgotData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
    resetToken: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login } = useAuth();
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.trim().length < 3) error = "Name must be at least 3 characters";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Please enter a valid email";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 6) error = "Password must be at least 6 characters";
        break;
      case "role":
        if (!value) error = "Please select a role";
        break;
      default:
        break;
    }
    return error;
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    login(formData, setFormData);
  };

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ name: true, email: true, password: true, role: true });
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        alert("Registration successful! Please sign in.");
        setIsSignup(false);
        setFormData({ name: "", email: "", password: "", role: "" });
      } else {
        alert(data.message || "Sign up failed");
      }
    } catch {
      alert("Error during signup. Please try again.");
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotData.email) {
      setForgotError("Email is required");
      return;
    }
    setForgotLoading(true);
    setForgotError("");

    try {
      const res = await fetch(`${backendUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotData.email }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotStep("otp");
      } else {
        setForgotError(data.message || "Failed to send OTP");
      }
    } catch {
      setForgotError("Network error. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!forgotData.otp || forgotData.otp.length < 6) {
      setForgotError("Enter 6-digit OTP code");
      return;
    }
    setForgotLoading(true);
    setForgotError("");

    try {
      const res = await fetch(`${backendUrl}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotData.email, otp: forgotData.otp }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotData((prev) => ({ ...prev, resetToken: data.resetToken }));
        setForgotStep("reset");
      } else {
        setForgotError(data.message || "Invalid OTP code");
      }
    } catch {
      setForgotError("Network error. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotData.newPassword || forgotData.newPassword.length < 6) {
      setForgotError("Password must be at least 6 characters");
      return;
    }
    if (forgotData.newPassword !== forgotData.confirmPassword) {
      setForgotError("Passwords do not match");
      return;
    }
    setForgotLoading(true);
    setForgotError("");

    try {
      const res = await fetch(`${backendUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotData.email,
          resetToken: forgotData.resetToken,
          newPassword: forgotData.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotStep("success");
      } else {
        setForgotError(data.message || "Failed to reset password");
      }
    } catch {
      setForgotError("Network error. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const resetForgotState = () => {
    setForgotStep(null);
    setForgotError("");
    setForgotData({ email: "", otp: "", newPassword: "", confirmPassword: "", resetToken: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            {forgotStep ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {forgotStep === "email" && "Reset Password"}
                    {forgotStep === "otp" && "Verify Code"}
                    {forgotStep === "reset" && "New Password"}
                    {forgotStep === "success" && "Password Reset!"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {forgotStep === "email" && "Enter your registered email to receive an OTP code"}
                    {forgotStep === "otp" && `Enter the 6-digit verification code sent to ${forgotData.email}`}
                    {forgotStep === "reset" && "Set a strong new password for your account"}
                    {forgotStep === "success" && "Your password has been changed successfully. You can now login."}
                  </p>
                </div>

                {forgotError && (
                  <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200/60">
                    {forgotError}
                  </div>
                )}

                {forgotStep === "email" && (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Email Address</label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          type="email"
                          required
                          value={forgotData.email}
                          onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-sm transition-all disabled:opacity-50"
                    >
                      {forgotLoading ? "Sending OTP..." : "Send Verification Code"}
                    </button>
                  </form>
                )}

                {forgotStep === "otp" && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">6-Digit Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={forgotData.otp}
                        onChange={(e) => setForgotData({ ...forgotData, otp: e.target.value.replace(/\D/g, "") })}
                        placeholder="123456"
                        className="w-full text-center tracking-widest text-lg font-bold py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-sm transition-all disabled:opacity-50"
                    >
                      {forgotLoading ? "Verifying..." : "Verify Code"}
                    </button>
                  </form>
                )}

                {forgotStep === "reset" && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">New Password</label>
                      <div className="relative">
                        <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          type="password"
                          required
                          value={forgotData.newPassword}
                          onChange={(e) => setForgotData({ ...forgotData, newPassword: e.target.value })}
                          placeholder="••••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                      <div className="relative">
                        <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                          type="password"
                          required
                          value={forgotData.confirmPassword}
                          onChange={(e) => setForgotData({ ...forgotData, confirmPassword: e.target.value })}
                          placeholder="••••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-sm transition-all disabled:opacity-50"
                    >
                      {forgotLoading ? "Updating..." : "Reset Password"}
                    </button>
                  </form>
                )}

                {forgotStep === "success" && (
                  <div className="text-center space-y-4 py-4">
                    <FaCheckCircle className="text-teal-600 text-5xl mx-auto" />
                    <button
                      onClick={resetForgotState}
                      className="w-full py-3 rounded-xl text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-700 shadow-sm transition-all"
                    >
                      Proceed to Sign In
                    </button>
                  </div>
                )}

                <div className="text-center pt-2">
                  <button
                    onClick={resetForgotState}
                    className="text-xs font-semibold text-cyan-600 hover:text-cyan-700"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </div>
            ) : !isSignup ? (
              <form onSubmit={handleSubmitLogin} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Sign in to access your courses, assignments, and dashboard
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleOnChange}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">Password</label>
                      <button
                        type="button"
                        onClick={() => setForgotStep("email")}
                        className="text-xs font-semibold text-cyan-600 hover:text-cyan-700"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleOnChange}
                        placeholder="••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-md shadow-cyan-600/20 transition-all active:scale-[0.99]"
                >
                  Sign In
                </button>

                {/* Quick Fill Credentials for Admin & SuperAdmin */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Quick Login Demo Accounts</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, email: "superadmin@lms.com", password: "superadmin123" })}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                    >
                      👑 SuperAdmin
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, email: "admin@lms.com", password: "admin123" })}
                      className="px-2.5 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-900 font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                    >
                      🛡️ Admin
                    </button>
                  </div>
                </div>

                <p className="text-center text-xs text-slate-500 pt-2">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignup(true);
                      setErrors({});
                    }}
                    className="font-bold text-cyan-600 hover:text-cyan-700"
                  >
                    Sign Up
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSubmitSignUp} className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Create an Account</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Join SeekhoBharat and kickstart your learning journey
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleOnChange}
                        onBlur={handleBlur}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                      />
                    </div>
                    {errors.name && touched.name && (
                      <p className="text-[11px] font-medium text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleOnChange}
                        onBlur={handleBlur}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-[11px] font-medium text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <div className="relative">
                      <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleOnChange}
                        onBlur={handleBlur}
                        placeholder="••••••••••"
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                      />
                    </div>
                    {errors.password && touched.password && (
                      <p className="text-[11px] font-medium text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Select Role</label>
                    <div className="relative">
                      <FaUserGraduate className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <select
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleOnChange}
                        onBlur={handleBlur}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                      >
                        <option value="">Choose role...</option>
                        <option value="Student">Student</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    {errors.role && touched.role && (
                      <p className="text-[11px] font-medium text-red-600">{errors.role}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-md shadow-cyan-600/20 transition-all active:scale-[0.99] mt-2"
                >
                  Create Account
                </button>

                <p className="text-center text-xs text-slate-500 pt-2">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignup(false);
                      setErrors({});
                    }}
                    className="font-bold text-cyan-600 hover:text-cyan-700"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Learn Without Limits</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                {isSignup ? "Join India's Top Learning Community" : "Welcome Back to SeekhoBharat"}
              </h3>
              <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed">
                Access over 500+ curated courses, track your learning streak, complete assignments, and earn verified certificates.
              </p>
            </div>

            <div className="space-y-3 py-8 relative z-10">
              <div className="flex items-center gap-3 text-xs text-cyan-100">
                <FaCheckCircle className="text-teal-400 shrink-0" />
                <span>Verified industry instructors</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-cyan-100">
                <FaCheckCircle className="text-teal-400 shrink-0" />
                <span>Structured video lectures & notes</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-cyan-100">
                <FaCheckCircle className="text-teal-400 shrink-0" />
                <span>Interactive quizzes & assignments</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/20 relative z-10">
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setForgotStep(null);
                  setErrors({});
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-xs transition-all"
              >
                {isSignup ? "Sign In Instead" : "Create New Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
