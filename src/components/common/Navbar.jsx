import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  const { logout } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    const updateCartCount = async () => {
      if (!token || role !== "Student") {
        setCartCount(0);
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.success && data.data && data.data.items) {
          setCartCount(data.data.items.length);
        } else {
          setCartCount(0);
        }
      } catch (err) {
        console.error("Error fetching cart count:", err);
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, [token, role, backendUrl]);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 border-b border-slate-200/80 text-slate-900 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link
            to={
              !role
                ? "/"
                : role === "Admin"
                ? "/admin/dashboard"
                : role === "Teacher"
                ? "/teacher/home"
                : "/student/home"
            }
            className="flex items-center gap-2.5 group"
            onClick={closeMenu}
          >
            <img
              src="/image.png"
              alt="SeekhoBharat Logo"
              className="h-9 sm:h-10 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-blue-950 to-cyan-700 bg-clip-text text-transparent tracking-tight">
              SeekhoBharat
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {role === "Teacher" && (
              <Link
                to="/teacher/sidebar/dashboard"
                className="text-sm font-semibold text-slate-700 hover:text-cyan-700 transition-colors"
              >
                Dashboard
              </Link>
            )}
            {role === "Student" && (
              <Link
                to="/student/sidebar/dashboard"
                className="text-sm font-semibold text-slate-700 hover:text-cyan-700 transition-colors"
              >
                Dashboard
              </Link>
            )}

            <Link
              to={
                !token
                  ? "/courses"
                  : role === "Admin"
                  ? "/admin/courses"
                  : role === "Student"
                  ? "/student/courses"
                  : "/teacher/courses"
              }
              className="text-sm font-semibold text-slate-700 hover:text-cyan-700 transition-colors"
            >
              Courses
            </Link>

            {role === "Teacher" && (
              <Link
                to="/teacher/assignments"
                className="text-sm font-semibold text-slate-700 hover:text-cyan-700 transition-colors"
              >
                Assignments
              </Link>
            )}
            {role === "Student" && (
              <Link
                to="/student/assignments"
                className="text-sm font-semibold text-slate-700 hover:text-cyan-700 transition-colors"
              >
                Assignments
              </Link>
            )}

            {token && role === "Student" && (
              <Link
                to="/cart"
                className="relative flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-cyan-700 transition-colors bg-slate-100/80 border border-slate-200 px-3.5 py-1.5 rounded-xl hover:bg-slate-200/60"
              >
                <FaShoppingCart className="text-sm text-cyan-600" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-cyan-600 rounded-full shadow-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {token ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                {role && (
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200/80">
                    {role}
                  </span>
                )}
                <button
                  onClick={() => logout(setIsMenuOpen)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-xl shadow-md shadow-cyan-600/20 transition-all active:scale-95"
              >
                Login / Register
              </Link>
            )}
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fade-in">
          {role === "Teacher" && (
            <Link
              to="/teacher/sidebar/dashboard"
              onClick={closeMenu}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-cyan-700"
            >
              Dashboard
            </Link>
          )}
          {role === "Student" && (
            <Link
              to="/student/sidebar/dashboard"
              onClick={closeMenu}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-cyan-700"
            >
              Dashboard
            </Link>
          )}

          <Link
            to={
              !token
                ? "/courses"
                : role === "Admin"
                ? "/admin/courses"
                : role === "Student"
                ? "/student/courses"
                : "/teacher/courses"
            }
            onClick={closeMenu}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-cyan-700"
          >
            Courses
          </Link>

          {token && role === "Student" && (
            <Link
              to="/cart"
              onClick={closeMenu}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-cyan-700"
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-cyan-600 text-white rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {token ? (
            <button
              onClick={() => logout(setIsMenuOpen)}
              className="w-full text-left px-3 py-2.5 rounded-xl text-base font-semibold text-red-600 hover:bg-slate-100"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="block text-center mt-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600"
            >
              Login / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;