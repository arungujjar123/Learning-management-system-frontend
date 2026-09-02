import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaFacebook, FaLinkedin, FaEnvelope, FaPhone, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/image.png"
                alt="SeekhoBharat Logo"
                className="w-9 h-9 rounded-xl object-cover shadow-md"
              />
              <span className="text-xl font-black text-white tracking-tight">
                SeekhoBharat
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering ambitious learners across India with high-impact tech skills, interactive assessments, and real-world project portfolios.
            </p>
            <p className="text-xs text-slate-500 pt-2">
              © {new Date().getFullYear()} SeekhoBharat LMS. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-cyan-400 transition-colors">
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-cyan-400 transition-colors">
                  Student & Teacher Auth
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Popular Tracks
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/courses" className="hover:text-cyan-400 transition-colors">
                  Fullstack Web Development
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-cyan-400 transition-colors">
                  Artificial Intelligence & ML
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-cyan-400 transition-colors">
                  Mobile App Development
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-cyan-400 transition-colors">
                  Cloud & DevOps Engineering
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Get In Touch
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <FaEnvelope className="text-cyan-400" />
                <span>support@seekhobharat.in</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaPhone className="text-cyan-400" />
                <span>+91 98765 43210</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
              >
                <FaTwitter size={13} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
              >
                <FaFacebook size={13} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
              >
                <FaLinkedin size={13} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
              >
                <FaGithub size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
