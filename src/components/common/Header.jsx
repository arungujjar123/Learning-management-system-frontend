import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const Header = () => {
  return (
    <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900 py-16 px-4 sm:px-6 lg:px-8 text-center text-white font-sans border-b border-slate-800">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">SeekhoBharat</span>
        </h1>
        <p className="text-sm sm:text-base text-cyan-100 max-w-xl mx-auto">
          Learn anytime, anywhere — curated industry courses for every passionate learner.
        </p>
        <div className="pt-2">
          <Link
            to="/student/courses"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 shadow-lg transition-all active:scale-[0.99]"
          >
            <span>Explore Courses</span>
            <FaArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Header;

