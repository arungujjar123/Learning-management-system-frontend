import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ShoppingCart } from "lucide-react";

const getToken = () => {
  return localStorage.getItem('token') || '';
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllCourses = async () => {
    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const response = await fetch(`${backendUrl}/student/courses`);
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
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const token = getToken();
      const res = await fetch(`${backendUrl}/cart/add/${courseId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
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

  useEffect(() => {
    getAllCourses();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-1">Explore</p>
          <h1 className="text-3xl font-extrabold text-white">Available Courses</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center bg-slate-900/60 border border-slate-800 rounded-3xl text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No courses available</h3>
                <p className="text-slate-400">Check back later for new courses!</p>
              </div>
            ) : (
              courses.map((course) => (
                <div key={course._id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all flex flex-col group hover:-translate-y-1">
                  <Link
                    to={`/student/courses/${course._id}`}
                    className="block relative h-48 overflow-hidden bg-slate-800"
                  >
                    {course.image ? (
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <BookOpen className="w-8 h-8" />
                      </div>
                    )}
                  </Link>

                  <div className="p-6 flex flex-col flex-1">
                    <Link to={`/student/courses/${course._id}`}>
                      <h2 className="text-lg font-bold text-white line-clamp-1 mb-2 hover:text-violet-400 transition-colors">{course.title}</h2>
                    </Link>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-1">{course.description}</p>
                    
                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Category:</span>
                        <span className="text-slate-300 font-medium">{course.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Level:</span>
                        <span className="text-slate-300 font-medium">{course.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Duration:</span>
                        <span className="text-slate-300 font-medium">{course.duration} hours</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-white">₹{course.price}</span>
                    </div>

                    <button
                      className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-md shadow-violet-600/20 transition-all active:scale-95"
                      onClick={() => handleAddToCart(course._id)}
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                  </div>
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
