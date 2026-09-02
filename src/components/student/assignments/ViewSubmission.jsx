import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  FileText, 
  BookOpen, 
  Award, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Paperclip,
  CalendarDays,
  Loader2,
  XCircle,
  FileDown
} from "lucide-react";
import useLearningTimer from "../../../helper/customHooks/useLearningTimer";

const ViewSubmission = () => {
  const { assignmentId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Track learning time automatically
  const { isActive, formattedTime } = useLearningTimer();

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    fetchSubmission();
  }, [assignmentId]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/assignments/student/submission/${assignmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (data.success) {
        setSubmission(data.data);
      }
    } catch (error) {
      console.error("Error fetching submission:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading submission details...</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <XCircle className="w-12 h-12 text-red-600 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Submission not found</h2>
        <p className="text-slate-500 mb-6 text-center max-w-md">We couldn't find your submission for this assignment. You may not have submitted it yet.</p>
        <button
          onClick={() => navigate("/student/assignments")}
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all flex items-center gap-2 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Assignments
        </button>
      </div>
    );
  }

  const assignment = submission.assignment;
  const grade = submission.grade;

  return (
    <div className="space-y-6 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-6">
        
        <div className="mb-8">
          <button
            onClick={() => navigate("/student/assignments")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4 text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Assignments
          </button>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 mb-1">
            Submission Details
          </p>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-cyan-600" />
            {assignment.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Details */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Assignment Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Course</span>
                    <span className="font-semibold text-slate-900">{assignment.course?.title}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Max Marks</span>
                    <span className="font-extrabold text-slate-900">{assignment.maxMarks}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Submitted On</span>
                    <span className="font-semibold text-slate-900">{new Date(submission.submittedAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Status</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full ${
                      submission.status === "graded" 
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                        : "bg-cyan-50 text-cyan-800 border border-cyan-200"
                    }`}>
                      {submission.isLate && <Clock className="w-3 h-3" />}
                      {submission.isLate && "Late - "}
                      {submission.status === "graded" ? "Graded" : "Submitted"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submitted Content */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-600" /> Your Work
              </h3>

              {submission.textContent && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Text Submission</h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-800 text-sm whitespace-pre-wrap">
                    {submission.textContent}
                  </div>
                </div>
              )}

              {submission.attachments && submission.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-slate-400" /> Attached Files ({submission.attachments.length})
                  </h4>
                  <ul className="space-y-3">
                    {submission.attachments.map((file, index) => (
                      <li key={index}>
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 hover:border-cyan-500/50 hover:bg-cyan-50/50 rounded-xl group transition-all"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-white rounded-lg border border-slate-200 group-hover:bg-cyan-50 transition-colors">
                              <FileText className="w-5 h-5 text-slate-500 group-hover:text-cyan-600 transition-colors" />
                            </div>
                            <span className="text-sm font-bold text-slate-800 truncate">{file.filename || `Attachment ${index + 1}`}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-1.5 rounded-lg transition-colors">
                            <FileDown className="w-3.5 h-3.5" /> View
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {!submission.textContent && (!submission.attachments || submission.attachments.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-slate-400 italic">No content or files were submitted.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Grade Card */}
            {grade && grade.marks !== null ? (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs relative overflow-hidden">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                  <Award className="w-5 h-5 text-cyan-600" /> Grade Result
                </h3>
                
                <div className="flex flex-col items-center justify-center py-6 border-b border-slate-200 relative z-10">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-extrabold text-slate-900">{grade.marks}</span>
                    <span className="text-2xl font-bold text-slate-400">/ {assignment.maxMarks}</span>
                  </div>
                  <div className="px-3 py-1 bg-cyan-50 border border-cyan-200 text-cyan-800 text-sm font-bold rounded-full">
                    {((grade.marks / assignment.maxMarks) * 100).toFixed(1)}%
                  </div>
                </div>

                {grade.feedback && (
                  <div className="pt-6 relative z-10">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-cyan-600" /> Teacher's Feedback
                    </h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <p className="text-sm text-slate-700 italic">"{grade.feedback}"</p>
                    </div>
                  </div>
                )}

                <div className="pt-6 mt-6 border-t border-slate-200 text-center relative z-10">
                  <p className="text-xs text-slate-400 font-medium">
                    Graded on {new Date(grade.gradedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center shadow-xs">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
                  <Clock className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Pending Grade</h3>
                <p className="text-sm text-slate-500 font-medium">
                  Your submission has been received and is waiting to be graded by the instructor.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSubmission;
