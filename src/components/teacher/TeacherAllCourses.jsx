import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BookX, Book } from "lucide-react";

const TeacherAllCourses = () => {
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // "all" or "my"
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchAllCourses() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllCourses(data.data || []);
      } catch (err) {
        console.error("Error fetching all courses:", err);
      }
    }

    async function fetchMyCourses() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/teacher/courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMyCourses(data.data || []);
      } catch (err) {
        console.error("Error fetching my courses:", err);
      }
    }

    fetchAllCourses();
    fetchMyCourses();
  }, [token]);

  const displayedCourses = activeTab === "all" ? allCourses : myCourses;

  return (
    <div className="space-y-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex space-x-2 bg-white border border-slate-200/80 p-1.5 rounded-2xl shadow-xs">
            <button
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Courses
            </button>
            <button
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === "my"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              onClick={() => setActiveTab("my")}
            >
              My Courses
            </button>
          </div>

          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-95"
            onClick={() => navigate("/teacher/courses/add")}
          >
            <Plus className="w-4 h-4" />
            Add New Course
          </button>
        </div>

        {displayedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white border border-slate-200/80 hover:border-cyan-500/50 transition-all duration-300 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl flex flex-col"
              >
                <div className="h-48 w-full bg-slate-100 flex-shrink-0 relative">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <Book className="w-10 h-10 mb-2 opacity-50 text-cyan-600" />
                      <span className="text-sm font-medium text-slate-500">No Image</span>
                    </div>
                  )}
                  {course.price > 0 && (
                    <div className="absolute top-4 right-4 bg-teal-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-xs">
                      ₹{course.price}
                    </div>
                  )}
                  {(!course.price || course.price === 0) && (
                    <div className="absolute top-4 right-4 bg-cyan-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-xs">
                      Free
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{course.title}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                    {course.description || "No description available"}
                  </p>

                  <div className="flex gap-2 mb-6">
                    {course.category && (
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200/80">
                        {course.category}
                      </span>
                    )}
                    {course.level && (
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-teal-50 text-teal-800 border border-teal-200/80">
                        {course.level}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex gap-3">
                    <button
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all"
                      onClick={() => navigate(`/teacher/courses/${course._id}`)}
                    >
                      Details
                    </button>
                    <button
                      className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-sm border border-cyan-200/80 transition-all"
                      onClick={() => navigate(`/teacher/flashcards?courseId=${course._id}`)}
                    >
                      Flashcards
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200/80 rounded-3xl text-center shadow-xs">
            <BookX className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
            <p className="text-slate-500">There are currently no courses in the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAllCourses;
