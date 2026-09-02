import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Eye } from "lucide-react";

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const viewCourseDetails = (courseId) => {
    navigate(`/student/courses/${courseId}`);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

        const response = await fetch(`${backendUrl}/student/my-courses`, {
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

  console.log("courses", courses);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-3 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 mb-1">My Learning</p>
          <h2 className="text-3xl font-extrabold text-slate-900">All Enrolled Courses ({courses.length})</h2>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col group shadow-xs hover:shadow-xl">
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
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
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <BookOpen className="w-8 h-8 mb-2 text-cyan-600" />
                      <span className="text-sm font-medium text-slate-500">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                    <button
                      onClick={() => viewCourseDetails(course._id)}
                      className="w-12 h-12 bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 rounded-full flex items-center justify-center text-white shadow-md transition-transform transform scale-90 group-hover:scale-100"
                      title="View Course Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-2 group-hover:text-cyan-700 transition-colors">{course.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1">
                    {course.description || "No description available"}
                  </p>

                  <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-medium">Teacher:</span>
                      <span className="text-slate-800 font-bold">
                        {course.teacher ? course.teacher.name : "No teacher assigned"}
                      </span>
                    </div>

                    {course.category && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-medium">Category:</span>
                        <span className="text-cyan-800 font-bold bg-cyan-50 px-2 py-0.5 rounded-full text-xs border border-cyan-200">{course.category}</span>
                      </div>
                    )}

                    {course.level && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-medium">Level:</span>
                        <span className="text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-full text-xs border border-teal-200">{course.level}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-medium">Chapters:</span>
                      <span className="text-slate-800 font-bold">
                        {course.chapters ? course.chapters.length : 0} chapters
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/student/courses/${course._id}`}
                    className="w-full block text-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-95"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center bg-white border border-slate-200/80 rounded-3xl text-center shadow-xs">
            <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mb-4 border border-cyan-200">
              <BookOpen className="w-8 h-8 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
            <p className="text-slate-500">You haven't enrolled in any courses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;
