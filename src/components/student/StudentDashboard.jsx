import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  FaBook,
  FaFire,
  FaClock,
  FaVideo,
  FaRedo,
  FaArrowRight,
  FaGraduationCap,
  FaCheckCircle,
} from "react-icons/fa";

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const addLearningMinutes = async (minutes) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/student/progress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ minutes }),
        }
      );

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error adding learning minutes:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/student/dashboard`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      if (data.success && data.data) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const enrolledCount = dashboardData?.dashboardStats?.totalEnrolledCourses || 0;
  const currentStreak = dashboardData?.dashboardStats?.currentStreak || 0;
  const totalQuizzesTaken = dashboardData?.dashboardStats?.totalQuizzesTaken || 0;
  const globalQuizAverage = dashboardData?.dashboardStats?.globalQuizAverage || 0;
  const highestQuizScore = dashboardData?.dashboardStats?.highestQuizScore || 0;
  const studentName = dashboardData?.studentInfo?.name || "Student";
  const studentEmail = dashboardData?.studentInfo?.email || "student@seekhobharat.in";

  const formattedProgressData =
    dashboardData?.studentProgress?.length > 0
      ? dashboardData.studentProgress.map((data) => ({
          day: new Date(data.date).toLocaleDateString("en-us", {
            weekday: "short",
          }),
          minutes: data.minutes || 0,
        }))
      : (() => {
          const fallbackData = [];
          const today = new Date();
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            fallbackData.push({
              day: date.toLocaleDateString("en-us", { weekday: "short" }),
              minutes: 0,
            });
          }
          return fallbackData;
        })();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading student dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs">
            <span>Welcome back</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {studentName}!
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100">
            Track your course progress, learning streak, and test scores
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold backdrop-blur-xs transition-all"
        >
          <FaRedo size={11} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl shrink-0">
            <FaBook />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Enrolled Courses</p>
            <h3 className="text-2xl font-black text-slate-900">{enrolledCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl shrink-0">
            <FaFire />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Current Streak</p>
            <h3 className="text-2xl font-black text-slate-900">{currentStreak} Days</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl shrink-0">
            <FaClock />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Weekly Minutes</p>
            <h3 className="text-2xl font-black text-slate-900">
              {dashboardData?.dashboardStats?.totalWeeklyMinutes || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
            <FaVideo />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Completed Topics</p>
            <h3 className="text-2xl font-black text-slate-900">
              {dashboardData?.dashboardStats?.totalCompletedTopics || 0}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Section (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Learning Progress Chart Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Weekly Study Time</h3>
                <p className="text-xs text-slate-400">Minutes spent learning per day</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Quiz Avg: </span>
                  <strong className="text-slate-900 font-bold">{globalQuizAverage}%</strong>
                </div>
                <div>
                  <span className="text-slate-400">Best Score: </span>
                  <strong className="text-teal-600 font-bold">{highestQuizScore}%</strong>
                </div>
              </div>
            </div>

            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedProgressData}>
                  <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="minutes" fill="#0891b2" radius={[6, 6, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enrolled Courses Preview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Enrolled Courses</h3>
              <Link
                to="/student/sidebar/courses"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 hover:text-cyan-700"
              >
                <span>View All</span>
                <FaArrowRight size={11} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dashboardData?.enrolledCourses?.length > 0 ? (
                dashboardData.enrolledCourses.slice(0, 4).map((item) => (
                  <Link
                    to={`/student/courses/${item.course._id}`}
                    key={item.course._id}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-cyan-200 bg-slate-50/50 hover:bg-cyan-50/30 transition-all flex items-center gap-4 group"
                  >
                    <img
                      src={
                        item.course.image ||
                        `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60`
                      }
                      alt={item.course.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-cyan-600 transition-colors truncate">
                        {item.course.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {item.completedTopics || 0}/{item.totalTopics || 0} topics completed
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-xs text-slate-400">
                  No courses enrolled yet.{" "}
                  <Link to="/courses" className="text-cyan-600 font-bold">
                    Browse courses
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Overview Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-blue-600 text-white text-2xl font-bold flex items-center justify-center mx-auto shadow-md">
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{studentName}</h3>
              <p className="text-xs text-slate-500">{studentEmail}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
              <div>
                <strong className="text-base font-black text-slate-900">{enrolledCount}</strong>
                <p className="text-[11px] text-slate-400">Courses</p>
              </div>
              <div>
                <strong className="text-base font-black text-amber-500">{currentStreak}d</strong>
                <p className="text-[11px] text-slate-400">Streak</p>
              </div>
              <div>
                <strong className="text-base font-black text-cyan-600">{totalQuizzesTaken}</strong>
                <p className="text-[11px] text-slate-400">Quizzes</p>
              </div>
            </div>
          </div>

          {/* Quick Study Goal Booster Card */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg text-cyan-300">
                <FaGraduationCap />
              </div>
              <div>
                <h4 className="text-sm font-bold">Daily Study Goal</h4>
                <p className="text-xs text-cyan-100">Boost your daily learning streak</p>
              </div>
            </div>
            <button
              onClick={() => addLearningMinutes(15)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-sm transition-all"
            >
              + Log 15 Mins Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;