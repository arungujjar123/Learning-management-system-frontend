import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBookOpen } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-violet-50 text-violet-600 text-5xl font-black shadow-inner">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
          <p className="text-sm text-slate-500">
            Oops! The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-sm transition-all"
          >
            <FaHome />
            <span>Go Home</span>
          </Link>
          <Link
            to="/courses"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
          >
            <FaBookOpen />
            <span>Explore Courses</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

