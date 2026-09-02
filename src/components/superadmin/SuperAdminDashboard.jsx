import React, { useState, useEffect } from 'react';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';

import OverviewTab from './OverviewTab';
import AnalyticsTab from './AnalyticsTab';
import UsersTab from './UsersTab';
import CoursesTab from './CoursesTab';
import DeletedItemsTab from './DeletedItemsTab';

const SuperAdminDashboard = () => {
  const { overview, loading, error, fetchOverview } = useSuperAdmin();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchOverview();
  }, []);

  const renderContent = () => {
    if (loading && !overview) {
      return (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-500">Loading platform metrics...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center space-y-4 shadow-xs">
          <span className="text-4xl">⚠️</span>
          <h3 className="text-xl font-bold text-slate-900">Error Loading Dashboard</h3>
          <p className="text-sm text-slate-500 font-medium">{error}</p>
          <button
            onClick={fetchOverview}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all"
          >
            Retry
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return <OverviewTab overview={overview} />;
      case "analytics":
        return <AnalyticsTab />;
      case "users":
        return <UsersTab />;
      case "courses":
        return <CoursesTab />;
      case "deleted":
        return <DeletedItemsTab />;
      default:
        return <OverviewTab overview={overview} />;
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Executive Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-cyan-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs border border-white/10 text-cyan-300">
            👑 SuperAdmin Executive Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">SuperAdmin Overview</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
            Full platform analytics, revenue shares, system health metrics, and user management oversight
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-2 rounded-2xl border border-slate-800/80 backdrop-blur-xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white shadow-md shadow-cyan-600/20"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "analytics"
                ? "bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white shadow-md shadow-cyan-600/20"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            📈 Analytics
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "users"
                ? "bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white shadow-md shadow-cyan-600/20"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            👥 Users
          </button>
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "courses"
                ? "bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white shadow-md shadow-cyan-600/20"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            📚 Courses
          </button>
          <button
            onClick={() => setActiveTab("deleted")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "deleted"
                ? "bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white shadow-md shadow-cyan-600/20"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            🗑️ Deleted Items
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="space-y-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
