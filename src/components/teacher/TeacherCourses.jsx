import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, BookX, Book } from "lucide-react";

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    async function fetchTeacherCourses() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/teacher/courses`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        setCourses(data.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    }
    fetchTeacherCourses();
  }, []);

  const viewCourseDetails = (courseId) => {
    // If this was used for something other than the link below, can implement.
    // The original button called this but it wasn't defined in the file.
    window.location.href = `/teacher/courses/${courseId}`;
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900">
          All Courses <span className="text-slate-400 font-medium text-lg">({courses?.length || 0})</span>
        </h2>

        {courses?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses?.map((course) => (
              <div
                key={course._id}
                className="bg-white border border-slate-200/80 hover:border-cyan-500/50 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 shadow-xs hover:shadow-xl group relative h-[28rem]"
              >
                {/* Course Image */}
                <div className="relative h-48 w-full bg-slate-100 flex-shrink-0 group">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x200?text=Course+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <Book className="w-10 h-10 mb-2 opacity-50 text-cyan-600" />
                      <span className="text-sm font-medium text-slate-500">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                    <button
                      onClick={() => viewCourseDetails(course._id)}
                      className="p-3 bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-full transition-transform transform scale-90 group-hover:scale-100 shadow-md"
                      title="View Course Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-5 flex flex-col flex-grow relative">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors mb-2 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {course.description || "No description available"}
                  </p>

                  <div className="space-y-2 mb-12">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-medium">Teacher:</span>
                      <span className="text-slate-800 font-semibold">
                        {course.teacher ? course.teacher.name : "No teacher assigned"}
                      </span>
                    </div>

                    {course?.category && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-medium">Category:</span>
                        <span className="text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full text-xs font-bold border border-cyan-200/80">
                          {course.category}
                        </span>
                      </div>
                    )}

                    {course?.level && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-medium">Level:</span>
                        <span className="text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full text-xs font-bold border border-teal-200/80">
                          {course.level}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-medium">Chapters:</span>
                      <span className="text-slate-800 font-semibold">
                        {course?.chapters ? course.chapters.length : 0} chapters
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <Link
                      to={`/teacher/courses/${course._id}`}
                      className="block w-full text-center px-4 py-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-sm border border-cyan-200/80 transition-all active:scale-95 shadow-xs"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200/80 rounded-3xl text-center shadow-xs">
            <BookX className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
            <p className="text-slate-500">There are currently no courses in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourses;
