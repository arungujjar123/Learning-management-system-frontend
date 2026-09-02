import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Eye,
  FileText,
  BookOpen,
  Layers,
  Inbox,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  Award
} from "lucide-react";

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    fetchCourses();
    fetchAssignments();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/teacher/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchAssignments = async (courseId = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = courseId
        ? `${BACKEND_URL}/assignments/teacher/list?courseId=${courseId}`
        : `${BACKEND_URL}/assignments/teacher/list`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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

  const handleFilterChange = (courseId) => {
    setFilterCourse(courseId);
    fetchAssignments(courseId);
  };

  const handleDelete = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/assignments/teacher/delete/${assignmentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Assignment deleted successfully!");
        fetchAssignments(filterCourse);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert("Failed to delete assignment");
    }
  };

  const getStatusBadge = (assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);

    if (assignment.status === "closed") {
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
          <XCircle className="w-3 h-3" /> Closed
        </span>
      );
    } else if (now > dueDate) {
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> Overdue
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Active
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-3 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-600" />
              My Assignments
            </h2>
          </div>
          <button
            onClick={() => navigate("/teacher/assignments/create")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Create New Assignment
          </button>
        </div>

        <div className="mb-8">
          <select
            value={filterCourse}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="w-full md:w-64 px-4 py-3 rounded-xl bg-white border border-slate-200/80 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm shadow-xs"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200/80 rounded-3xl p-6 text-center shadow-xs">
            <Inbox className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No assignments found</h3>
            <p className="text-slate-500 mb-6">You haven't created any assignments yet for this course.</p>
            <button
              onClick={() => navigate("/teacher/assignments/create")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Create Your First Assignment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="bg-white border border-slate-200/80 rounded-3xl p-6 hover:border-cyan-500/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-2 pr-2">{assignment.title}</h3>
                  {getStatusBadge(assignment)}
                </div>

                <div className="flex-1">
                  <div className="space-y-2 mb-4">
                    <p className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <BookOpen className="w-4 h-4 text-cyan-600" />
                      <strong className="truncate">{assignment.course?.title}</strong>
                    </p>
                    {assignment.chapter && (
                      <p className="flex items-center gap-2 text-sm text-slate-500">
                        <Layers className="w-4 h-4 text-slate-400" />
                        <span>Chapter: {assignment.chapter}</span>
                      </p>
                    )}
                  </div>
                  
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6">{assignment.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                        <Award className="w-3 h-3 text-cyan-600" /> Max Marks
                      </span>
                      <span className="text-slate-900 font-bold">{assignment.maxMarks}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-cyan-600" /> Due Date
                      </span>
                      <span className="text-slate-900 font-bold truncate">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6 pt-6 border-t border-slate-200">
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-extrabold text-slate-900">
                        {assignment.stats?.totalSubmissions || 0}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Submissions</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-extrabold text-teal-600">
                        {assignment.stats?.gradedSubmissions || 0}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Graded</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-extrabold text-amber-500">
                        {assignment.stats?.pendingGrading || 0}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Pending</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() =>
                      navigate(
                        `/teacher/assignments/${assignment._id}/submissions`
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all shadow-xs"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => handleDelete(assignment._id)}
                    className="flex items-center justify-center p-2.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold text-sm border border-red-200/80 transition-all active:scale-95"
                    title="Delete Assignment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAssignments;
