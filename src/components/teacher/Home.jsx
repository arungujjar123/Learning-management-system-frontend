import React from "react";
import { Link } from "react-router-dom";
import TeacherVerificationStatus from "./TeacherVerificationStatus";
import { BookOpen, MonitorPlay, Smartphone } from "lucide-react";

function Home() {
  return (
    <div className="space-y-8 font-sans">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900 text-white rounded-3xl p-8 text-center max-w-4xl mx-auto shadow-xl border border-slate-800/80 relative overflow-hidden">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Welcome to SeekhoBharat</h2>
        <p className="text-cyan-100/90 mb-8 max-w-2xl mx-auto text-sm sm:text-base">Learn anytime, anywhere with our comprehensive course catalog.</p>
        <Link to="/teacher/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-500/20 transition-all active:scale-95">
          Explore Courses
        </Link>
      </header>

      {/* Verification Status Widget */}
      <section className="max-w-4xl mx-auto">
        <TeacherVerificationStatus />
      </section>

      {/* Courses Preview */}
      <section className="max-w-7xl mx-auto">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-700 block mb-1">Preview</span>
          <h2 className="text-2xl font-extrabold text-slate-900">Popular Courses</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 hover:border-cyan-500/50 transition-all duration-300 rounded-3xl p-6 shadow-xs hover:shadow-xl group">
            <div className="w-full h-40 bg-slate-50 border border-slate-200/80 rounded-2xl mb-4 flex items-center justify-center group-hover:bg-cyan-50/50 transition-colors">
              <MonitorPlay className="w-12 h-12 text-cyan-600" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg mb-2 group-hover:text-cyan-700 transition-colors">Web Development</h3>
            <p className="text-slate-500 text-sm">Learn HTML, CSS, JavaScript and React.</p>
          </div>
          <div className="bg-white border border-slate-200/80 hover:border-cyan-500/50 transition-all duration-300 rounded-3xl p-6 shadow-xs hover:shadow-xl group">
            <div className="w-full h-40 bg-slate-50 border border-slate-200/80 rounded-2xl mb-4 flex items-center justify-center group-hover:bg-cyan-50/50 transition-colors">
              <BookOpen className="w-12 h-12 text-cyan-600" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg mb-2 group-hover:text-cyan-700 transition-colors">Data Science</h3>
            <p className="text-slate-500 text-sm">Learn Python, Pandas, ML and AI basics.</p>
          </div>
          <div className="bg-white border border-slate-200/80 hover:border-cyan-500/50 transition-all duration-300 rounded-3xl p-6 shadow-xs hover:shadow-xl group">
            <div className="w-full h-40 bg-slate-50 border border-slate-200/80 rounded-2xl mb-4 flex items-center justify-center group-hover:bg-cyan-50/50 transition-colors">
              <Smartphone className="w-12 h-12 text-cyan-600" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg mb-2 group-hover:text-cyan-700 transition-colors">Mobile Development</h3>
            <p className="text-slate-500 text-sm">Learn Flutter & React Native for apps.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
