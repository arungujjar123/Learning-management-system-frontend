import React, { useEffect, useState } from "react";
import { FaFire, FaCalendarCheck, FaTrophy, FaCalendarAlt, FaClock } from "react-icons/fa";

const Streak = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const token = localStorage.getItem("token");

    async function load() {
      try {
        const res = await fetch(`${backendUrl}/student/streak`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setStats(json.data);
      } catch (err) {
        console.error("Failed to load streak stats", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading your streak data...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm">
        No streak data available.
      </div>
    );
  }

  const formatDate = (iso) => {
    if (!iso) return "No recent activity";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Learning Streak & Activity
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Consistency is key to mastery. Keep learning every single day!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-violet-600">
            <FaCalendarCheck size={20} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900">{stats.activeDays || 0}</h3>
          <p className="text-xs font-semibold text-slate-500">Days Active</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-indigo-600">
            <FaCalendarAlt size={20} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quiz</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900">{stats.quizDays || 0}</h3>
          <p className="text-xs font-semibold text-slate-500">Days with Quizzes</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl p-6 shadow-md shadow-amber-500/15 space-y-2">
          <div className="flex items-center justify-between text-amber-100">
            <FaFire size={22} />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">Current</span>
          </div>
          <h3 className="text-3xl font-black text-white">{stats.currentStreak || 0} Days</h3>
          <p className="text-xs font-semibold text-amber-100">Current Streak</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <FaTrophy size={20} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Record</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900">{stats.bestStreak || 0} Days</h3>
          <p className="text-xs font-semibold text-slate-500">Best Streak</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-xl shrink-0">
          <FaClock />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">Last Activity Recorded</h3>
          <p className="text-sm font-semibold text-violet-700">{formatDate(stats.lastActiveDate)}</p>
          <p className="text-xs text-slate-500 pt-1">
            Complete at least one lesson or quiz today before midnight to continue advancing your daily streak.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Streak;

