import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Paperclip, 
  User, 
  Mail, 
  MessageSquare,
  Award,
  Calendar,
  Layers,
  Inbox
} from "lucide-react";

const AssignmentSubmissions = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeForm, setGradeForm] = useState({ marks: "", feedback: "" });
  const navigate = useNavigate();

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/assignments/teacher/${assignmentId}/submissions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (data.success) {
        setAssignment(data.data.assignment);
        setSubmissions(data.data.submissions);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/assignments/teacher/grade/${gradingSubmission._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gradeForm),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Submission graded successfully!");
        setGradingSubmission(null);
        setGradeForm({ marks: "", feedback: "" });
        fetchSubmissions();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error grading submission:", error);
      alert("Failed to grade submission");
    }
  };

  const openGradeModal = (submission) => {
    setGradingSubmission(submission);
    setGradeForm({
      marks: submission.grade?.marks || "",
      feedback: submission.grade?.feedback || "",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-3 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center flex-col gap-4">
        <ClipboardList className="w-12 h-12 text-slate-400" />
        <div className="text-slate-800 font-bold text-lg">Assignment not found</div>
        <button
          onClick={() => navigate("/teacher/assignments")}
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all shadow-xs"
        >
          Back to Assignments
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/teacher/assignments")}
            className="flex items-center justify-center p-2.5 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 shadow-xs transition-all w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-cyan-600" />
            <span className="truncate max-w-lg">{assignment.title}</span> - Submissions
          </h2>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Course
            </span>
            <span className="text-slate-900 font-bold truncate">{assignment.course?.title}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700 flex items-center gap-1">
              <Award className="w-3 h-3" /> Max Marks
            </span>
            <span className="text-slate-900 font-bold">{assignment.maxMarks}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Due Date
            </span>
            <span className="text-slate-900 font-bold">
              {new Date(assignment.dueDate).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700 flex items-center gap-1">
              <FileText className="w-3 h-3" /> Total Submissions
            </span>
            <span className="text-slate-900 font-bold">{submissions.length}</span>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200/80 rounded-3xl p-6 text-center shadow-xs">
            <Inbox className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No submissions yet</h3>
            <p className="text-slate-500">Students have not submitted anything for this assignment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <div key={submission._id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all duration-300 flex flex-col">
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-800/50">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-slate-400" />
                      {submission.student?.name}
                    </h3>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      {submission.student?.email}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {submission.isLate && (
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                        LATE
                      </span>
                    )}
                    {submission.status === "graded" ? (
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> GRADED
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> PENDING
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-5">
                  <div className="text-sm text-slate-400 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-violet-400" />
                    <strong>Submitted:</strong>{" "}
                    {new Date(submission.submittedAt).toLocaleString()}
                  </div>

                  {submission.textContent && (
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Text Response
                      </h4>
                      <p className="text-sm text-slate-300 line-clamp-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                        {submission.textContent}
                      </p>
                    </div>
                  )}

                  {submission.attachments && submission.attachments.length > 0 && (
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-1.5">
                        <Paperclip className="w-3.5 h-3.5" /> Attachments
                      </h4>
                      <ul className="space-y-2">
                        {submission.attachments.map((file, index) => (
                          <li key={index}>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 hover:border-violet-500/30"
                            >
                              <Paperclip className="w-3.5 h-3.5" />
                              <span className="truncate">{file.filename}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {submission.grade?.marks !== null && submission.grade !== undefined && submission.status === 'graded' && (
                    <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" /> Grade
                        </h4>
                        <span className="text-lg font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                          {submission.grade.marks} <span className="text-emerald-500/50 text-sm">/ {assignment.maxMarks}</span>
                        </span>
                      </div>
                      
                      {submission.grade.feedback && (
                        <div className="mb-3">
                          <strong className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5 block flex items-center gap-1.5">
                            <MessageSquare className="w-3 h-3" /> Feedback
                          </strong>
                          <p className="text-sm text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 italic">
                            "{submission.grade.feedback}"
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-slate-500 text-right mt-2">
                        Graded: {new Date(submission.grade.gradedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => openGradeModal(submission)}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-md shadow-violet-600/20 transition-all active:scale-95"
                  >
                    {submission.status === "graded" ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Edit Grade
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" /> Grade Submission
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grading Modal */}
        {gradingSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-violet-400" />
                Grade Submission
              </h3>
              <p className="text-slate-400 text-sm mb-6 flex items-center gap-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                <User className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-300">{gradingSubmission.student?.name}</span>
              </p>

              <form onSubmit={handleGradeSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Marks (out of {assignment.maxMarks})
                  </label>
                  <input
                    type="number"
                    value={gradeForm.marks}
                    onChange={(e) =>
                      setGradeForm({ ...gradeForm, marks: e.target.value })
                    }
                    required
                    min="0"
                    max={assignment.maxMarks}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Feedback (max 2000 characters)
                  </label>
                  <textarea
                    value={gradeForm.feedback}
                    onChange={(e) =>
                      setGradeForm({ ...gradeForm, feedback: e.target.value })
                    }
                    rows="4"
                    maxLength={2000}
                    placeholder="Provide feedback to the student..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm resize-none transition-all"
                  />
                  <div className="text-right mt-1.5">
                    <small className="text-slate-500 font-medium">
                      {gradeForm.feedback?.length || 0}/2000
                    </small>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setGradingSubmission(null)}
                    className="flex-1 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-md shadow-violet-600/20 transition-all active:scale-95"
                  >
                    Submit Grade
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentSubmissions;
