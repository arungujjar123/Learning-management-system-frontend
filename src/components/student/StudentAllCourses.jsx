import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../../pages/CourseCard";
import { Search, ChevronDown, BookOpen } from "lucide-react";

const getToken = () => {
  return localStorage.getItem("token") || "";
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchParams, setSearchParams] = useState({
    query: '',
    category: '',
    level: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));

    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const queryString = new URLSearchParams({
        ...searchParams,
        [name]: value
      }).toString();

      const response = await fetch(`${backendUrl}/courses/search?${queryString}`);
      const data = await response.json();

      if (data.success) {
        setCourses(data.data);
      } else {
        console.error("Error searching courses:", data.message);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllCourses = async () => {
    try {
      setLoading(true);
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const response = await fetch(`${backendUrl}/courses`);
      const coursesResponse = await response.json();

      if (coursesResponse.success) {
        setCourses(coursesResponse.data);
      } else {
        console.error("Error fetching courses:", coursesResponse.message);
      }
    } catch (error) {
      console.log("error occurred", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (courseId) => {
    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const token = getToken();
      const res = await fetch(`${backendUrl}/cart/add/${courseId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Added to cart!");
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      alert("Error adding to cart");
    }
  };

  const handleFlashcardClick = (courseId) => {
    const token = getToken();
    if (!token) {
      alert("Please sign in to view flashcards");
      return;
    }
    window.location.href = `/courses/${courseId}/flashcards`;
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  return (
    <div className="space-y-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-700">Discover</p>
          <h1 className="text-3xl font-extrabold text-slate-900">All Courses</h1>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-4 flex flex-col md:flex-row gap-4 shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              name="query"
              placeholder="Search courses..." 
              value={searchParams.query}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition-all"
            />
          </div>
          <div className="relative w-full md:w-48">
            <select 
              name="category" 
              value={searchParams.category}
              onChange={handleSearch}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm appearance-none cursor-pointer transition-all"
            >
              <option value="">All Categories</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Marketing">Marketing</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative w-full md:w-48">
            <select 
              name="level" 
              value={searchParams.level}
              onChange={handleSearch}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm appearance-none cursor-pointer transition-all"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advance">Advance</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-3 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-500 bg-white border border-slate-200/80 rounded-3xl shadow-xs">
                <BookOpen className="w-12 h-12 text-slate-300 mb-4" />
                <p className="font-medium">No courses available matching your search.</p>
              </div>
            ) : (
              courses.map((course) => (
                <div key={course._id} className="h-full">
                  <CourseCard
                    course={course}
                    onAddToCart={() => handleAddToCart(course._id)}
                    onFlashcardClick={handleFlashcardClick}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
