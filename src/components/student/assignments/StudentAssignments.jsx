import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Upload, 
  Eye, 
  MessageSquare,
  Calendar,
  Loader2,
  Mailbox
} from "lucide-react";
import useLearningTimer from "../../../helper/customHooks/useLearningTimer";

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  
  // Track learning time automatically
  const { isActive, formattedTime } = useLearningTimer();

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    fetchAssignments();
  }, [filter]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url =
        filter === "all"
          ? `${BACKEND_URL}/assignments/student/list`
          : `${BACKEND_URL}/assignments/student/list?status=${filter}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setAssignments(data.data);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (assignment) => {
    if (assignment.submissionStatus.submitted) {
      if (assignment.submissionStatus.grade?.marks !== null) {
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Graded
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30">
          <Upload className="w-3 h-3" /> Submitted
        </span>
      );
    } else if (assignment.submissionStatus.isOverdue) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
          <AlertCircle className="w-3 h-3" /> Overdue
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <FileText className="w-3 h-3" /> Pending
        </span>
      );
    }
  };

  const getDaysLeft = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (diff < 0) return "Overdue";
    if (diff === 0) return "Due Today";
    if (diff === 1) return "1 day left";
    return `${diff} days left`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading assignments...</p>
      </div>
    );
  }

  const FilterButton = ({ id, label }) => (
    <button
      onClick={() => setFilter(id)}
      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
        filter === id
          ? "bg-slate-900 text-white shadow-xs"
          : "bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 mb-1">
              Academics
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-cyan-600" />
              My Assignments
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <FilterButton id="all" label="All" />
            <FilterButton id="pending" label="Pending" />
            <FilterButton id="submitted" label="Submitted" />
            <FilterButton id="graded" label="Graded" />
          </div>
        </div>

        {assignments.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-xs">
            <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mb-4 border border-cyan-200">
              <Mailbox className="w-8 h-8 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No assignments found</h3>
            <p className="text-slate-500 max-w-md">
              You don't have any assignments matching this filter criteria at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => {
              const isOverdue = new Date(assignment.dueDate) < new Date();
              
              return (
                <div key={assignment._id} className="bg-white border border-slate-200/80 hover:border-cyan-500/50 rounded-3xl p-6 flex flex-col transition-all duration-300 relative group shadow-xs hover:shadow-xl">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight">
                      {assignment.title}
                    </h3>
                    <div className="shrink-0">{getStatusBadge(assignment)}</div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-cyan-600 shrink-0" />
                        <span className="truncate">{assignment.course?.title}</span>
                      </p>
                      {assignment.chapter && (
                        <p className="text-xs text-slate-500 flex items-center gap-2 pl-6">
                          <span className="truncate">{assignment.chapter}</span>
                        </p>
                      )}
                    </div>
                    
                    <p className="text-sm text-slate-500 line-clamp-3">
                      {assignment.description}
                    </p>

                    <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-200/80">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-medium">Max Marks</span>
                        <span className="font-bold text-slate-900">{assignment.maxMarks}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-cyan-600" /> Due
                        </span>
                        <span className="font-bold text-slate-900">
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {!assignment.submissionStatus.submitted && (
                        <div className={`flex justify-between items-center text-sm pt-2 border-t border-slate-200 ${isOverdue ? 'text-red-600' : 'text-amber-600'}`}>
                          <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-4 h-4" /> Time Left
                          </span>
                          <span className="font-bold">
                            {getDaysLeft(assignment.dueDate)}
                          </span>
                        </div>
                      )}
                    </div>

                    {assignment.submissionStatus.submitted && (
                      <div className="space-y-3 pt-2">
                        <p className="text-xs text-teal-700 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Submitted: {new Date(assignment.submissionStatus.submittedAt).toLocaleString()}
                        </p>
                        
                        {assignment.submissionStatus.grade?.marks !== null && (
                          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3">
                            <p className="text-sm font-bold text-cyan-900 flex justify-between items-center mb-1">
                              <span>Grade Received</span>
                              <span>{assignment.submissionStatus.grade.marks} / {assignment.maxMarks}</span>
                            </p>
                            {assignment.submissionStatus.grade.feedback && (
                              <p className="text-xs text-slate-600 flex gap-1.5 mt-2 pt-2 border-t border-cyan-200/60">
                                <MessageSquare className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{assignment.submissionStatus.grade.feedback}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200">
                    {assignment.submissionStatus.submitted ? (
                      <button
                        onClick={() => navigate(`/student/assignments/${assignment._id}/view`)}
                        className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all shadow-xs"
                      >
                        <Eye className="w-4 h-4" /> View Submission
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/student/assignments/${assignment._id}/submit`)}
                        className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-95"
                      >
                        <Upload className="w-4 h-4" /> Submit Assignment
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;
