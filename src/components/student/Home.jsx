import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero-banner.png";
import {
  Star,
  Users,
  BookOpen,
  PlayCircle,
  List,
  ArrowRight
} from "lucide-react";

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: "--",
    instructors: "--",
    videos: "--",
    materials: "--",
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);

  const fetchCourses = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      
      let response = await fetch(`${backendUrl}/courses`);
      let data;
      
      if (!response.ok) {
        response = await fetch(`${backendUrl}/student/courses`);
      }
      
      data = await response.json();

      if (data.success) {
        const sortedCourses = data.data.sort((a, b) => {
          const aRating = a.rating?.average || 0;
          const bRating = b.rating?.average || 0;
          return bRating - aRating;
        });
        setCourses(sortedCourses.slice(0, 3));
      } else {
        console.error("Failed to fetch courses:", data.message);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

      let response = await fetch(`${backendUrl}/stats`);
      if (!response.ok) {
        response = await fetch(`${backendUrl}/dashboard/stats`);
      }

      const data = await response.json();

      if (data && (data.success || data.students || data.totalStudents)) {
        const payload = data.data || data;
        setStats({
          students: payload.students || payload.studentCount || payload.totalStudents || "0",
          instructors:
            payload.instructors || payload.teacherCount || payload.totalInstructors || "0",
          videos: payload.videos || payload.videoCount || payload.totalVideos || "0",
          materials:
            payload.materials || payload.materialCount || payload.totalMaterials || "0",
        });
      } else {
        console.error("Failed to fetch stats:", data?.message || data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        {/* --- Hero Section --- */}
        <section className="flex flex-col-reverse md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">Welcome to SeekhoBharat</h1>
            <p className="text-lg text-slate-600">Learn anytime, anywhere — courses for every learner.</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/courses" className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-95">
                Get Started
              </Link>
              <Link to="/courses" className="px-6 py-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-sm border border-cyan-200/80 transition-all shadow-xs">
                Browse all Courses
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src={heroImage}
              alt="Students Learning"
              className="w-full max-w-lg object-contain"
            />
          </div>
        </section>

        {/* --- Stats Bar --- */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex items-center gap-4 hover:border-cyan-500/50 shadow-xs hover:shadow-xl transition-all">
            <div className="p-3 bg-cyan-50 border border-cyan-200/80 rounded-xl text-cyan-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <strong className="block text-xl font-extrabold text-slate-900">{statsLoading ? "..." : stats.students}</strong>
              <span className="text-sm text-slate-500 font-medium">Students</span>
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex items-center gap-4 hover:border-cyan-500/50 shadow-xs hover:shadow-xl transition-all">
            <div className="p-3 bg-teal-50 border border-teal-200/80 rounded-xl text-teal-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <strong className="block text-xl font-extrabold text-slate-900">{statsLoading ? "..." : stats.instructors}</strong>
              <span className="text-sm text-slate-500 font-medium">Instructors</span>
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex items-center gap-4 hover:border-cyan-500/50 shadow-xs hover:shadow-xl transition-all">
            <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-xl text-blue-600">
              <PlayCircle className="w-6 h-6" />
            </div>
            <div>
              <strong className="block text-xl font-extrabold text-slate-900">{statsLoading ? "..." : stats.videos}</strong>
              <span className="text-sm text-slate-500 font-medium">Videos</span>
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex items-center gap-4 hover:border-cyan-500/50 shadow-xs hover:shadow-xl transition-all">
            <div className="p-3 bg-indigo-50 border border-indigo-200/80 rounded-xl text-indigo-600">
              <List className="w-6 h-6" />
            </div>
            <div>
              <strong className="block text-xl font-extrabold text-slate-900">{statsLoading ? "..." : stats.materials}</strong>
              <span className="text-sm text-slate-500 font-medium">Materials</span>
            </div>
          </div>
        </section>

        {/* --- Courses Section --- */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 mb-1">Discover</p>
              <h2 className="text-2xl font-extrabold text-slate-900">Popular Courses</h2>
            </div>
            <Link to="/student/courses" className="text-sm font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-3 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <div key={course._id || index} className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all hover:-translate-y-1 shadow-xs hover:shadow-xl">
                    <img
                      src={
                        course.image ||
                        `https://via.placeholder.com/350x200.png?text=${encodeURIComponent(
                          course.title
                        )}`
                      }
                      alt={course.title}
                      className="w-full h-48 object-cover bg-slate-100"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/350x200.png?text=No+Image")
                      }
                    />

                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" /> 
                        {course.rating?.average || "0"} <span className="text-slate-400 font-medium">({course.rating?.count || "0"} reviews)</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{course.title}</h3>
                      
                      <p className="text-sm text-slate-500">
                        By {course.teacher ? course.teacher.name : "Top Instructor"}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-cyan-600" /> {course.lessons || "12"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-teal-600" /> {course.studentCount || "100+"}
                        </span>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-lg font-extrabold text-cyan-700">
                           {course.price ? `₹${course.price}` : "Free"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-slate-500 bg-white border border-slate-200/80 rounded-3xl shadow-xs">
                  <div className="mx-auto w-12 h-12 bg-cyan-50 rounded-full flex items-center justify-center mb-3 border border-cyan-200">
                    <BookOpen className="w-6 h-6 text-cyan-600" />
                  </div>
                  No courses found.
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;