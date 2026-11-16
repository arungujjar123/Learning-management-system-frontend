import React, { useState, useEffect } from "react";
import { useSuperAdmin } from "../../contexts/SuperAdminContext";
import {
  ComposedChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, DollarSign, Users, Award, BookOpen } from "lucide-react";

const COLORS = ["#0284c7", "#0d9488", "#2563eb", "#7c3aed", "#d97706"];

const AnalyticsTab = () => {
  const {
    fetchRevenueAnalytics,
    fetchUserGrowth,
    fetchTeacherPerformance,
    fetchCoursePerformance,
    fetchEnrollmentTrends,
  } = useSuperAdmin();

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);
  const [analytics, setAnalytics] = useState({
    revenue: null,
    userGrowth: null,
    teacherPerformance: null,
    coursePerformance: null,
    enrollmentTrends: null,
  });

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [revenue, userGrowth, teachers, courses, enrollment] = await Promise.all([
        fetchRevenueAnalytics().catch(() => ({ data: null })),
        fetchUserGrowth(period).catch(() => ({ data: null })),
        fetchTeacherPerformance().catch(() => ({ data: null })),
        fetchCoursePerformance().catch(() => ({ data: null })),
        fetchEnrollmentTrends(period).catch(() => ({ data: null })),
      ]);

      setAnalytics({
        revenue: revenue?.data || null,
        userGrowth: userGrowth?.data || null,
        teacherPerformance: teachers?.data || [],
        coursePerformance: courses?.data || [],
        enrollmentTrends: enrollment?.data || null,
      });
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const bucketLabel = analytics.enrollmentTrends?.unit === "week" ? "Weekly" : "Daily";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Generating analytics reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-cyan-600" />
            Executive Platform Analytics
          </h2>
          <p className="text-xs text-slate-500 font-medium">Revenue from completed orders, student sign-ups and enrollments over the selected period</p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200/80 text-sm font-bold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      {/* Revenue Split Card */}
      {analytics.revenue && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Revenue Breakdown & Category Shares
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200/80">
              <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider block mb-1">Total Gross Revenue</span>
              <div className="text-2xl font-extrabold text-slate-900">₹{(analytics.revenue.totalRevenue || 0).toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">Platform Share (30%)</span>
              <div className="text-2xl font-extrabold text-slate-900">₹{(analytics.revenue.platformRevenue || 0).toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/80">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block mb-1">Teachers Share (70%)</span>
              <div className="text-2xl font-extrabold text-slate-900">₹{(analytics.revenue.teacherRevenue || 0).toLocaleString()}</div>
            </div>
          </div>

          {analytics.revenue.revenueByCategory && analytics.revenue.revenueByCategory.length > 0 && (
            <div className="pt-4">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.revenue.revenueByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="_id" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="platformRevenue" fill="#0d9488" name="Platform Share (30%)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="teacherRevenue" fill="#0284c7" name="Teacher Share (70%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        {analytics.userGrowth?.studentGrowth && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Users className="w-5 h-5 text-cyan-600" />
              Student Growth Velocity
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={analytics.userGrowth.studentGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="_id" stroke="#64748b" fontSize={12} minTickGap={16} />
                <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                <YAxis yAxisId="new" orientation="right" stroke="#64748b" fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#0284c7" strokeWidth={3} name="Total Students" dot={false} />
                <Bar yAxisId="new" dataKey="newStudents" fill="#0d9488" name="New Sign-ups" radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Enrollment Trends */}
        {analytics.enrollmentTrends?.dailyTrends && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              {bucketLabel} Enrollment & Revenue Trends
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              {/* Revenue (₹) and enrollments (count) use separate axes so neither line is flattened */}
              <ComposedChart data={analytics.enrollmentTrends.dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="_id" stroke="#64748b" fontSize={12} minTickGap={16} />
                <YAxis yAxisId="count" stroke="#64748b" fontSize={12} allowDecimals={false} />
                <YAxis
                  yAxisId="revenue"
                  orientation="right"
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(v) => `₹${v.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value, name) => (name === "Revenue" ? `₹${value.toLocaleString()}` : value)}
                />
                <Legend />
                <Bar yAxisId="count" dataKey="enrollments" fill="#0d9488" name="Enrollments" radius={[4, 4, 0, 0]} />
                <Line yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} name="Revenue" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Category Enrollments Pie Chart */}
      {analytics.enrollmentTrends?.categoryEnrollments && analytics.enrollmentTrends.categoryEnrollments.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <BookOpen className="w-5 h-5 text-cyan-600" />
            Enrollments by Category (all time)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={analytics.enrollmentTrends.categoryEnrollments}
                cx="50%"
                cy="50%"
                label={({ _id, enrollments }) => `${_id}: ${enrollments}`}
                outerRadius={90}
                dataKey="enrollments"
              >
                {analytics.enrollmentTrends.categoryEnrollments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Teachers */}
      {Array.isArray(analytics.teacherPerformance) && analytics.teacherPerformance.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Top Educator Revenue Performers
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Teacher</th>
                  <th className="p-4">Courses</th>
                  <th className="p-4">Total Students</th>
                  <th className="p-4">Gross Revenue</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {analytics.teacherPerformance.slice(0, 10).map((teacher) => (
                  <tr key={teacher.teacherId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{teacher.name}</td>
                    <td className="p-4 text-slate-600">{teacher.totalCourses}</td>
                    <td className="p-4 text-slate-600">{teacher.totalStudents}</td>
                    <td className="p-4 font-bold text-emerald-700">₹{(teacher.totalRevenue || 0).toLocaleString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          teacher.verificationStatus === "Verified"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {teacher.verificationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsTab;
