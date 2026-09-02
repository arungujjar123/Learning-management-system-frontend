import React from "react";
import { Link } from "react-router-dom";
import { Star, Users, ShoppingCart, Play, Eye } from "lucide-react";

const CourseCard = ({ course, onAddToCart, isOwned = false, isAuthenticated = false }) => {
  const ratingAverage = course && typeof course.rating === "object" ? course.rating.average : course.rating || 4.8;
  const ratingCount = course && typeof course.rating === "object" ? course.rating.count : (course.ratingCount || 120);
  const studentCount = course.students?.length || course.studentCount || "150+";

  return (
    <div className="bg-white border border-slate-200/80 hover:border-cyan-500/50 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Thumbnail Container */}
        <Link to={`/courses/${course._id}`} className="relative block aspect-video overflow-hidden bg-slate-100">
          <img
            src={
              course.image ||
              `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60`
            }
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              if (e && e.target) {
                e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60";
              }
            }}
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-cyan-800 border border-cyan-200/80 shadow-xs">
            {course.category || "General"}
          </div>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-teal-800 border border-teal-200/80 shadow-xs">
            {course.level || "All Levels"}
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-6 space-y-4">
          {/* Rating & Students */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 font-semibold">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="font-bold text-slate-900">{ratingAverage}</span>
              <span className="text-slate-400">({ratingCount})</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-slate-500">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{studentCount} learners</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/courses/${course._id}`}>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors line-clamp-2 leading-snug">
              {course.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500">
            Mentor: <strong className="text-slate-700">{course.teacher?.name || "Expert Mentor"}</strong>
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
        <span className="text-2xl font-black text-slate-900">
          {course.price ? `₹${course.price}` : "Free"}
        </span>

        {isOwned && isAuthenticated ? (
          <Link
            to={`/student/courses/${course._id}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Continue</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to={`/courses/${course._id}`}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={onAddToCart}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-md shadow-cyan-600/20 transition-all active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;