import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Upload, FileText, CheckCircle2, XCircle, Clock, File, Trash2, AlertCircle 
} from "lucide-react";

const TeacherQualificationUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [verificationStatus, setVerificationStatus] = useState(null);
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    fetchVerificationStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/teacher/verification/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setVerificationStatus(data.data);
      }
    } catch (error) {
      console.error("Error fetching verification status:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(selectedFile.type)) {
        setMessage({ type: "error", text: "Please upload a valid file (PDF, JPG, PNG, DOC, DOCX)" });
        setFile(null);
        e.target.value = "";
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "File size should not exceed 5MB" });
        setFile(null);
        e.target.value = "";
        return;
      }

      setFile(selectedFile);
      setMessage({ type: "", text: "" });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage({ type: "error", text: "Please select a file to upload" });
      return;
    }

    setUploading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("qualification", file);

      const response = await fetch(`${BACKEND_URL}/teacher/verification/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Qualification uploaded successfully! Awaiting admin verification." });
        setFile(null);
        document.getElementById("fileInput").value = "";

        setTimeout(() => {
          fetchVerificationStatus();
        }, 1000);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to upload qualification" });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "Verified":
        return {
          icon: <CheckCircle2 className="w-12 h-12 text-emerald-400" />,
          colorClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        };
      case "Rejected":
        return {
          icon: <XCircle className="w-12 h-12 text-red-400" />,
          colorClass: "bg-red-500/10 text-red-400 border-red-500/30",
        };
      case "Pending":
      default:
        return {
          icon: <Clock className="w-12 h-12 text-amber-400" />,
          colorClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <button 
            onClick={() => navigate("/teacher/home")} 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h2 className="text-3xl font-extrabold text-white mb-2">Teacher Qualification Verification</h2>
          <p className="text-slate-400">Upload your teaching qualification documents for verification.</p>
        </div>

        {/* Current Verification Status */}
        {verificationStatus && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-slate-800 pb-6 mb-6">
              <div className="shrink-0 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                {getStatusInfo(verificationStatus.verificationStatus).icon}
              </div>
              <div className="flex flex-col items-center md:items-start flex-grow text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-2">Current Verification Status</h3>
                <span className={`px-4 py-1.5 text-sm font-bold rounded-full border ${getStatusInfo(verificationStatus.verificationStatus).colorClass}`}>
                  {verificationStatus.verificationStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {verificationStatus.verificationNotes && (
                <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/50">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Admin Notes</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{verificationStatus.verificationNotes}</p>
                </div>
              )}

              {verificationStatus.qualificationDoc && (
                <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/50 flex flex-col h-full">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">Uploaded Document</h4>
                  <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl border border-slate-700 mt-auto">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <FileText className="w-6 h-6 text-violet-400" />
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <p className="text-sm font-medium text-white truncate">
                        {verificationStatus.qualificationDoc.publicId || "Qualification Document"}
                      </p>
                      <p className="text-xs text-slate-500">
                        Uploaded: {new Date(verificationStatus.qualificationDoc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {verificationStatus.qualificationDoc.url && (
                      <a 
                        href={verificationStatus.qualificationDoc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
                      >
                        View
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Form */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6">
            {verificationStatus?.qualificationDoc ? "Upload New Qualification Document" : "Upload Qualification Document"}
          </h3>

          <form onSubmit={handleUpload} className="space-y-6">
            <label 
              htmlFor="fileInput" 
              className={`flex flex-col items-center justify-center w-full h-48 px-4 transition bg-slate-950 border-2 border-slate-700 border-dashed rounded-2xl appearance-none cursor-pointer hover:border-violet-500 hover:bg-slate-900 focus:outline-none ${file ? 'border-violet-500/50 bg-violet-500/5' : ''}`}
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="p-4 bg-slate-900 rounded-full">
                  <Upload className="w-8 h-8 text-violet-400" />
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-bold text-white mb-1">
                    {file ? file.name : 'Drag & drop or click to browse'}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {file ? `${(file.size / 1024).toFixed(2)} KB` : 'PDF, JPG, PNG, DOC, DOCX (Max 5MB)'}
                  </p>
                </div>
              </div>
              <input 
                type="file" 
                id="fileInput" 
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
                onChange={handleFileChange} 
                disabled={uploading} 
                className="hidden" 
              />
            </label>

            {file && (
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700">
                <div className="flex items-center gap-4 overflow-hidden">
                  <File className="w-8 h-8 text-violet-400 shrink-0" />
                  <div className="truncate">
                    <h5 className="text-sm font-bold text-white truncate">{file.name}</h5>
                    <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => { setFile(null); document.getElementById('fileInput').value = ''; }} 
                  disabled={uploading}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}

            {message.text && (
              <div className={`flex items-start gap-3 p-4 rounded-xl border ${
                message.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={!file || uploading} 
              className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                !file || uploading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/20 active:scale-[0.98]'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload Qualification Document'}
            </button>
          </form>

          <div className="mt-8 bg-slate-950/50 p-5 rounded-xl border border-slate-800/50">
            <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" /> Upload Guidelines
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0"></div> Upload clear, readable copies of your qualification documents.</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0"></div> Ensure all text and personal details are clearly visible.</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0"></div> Accepted types: Teaching certificates, degrees, diplomas.</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0"></div> File size limit is 5MB.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherQualificationUpload;
