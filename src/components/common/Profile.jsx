import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../features/studentProfile/studentProfileSlice";
import { setAuthToken } from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import { FaCheckCircle, FaExclamationCircle, FaUser, FaEnvelope, FaEdit, FaSave, FaTimes } from "react-icons/fa";

const Profile = () => {
  const { token } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    setAuthToken(token);
    if (token) dispatch(fetchProfile());
  }, [token, dispatch]);

  const { name, email, role, loading } = useSelector(
    (state) => state.studentProfile
  );

  const [formName, setFormName] = useState("");
  useEffect(() => {
    if (name) setFormName(name);
  }, [name]);

  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const handleInputChange = (e) => {
    setFormName(e.target.value);
  };

  const clearAlert = () => {
    setAlert({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formName.trim()) {
      setAlert({
        type: "error",
        message: "Name cannot be empty.",
      });
      return;
    }

    try {
      setIsSaving(true);
      clearAlert();

      const storedToken = localStorage.getItem("token");

      const response = await fetch(`${backendUrl}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          name: formName.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFormName(data.data.name);
        setIsEditing(false);
        setAlert({
          type: "success",
          message: "Profile updated successfully!",
        });
        dispatch(fetchProfile());
      } else {
        setAlert({
          type: "error",
          message: data.message || "Failed to update profile.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlert({
        type: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (userName) => {
    if (!userName) return "?";
    const words = userName.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          View and manage your personal account information
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Avatar Banner Section */}
        <div className="bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-purple-600/10 p-6 border-b border-slate-100 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {getInitials(name)}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">{name || "User"}</h2>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
                {role || "Student"}
              </span>
              <span className="text-xs text-slate-400">• Active Account</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Alerts */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FaUser className="text-slate-400 text-xs" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={isEditing ? formName : name || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FaEnvelope className="text-slate-400 text-xs" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email || ""}
                disabled
                readOnly
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed outline-none"
              />
              <p className="text-xs text-slate-400">
                Email address cannot be changed as it is linked to your login credentials.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-sm transition-all disabled:opacity-50"
                  >
                    <FaSave />
                    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormName(name);
                      setIsEditing(false);
                    }}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50"
                  >
                    <FaTimes />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-sm hover:shadow transition-all"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

