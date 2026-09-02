import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { BookOpen, Users, Star, Loader2 } from "lucide-react";

export default function TeacherDashboard({ teacherId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/teacher/dashboard`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setStats(res.data));
  }, [teacherId]);

  if (!stats) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <h2 className="text-2xl font-extrabold text-slate-900">Teacher Dashboard</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col items-center justify-center">
            <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-full mb-3">
              <BookOpen className="w-6 h-6 text-cyan-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalCourses}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Courses</div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col items-center justify-center">
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-full mb-3">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalStudents}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col items-center justify-center">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-full mb-3">
              <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.avgRating}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Rating</div>
          </div>
        </div>

        {/* Enrollment Chart */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Course Enrollment Overview</h3>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="courseName" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar dataKey="students" fill="#0891b2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs overflow-hidden">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Student Activity</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="px-4 py-3 font-semibold rounded-tl-xl">Student</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold rounded-tr-xl">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivity && stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((a, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4 font-medium text-slate-900">{a.name}</td>
                      <td className="px-4 py-4 text-slate-600">{a.course}</td>
                      <td className="px-4 py-4 text-slate-500">
                        {new Date(a.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-slate-400">
                      No recent activity found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
