import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, CheckCircle2, XCircle, AlertCircle, FileText, Eye, Upload, ShieldAlert, GraduationCap, Mail, Loader2, Play } from "lucide-react";

const AdminTeacherDetail = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    fetchTeacherDetails();
  }, [teacherId]);

  const fetchTeacherDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/admin/teachers/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setTeacher(data.data);
      } else {
        alert("Error: " + data.message);
        navigate("/admin/users");
      }
    } catch (error) {
      console.error("Error fetching teacher details:", error);
      alert("Failed to load teacher details");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/admin/teachers/${teacherId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        alert(
          `Teacher deleted successfully! ${data.data.deletedCoursesCount} courses were also removed.`
        );
        navigate("/admin/users");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert("Failed to delete teacher");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleApproveTeacher = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/admin/teachers/${teacherId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notes: approvalNotes }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Teacher verification approved successfully!");
        setShowApproveModal(false);
        fetchTeacherDetails(); // Refresh data
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error approving teacher:", error);
      alert("Failed to approve teacher");
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectTeacher = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/admin/teachers/${teacherId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notes: rejectionNotes }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Teacher verification rejected.");
        setShowRejectModal(false);
        fetchTeacherDetails(); // Refresh data
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error rejecting teacher:", error);
      alert("Failed to reject teacher");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] font-sans">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading teacher details...</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center font-sans">
        <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Teacher not found</h3>
        <p className="text-slate-500 mb-6 font-medium">The teacher profile could not be loaded.</p>
        <button onClick={() => navigate("/admin/users")} className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs transition-all flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/users")}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all shadow-xs"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">Profile Review</span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Teacher Details</h2>
            </div>
          </div>
          
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md shadow-red-600/20"
          >
            <Trash2 className="w-4 h-4" /> Delete Teacher
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Teacher Info Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <GraduationCap className="w-5 h-5 text-cyan-600" />
              Teacher Information
            </h3>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Full Name</label>
                <div className="text-lg text-slate-900 font-bold">{teacher.name}</div>
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Email Address</label>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {teacher.email}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Role</label>
                  <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    Teacher
                  </span>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Total Courses</label>
                  <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                    {teacher.courses?.length || 0} Courses
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Status Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="w-5 h-5 text-cyan-600" />
              Verification Status
            </h3>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  teacher.verificationStatus === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                  teacher.verificationStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                  teacher.verificationStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-200 text-slate-600'
                }`}>
                  {teacher.verificationStatus === 'Verified' ? <CheckCircle2 className="w-6 h-6" /> :
                   teacher.verificationStatus === 'Rejected' ? <XCircle className="w-6 h-6" /> :
                   teacher.verificationStatus === 'Pending' ? <Loader2 className="w-6 h-6 animate-spin" /> :
                   <AlertCircle className="w-6 h-6" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Status</div>
                  <div className={`text-xl font-extrabold ${
                    teacher.verificationStatus === 'Verified' ? 'text-emerald-700' :
                    teacher.verificationStatus === 'Rejected' ? 'text-red-700' :
                    teacher.verificationStatus === 'Pending' ? 'text-amber-700' :
                    'text-slate-600'
                  }`}>
                    {teacher.verificationStatus || "Not Submitted"}
                  </div>
                </div>
              </div>

              {/* Approve/Reject Buttons */}
              {teacher.verificationStatus === "Pending" && teacher.qualificationDoc?.url && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowApproveModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}

              {teacher.verificationNotes && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Admin Feedback</label>
                  <p className="text-sm text-slate-700 italic font-medium">"{teacher.verificationNotes}"</p>
                </div>
              )}

              {teacher.qualificationDoc?.url ? (
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Qualification Document</label>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-cyan-600" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {teacher.qualificationDoc.format?.toUpperCase() || "Document"}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {teacher.qualificationDoc.bytes ? `${(teacher.qualificationDoc.bytes / 1024).toFixed(2)} KB` : "Unknown size"}
                          {teacher.qualificationDoc.uploadedAt && ` • ${new Date(teacher.qualificationDoc.uploadedAt).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <a
                      href={teacher.qualificationDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
                      title="View Document"
                    >
                      <Eye className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 border border-dashed border-slate-200 rounded-xl text-center">
                  <AlertCircle className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500 font-medium">No qualification document uploaded</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Assessment Section */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:col-span-2 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              Admin Assessment & Actions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Review Checklist</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Valid qualification document submitted and readable</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Professional email and profile information</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Course content quality meets platform standards (if applicable)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Compliance with all platform policies</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-900 font-bold mb-3">
                  <AlertCircle className="w-5 h-5 text-amber-600" /> Warning: Deletion Impact
                </div>
                <p className="text-sm text-slate-700 mb-4 font-medium">Deleting this teacher will permanently remove:</p>
                <ul className="space-y-2 mb-4 list-disc list-inside text-sm text-slate-600 font-medium marker:text-amber-600">
                  <li>Teacher account and profile data</li>
                  <li>All <strong className="text-slate-900">{teacher.courses?.length || 0} course(s)</strong> created by this teacher</li>
                  <li>Course enrollments and all student progress associated with them</li>
                </ul>
                <p className="text-xs font-bold text-amber-800 italic">Recommendation: Consider rejecting verification instead of deletion if dealing with incomplete credentials.</p>
              </div>
            </div>
          </div>

          {/* Courses Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:col-span-2 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Play className="w-5 h-5 text-cyan-600" />
              Created Courses ({teacher.courses?.length || 0})
            </h3>

            {teacher.courses && teacher.courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {teacher.courses.map((course) => (
                  <div key={course._id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-cyan-500/50 transition-colors group">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Play className="w-8 h-8 text-cyan-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate mb-1">{course.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3 font-medium">{course.description}</p>
                      <button
                        onClick={() => navigate(`/admin/courses/${course._id}`)}
                        className="mt-auto text-xs font-bold text-cyan-700 hover:text-cyan-800 w-fit flex items-center gap-1 group-hover:underline"
                      >
                        View Details <ArrowLeft className="w-3 h-3 rotate-180" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <Play className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-slate-500 text-sm font-medium">This teacher hasn't created any courses yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-md w-full">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-xl font-bold">Confirm Deletion</h3>
            </div>
            
            <p className="text-slate-700 mb-6 font-medium">
              Are you sure you want to delete <strong className="text-slate-900">{teacher.name}</strong>?
            </p>
            
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 mb-6">
              <p className="text-sm font-bold text-red-800 mb-2">This will permanently delete:</p>
              <ul className="text-sm text-red-700 list-disc list-inside space-y-1 mb-3 font-medium">
                <li>Teacher account</li>
                <li>{teacher.courses?.length || 0} course(s)</li>
                <li>All associated data</li>
              </ul>
              <p className="text-xs font-bold text-red-600 uppercase tracking-wider">⚠️ This action cannot be undone!</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTeacher}
                className="flex-1 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all active:scale-95 flex justify-center items-center gap-2 shadow-md shadow-red-600/20"
                disabled={deleting}
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Teacher"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Verification Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-md w-full">
            <div className="flex items-center gap-3 text-emerald-600 mb-4">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-xl font-bold text-slate-900">Approve Verification</h3>
            </div>
            
            <p className="text-slate-700 mb-6 font-medium">
              Are you sure you want to approve <strong className="text-slate-900">{teacher.name}</strong>'s qualification?
            </p>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Approval Notes (Optional):</label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Add any notes for the teacher..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm resize-none"
                rows="4"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setApprovalNotes("");
                }}
                className="flex-1 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleApproveTeacher}
                className="flex-1 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all active:scale-95 flex justify-center items-center gap-2 shadow-md shadow-emerald-600/20"
                disabled={processing}
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Verification Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-md w-full">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <XCircle className="w-6 h-6" />
              <h3 className="text-xl font-bold text-slate-900">Reject Verification</h3>
            </div>
            
            <p className="text-slate-700 mb-6 font-medium">
              Are you sure you want to reject <strong className="text-slate-900">{teacher.name}</strong>'s qualification?
            </p>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Rejection Reason (Required):</label>
              <textarea
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                placeholder="Explain why the qualification was rejected..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm resize-none"
                rows="4"
                required
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionNotes("");
                }}
                className="flex-1 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleRejectTeacher}
                className="flex-1 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 shadow-md shadow-amber-600/20"
                disabled={processing || !rejectionNotes.trim()}
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeacherDetail;
