import React from "react";
import {
  Users,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  BookOpen,
  DollarSign,
  Building2,
  TrendingUp,
  Trash2,
  Clock,
  Sparkles,
} from "lucide-react";

const OverviewTab = ({ overview }) => {
  if (!overview) return null;

  const { users, courses, revenue, recentActivity } = overview;

  return (
    <div className="space-y-8 font-sans">
      {/* Top Metrics Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-600" />
          Platform Overview Metrics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Users */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-xl hover:border-cyan-500/50 transition-all flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{users.total}</div>
              <span className="text-xs text-slate-500 font-medium">
                {users.students} students, {users.teachers} teachers
              </span>
            </div>
          </div>

          {/* Active Students */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-xl hover:border-cyan-500/50 transition-all flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Students</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{users.students}</div>
              <span className="text-xs text-slate-500 font-medium">Active learners</span>
            </div>
          </div>

          {/* Teachers */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-xl hover:border-cyan-500/50 transition-all flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Teachers</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{users.teachers}</div>
              <span className="text-xs text-slate-500 font-medium">Course creators</span>
            </div>
          </div>

          {/* Admins */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-xl hover:border-cyan-500/50 transition-all flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Admins</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{users.admins}</div>
              <span className="text-xs text-slate-500 font-medium">Platform managers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial & Course Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Revenue Card */}
        <div className="bg-gradient-to-br from-cyan-600 via-teal-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-100">Financial Revenue</span>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold">₹{(revenue.total || 0).toLocaleString()}</div>
            <p className="text-xs text-cyan-100 font-medium mt-1">Total revenue from {revenue.completedOrders || 0} completed orders</p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-100 block">Platform Share (30%)</span>
              <span className="text-lg font-bold">₹{(revenue.platformRevenue || 0).toLocaleString()}</span>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-100 block">Teacher Share (70%)</span>
              <span className="text-lg font-bold">₹{(revenue.teacherRevenue || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Courses & Orders */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Curriculum & Enrollments</span>
            <BookOpen className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Total Active Courses</span>
              <span className="text-2xl font-extrabold text-slate-900">{courses.total}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Total Orders</span>
              <span className="text-2xl font-extrabold text-slate-900">{revenue.totalOrders}</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 font-medium">
            Status breakdown: <strong className="text-slate-900">{revenue.completedOrders} completed</strong>, {revenue.pendingOrders} pending
          </div>
        </div>

        {/* System Archives */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">System Archives</span>
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Soft-Deleted Items</span>
            <span className="text-2xl font-extrabold text-slate-900">{users.deleted + courses.deleted}</span>
          </div>
          <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-700 font-medium">
            Archived data: <strong className="text-red-900">{users.deleted} users</strong>, {courses.deleted} courses available for restoration
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Clock className="w-4 h-4 text-cyan-600" />
          Recent Activity (Last 7 Days)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Students</span>
              <div className="text-xl font-extrabold text-slate-900">{recentActivity.newStudents}</div>
              <span className="text-xs text-slate-500 font-medium">Joined recently</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Courses</span>
              <div className="text-xl font-extrabold text-slate-900">{recentActivity.newCourses}</div>
              <span className="text-xs text-slate-500 font-medium">Published recently</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Orders</span>
              <div className="text-xl font-extrabold text-slate-900">{recentActivity.newOrders}</div>
              <span className="text-xs text-slate-500 font-medium">Placed recently</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
