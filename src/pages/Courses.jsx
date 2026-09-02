import React, { useEffect, useState, useCallback, useRef } from "react";
import CourseCard from "./CourseCard";
import { Search, Filter, X, Sparkles, BookOpen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../features/courses/coursesSlice";

const getToken = () => localStorage.getItem("token") || "";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchParams, setSearchParams] = useState({
    query: "",
    category: "",
    level: "",
  });

  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://learning-management-system-backend-5aet.onrender.com";
  const dispatch = useDispatch();

  const coursesList = useSelector((state) => state.courses.list);
  const isAuthenticated = !!getToken();

  const [ownedCourseIds, setOwnedCourseIds] = useState(() => {
    try {
      const persisted = JSON.parse(localStorage.getItem("enrolledCourseIds") || "[]");
      return new Set(persisted);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const isSearchActive = searchParams.query || searchParams.category || searchParams.level;

  const handleSearch = (e) => {
    const { name, value } = e.target;
    const nextParams = { ...searchParams, [name]: value };
    setSearchParams(nextParams);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    setLoading(true);

    searchTimeout.current = setTimeout(async () => {
      if (!nextParams.query && !nextParams.category && !nextParams.level) {
        setLoading(false);
        setCourses([]);
        return;
      }

      try {
        const queryString = new URLSearchParams(nextParams).toString();
        const response = await fetch(`${backendUrl}/courses/search?${queryString}`);
        const data = await response.json();

        if (data.success) {
          setCourses(data.data);
        } else {
          setCourses([]);
        }
      } catch (error) {
        setCourses([]);
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const clearFilters = () => {
    setSearchParams({ query: "", category: "", level: "" });
    setCourses([]);
  };

  const loadOwnedCourses = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;
      const response = await fetch(`${backendUrl}/student/enrolled-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.success && Array.isArray(data.data)) {
        const ownedIds = data.data.map((course) => course._id);
        setOwnedCourseIds(new Set(ownedIds));
        localStorage.setItem("enrolledCourseIds", JSON.stringify(ownedIds));
      }
    } catch (error) {
      console.error("Error fetching enrolled courses", error);
    }
  }, [backendUrl]);

  useEffect(() => {
    loadOwnedCourses();
  }, [loadOwnedCourses]);

  const handleAddToCart = async (courseId) => {
    const token = getToken();
    if (!token) {
      alert("Please sign in to add courses to your cart");
      return;
    }
    if (ownedCourseIds.has(courseId)) {
      alert("You already own this course");
      return;
    }
    try {
      const res = await fetch(`${backendUrl}/cart/add/${courseId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Added to cart!");
        window.dispatchEvent(new Event("cartUpdated"));
      } else alert(data.message || "Failed to add to cart");
    } catch {
      alert("Error adding to cart");
    }
  };

  const listToRender = isSearchActive ? courses : coursesList;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="text-center sm:text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Course Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Explore All Courses
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
            Expand your knowledge and master high-demand skills with our comprehensive catalog.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              name="query"
              placeholder="Search by title, topic, or keyword..."
              value={searchParams.query}
              onChange={handleSearch}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
              autoComplete="off"
            />
          </div>

          {/* Category Filter */}
          <div className="sm:w-52">
            <select
              name="category"
              value={searchParams.category}
              onChange={handleSearch}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            >
              <option value="">All Categories</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          {/* Level Filter */}
          <div className="sm:w-48">
            <select
              name="level"
              value={searchParams.level}
              onChange={handleSearch}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advance">Advance</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {isSearchActive && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-3 border-cyan-500/30 border-t-cyan-600 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-500">Searching courses...</p>
          </div>
        ) : listToRender.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200/80 rounded-3xl shadow-lg space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No courses found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Try adjusting your search criteria or clearing filters to view available courses.
            </p>
            {isSearchActive && (
              <button
                onClick={clearFilters}
                className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition-all shadow-md shadow-cyan-600/20"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listToRender.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isOwned={isAuthenticated && ownedCourseIds.has(course._id)}
                isAuthenticated={isAuthenticated}
                onAddToCart={() => handleAddToCart(course._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;