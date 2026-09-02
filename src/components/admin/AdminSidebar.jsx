import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import {
  FaChartPie,
  FaUsers,
  FaBook,
  FaFire,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const getDashboardPath = () => {
    if (role === "SuperAdmin") return "/superadmin";
    if (role === "Admin") return "/admin/dashboard";
    if (role === "Teacher") return "/teacher/sidebar/dashboard";
    return "/student/sidebar/dashboard";
  };

  const getCoursesPath = () => {
    if (role === "Admin" || role === "SuperAdmin") return "/admin/courses";
    if (role === "Teacher") return "/teacher/sidebar/courses";
    return "/student/sidebar/courses";
  };

  const getProfilePath = () => {
    if (role === "Admin" || role === "SuperAdmin") return "/admin/profile";
    if (role === "Teacher") return "/teacher/sidebar/profile";
    return "/student/sidebar/profile";
  };

  const getSettingsPath = () => {
    if (role === "Admin" || role === "SuperAdmin") return "/admin/settings";
    if (role === "Teacher") return "/teacher/sidebar/settings";
    return "/student/sidebar/settings";
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? "bg-cyan-50 text-cyan-800 font-semibold border border-cyan-200/80 shadow-xs"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 font-sans">
      <Navbar />

      <div className="flex-1 flex relative">
        {/* Mobile Toggle Button */}
        <div className="md:hidden fixed bottom-6 right-6 z-40">
          <button
            onClick={toggleSidebar}
            className="w-12 h-12 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-lg hover:bg-cyan-700 transition-all"
            aria-label="Toggle Sidebar"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:sticky top-16 inset-y-0 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          {/* Navigation Links */}
          <div className="space-y-6">
            <div className="px-3 pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {role ? `${role} Portal` : "Menu"}
              </span>
            </div>

            <nav className="space-y-1.5">
              <NavLink
                to={getDashboardPath()}
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <FaChartPie className="text-base text-cyan-600" />
                <span>Dashboard</span>
              </NavLink>

              {(role === "Admin" || role === "SuperAdmin" || role === "Teacher") && (
                <NavLink
                  to={
                    role === "Admin" || role === "SuperAdmin"
                      ? "/admin/users"
                      : "/teacher/sidebar/users"
                  }
                  className={navLinkClass}
                  onClick={closeSidebar}
                >
                  <FaUsers className="text-base text-cyan-600" />
                  <span>{role === "Admin" || role === "SuperAdmin" ? "All Users" : "My Students"}</span>
                </NavLink>
              )}

              {(role === "Admin" || role === "SuperAdmin") && (
                <NavLink
                  to="/admin/deleted-members"
                  className={navLinkClass}
                  onClick={closeSidebar}
                >
                  <FaTrashAlt className="text-base text-slate-400" />
                  <span>Deleted Members</span>
                </NavLink>
              )}

              <NavLink
                to={getCoursesPath()}
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <FaBook className="text-base text-cyan-600" />
                <span>{role === "Student" ? "My Courses" : "Courses"}</span>
              </NavLink>

              {role === "Student" && (
                <NavLink
                  to="/student/sidebar/streak"
                  className={navLinkClass}
                  onClick={closeSidebar}
                >
                  <FaFire className="text-base text-amber-500" />
                  <span>Streak & Stats</span>
                </NavLink>
              )}

              <div className="pt-4 mt-4 border-t border-slate-100">
                <span className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Account
                </span>
              </div>

              <NavLink
                to={getProfilePath()}
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <FaUser className="text-base text-slate-400" />
                <span>Profile</span>
              </NavLink>

              <NavLink
                to={getSettingsPath()}
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <FaCog className="text-base text-slate-400" />
                <span>Settings</span>
              </NavLink>
            </nav>
          </div>

          {/* Logout Section */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
            >
              <FaSignOutAlt className="text-base" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminSidebar;

