import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Clock, FileText, Loader2 } from "lucide-react";

const TeacherVerificationStatus = () => {
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/teacher/verification/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setVerificationData(data.data);
      }
    } catch (error) {
      console.error("Error fetching verification status:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "Verified":
        return {
          color: "border-emerald-500",
          bg: "bg-emerald-500",
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-400" />,
          badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        };
      case "Rejected":
        return {
          color: "border-red-500",
          bg: "bg-red-500",
          icon: <XCircle className="w-8 h-8 text-red-400" />,
          badgeClass: "bg-red-500/10 text-red-400 border-red-500/30",
        };
      case "Pending":
      default:
        return {
          color: "border-amber-500",
          bg: "bg-amber-500",
          icon: <Clock className="w-8 h-8 text-amber-400" />,
          badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        };
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[200px] shadow-xs">
        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-medium">Loading verification status...</p>
      </div>
    );
  }

  if (!verificationData) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col items-center text-center shadow-xs relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-600 group-hover:w-1.5 transition-all"></div>
        <div className="p-4 bg-cyan-50 rounded-2xl mb-4 border border-cyan-200">
          <FileText className="w-8 h-8 text-cyan-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Verification Required</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-sm">
          Please upload your teaching qualification for verification to unlock all features.
        </p>
        <button
          onClick={() => navigate("/teacher/upload-qualification")}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-95"
        >
          Upload Now
        </button>
      </div>
    );
  }

  const status = verificationData.verificationStatus;
  const statusInfo = getStatusInfo(status);

  return (
    <div
      className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs relative overflow-hidden group"
    >
      <div className={`absolute top-0 left-0 w-1.5 h-full ${statusInfo.bg} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
      
      <div className="flex items-center gap-4 mb-5">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          {statusInfo.icon}
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Verification Status</h3>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border inline-block ${statusInfo.badgeClass}`}>
            {status}
          </span>
        </div>
      </div>

      {verificationData.verificationNotes && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Admin Feedback:</p>
          <p className="text-sm text-slate-700 leading-relaxed">{verificationData.verificationNotes}</p>
        </div>
      )}

      <button
        onClick={() => navigate("/teacher/upload-qualification")}
        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all active:scale-95 text-center"
      >
        View Details & Documents
      </button>
    </div>
  );
};

export default TeacherVerificationStatus;
