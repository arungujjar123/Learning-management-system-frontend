import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, BookOpen, Loader2 } from "lucide-react";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

        const response = await fetch(`${backendUrl}/admin/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          setCourses(data.data);
        } else {
          console.error("Error fetching courses:", data.message);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const deleteCourse = async (courseId) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const token = localStorage.getItem("token");
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

      const response = await fetch(`${backendUrl}/admin/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setCourses(courses.filter((course) => course._id !== courseId));
        alert("Course deleted successfully");
      } else {
        alert("Error deleting course: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Error deleting course");
    }
  };

  const viewCourseDetails = (courseId) => {
    navigate(`/admin/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] font-sans">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">Management</span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">All Courses ({courses.length})</h2>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 hover:border-cyan-500/50 flex flex-col">
                {/* Course Image */}
                <div className="relative h-48 rounded-2xl overflow-hidden mb-6 group bg-slate-100 border border-slate-200/80">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=Course+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                      <BookOpen className="w-10 h-10 mb-2 opacity-50 text-cyan-600" />
                      <span className="text-xs font-semibold">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-xs">
                    <button
                      onClick={() => viewCourseDetails(course._id)}
                      className="p-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 transition-all active:scale-95 shadow-md"
                      title="View Course Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all active:scale-95 shadow-md"
                      title="Delete Course"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Course Info */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-slate-900 font-bold text-lg mb-2 line-clamp-1">{course.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px] font-medium">
                    {course.description || "No description available"}
                  </p>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Teacher</span>
                      <span className="text-slate-900 font-bold truncate max-w-[150px]">
                        {course.teacher ? course.teacher.name : "Unassigned"}
                      </span>
                    </div>

                    {course.category && (
                      <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                        <span className="text-slate-500 font-medium">Category</span>
                        <span className="text-slate-800 font-semibold">{course.category}</span>
                      </div>
                    )}

                    {course.level && (
                      <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                        <span className="text-slate-500 font-medium">Level</span>
                        <span className="text-slate-800 font-semibold">{course.level}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Students</span>
                      <span className="text-cyan-800 font-bold bg-cyan-50 px-2.5 py-0.5 rounded-full text-xs border border-cyan-200">
                        {course.students ? course.students.length : 0} enrolled
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Chapters</span>
                      <span className="text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs border border-emerald-200">
                        {course.chapters ? course.chapters.length : 0} chapters
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100">
                    <button
                      onClick={() => viewCourseDetails(course._id)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-95"
                    >
                      Details & Videos
                    </button>
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm border border-red-200 transition-all active:scale-95"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 bg-white border border-slate-200/80 rounded-3xl text-center shadow-xs">
            <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
            <p className="text-slate-500 max-w-md font-medium">There are currently no courses in the system. When teachers create courses, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourses;
