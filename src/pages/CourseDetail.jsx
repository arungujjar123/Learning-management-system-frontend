import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { getRatingDisplay } from "../helper/rating";
import {
  FaStar,
  FaPlay,
  FaFileAlt,
  FaLock,
  FaCheck,
  FaChalkboardTeacher,
  FaChevronRight,
  FaShoppingCart,
  FaBookOpen,
  FaClock,
  FaGraduationCap,
} from "react-icons/fa";

const CourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [isEnroll, setIsEnroll] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function getStudentProfile() {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://learning-management-system-backend-5aet.onrender.com";
        const response = await fetch(
          `${backendUrl}/student/profile`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.success && data.data) {
          setStudentId(data.data._id);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    getStudentProfile();
  }, []);

  useEffect(() => {
    async function getCourseById() {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://learning-management-system-backend-5aet.onrender.com";
        const response = await fetch(`${backendUrl}/courses`);
        const coursesResponse = await response.json();

        if (coursesResponse.success && coursesResponse.data) {
          const foundCourse = coursesResponse.data.find(
            (c) => c._id === courseId
          );
          if (foundCourse) {
            setCourse(foundCourse);
          }
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    }

    if (courseId) {
      getCourseById();
    }
  }, [courseId]);

  useEffect(() => {
    if (course?.students && studentId) {
      const isStudentEnrolled = course.students.some(
        (student) => (typeof student === "string" ? student : student._id) === studentId
      );
      setIsEnroll(isStudentEnrolled);
    }
  }, [course, studentId]);

  const handleEnroll = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(`/login?next=${encodeURIComponent(`/courses/${courseId}`)}`);
      return;
    }

    if (!course) return;

    try {
      await dispatch(addToCart(course._id)).unwrap();
      alert("Course added to cart successfully!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      alert(error || "Course is already in cart or failed to add");
    }
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading course details...</p>
        </div>
      </div>
    );
  }

  const rating = getRatingDisplay(course.rating);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-violet-600 transition-colors">Home</Link>
        <FaChevronRight size={10} className="text-slate-300" />
        <Link to="/courses" className="hover:text-violet-600 transition-colors">Courses</Link>
        <FaChevronRight size={10} className="text-slate-300" />
        <span className="text-slate-800 line-clamp-1">{course.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Main Content (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 border border-violet-400/30 text-violet-200">
                {course.category || "General"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 border border-indigo-400/30 text-indigo-200">
                {course.level || "All Levels"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <FaStar className="text-amber-400" />
                <span className="font-bold text-white text-sm">{rating.label}</span>
                <span>({rating.countLabel})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaChalkboardTeacher className="text-violet-400" />
                <span>Instructor: <strong className="text-white">{course.teacher?.name || "Verified Expert"}</strong></span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div>
            <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
              {[
                { key: "description", label: "Description" },
                { key: "content", label: "Curriculum" },
                { key: "teacher", label: "Instructor" },
                { key: "reviews", label: "Reviews" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3.5 transition-all relative ${
                    activeTab === tab.key
                      ? "text-violet-600 border-b-2 border-violet-600"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="pt-6">
              {/* Description Tab */}
              {activeTab === "description" && (
                <div className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">About This Course</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{course.description}</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">What You'll Learn</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <FaCheck className="text-emerald-500 mt-1 shrink-0" />
                        <span>Core foundational principles of {course.category}</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <FaCheck className="text-emerald-500 mt-1 shrink-0" />
                        <span>Practical industry-standard project workflows</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <FaCheck className="text-emerald-500 mt-1 shrink-0" />
                        <span>Hands-on quizzes and self-assessment checks</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <FaCheck className="text-emerald-500 mt-1 shrink-0" />
                        <span>Certificate of completion upon finishing all chapters</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Curriculum Tab */}
              {activeTab === "content" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-base font-bold text-slate-900">Course Chapters</h3>
                    <span className="text-xs font-semibold text-slate-500">
                      {course.chapters?.length || 0} Chapters Total
                    </span>
                  </div>

                  {course.chapters && course.chapters.length > 0 ? (
                    <div className="space-y-3">
                      {course.chapters.map((chapter, index) => (
                        <div
                          key={chapter._id || index}
                          className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
                        >
                          <div className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-800">
                              Chapter {index + 1}: {chapter.title}
                            </h4>
                            <span className="text-xs font-medium text-slate-500">
                              {chapter.topics?.length || 0} lessons
                            </span>
                          </div>

                          <div className="divide-y divide-slate-100">
                            {chapter.topics &&
                              chapter.topics.map((topic, tIdx) => (
                                <div
                                  key={topic._id || tIdx}
                                  className="px-5 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-xs sm:text-sm"
                                >
                                  <div className="flex items-center gap-3 text-slate-700">
                                    <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center text-xs">
                                      {topic.video ? <FaPlay size={10} /> : <FaFileAlt size={10} />}
                                    </div>
                                    <span className="font-medium">{topic.title}</span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {topic.quiz && topic.quiz.length > 0 && (
                                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200">
                                        Quiz
                                      </span>
                                    )}
                                    {!isEnroll && (
                                      <FaLock className="text-slate-300 text-xs" />
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
                      Curriculum content will be updated soon.
                    </div>
                  )}
                </div>
              )}

              {/* Teacher Tab */}
              {activeTab === "teacher" && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">About the Instructor</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                      {course.teacher?.name ? course.teacher.name.charAt(0).toUpperCase() : "T"}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {course.teacher?.name || "Verified Instructor"}
                      </h4>
                      <p className="text-xs text-slate-500">{course.teacher?.email || "mentor@seekhobharat.in"}</p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700">
                        Top Instructor
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                  <h3 className="text-lg font-bold text-slate-900">Student Reviews</h3>
                  {course.ratings && course.ratings.length > 0 ? (
                    <div className="space-y-4 divide-y divide-slate-100">
                      {course.ratings.map((rev, idx) => (
                        <div key={rev._id || idx} className="pt-4 first:pt-0 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-800">Learner</span>
                            <div className="flex items-center gap-1 text-xs text-amber-400">
                              <FaStar />
                              <span className="font-bold text-slate-700">{rev.rating || 5}</span>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600">{rev.review}</p>
                          <p className="text-[11px] text-slate-400">
                            {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No reviews submitted yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar Card (4 cols) */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
            {/* Thumbnail */}
            <div className="relative aspect-video bg-slate-900 overflow-hidden">
              <img
                src={
                  course.image ||
                  `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60`
                }
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 space-y-6">
              {/* Price */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-slate-900">
                    {course.price ? `₹${course.price}` : "Free"}
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Instant Access
                </span>
              </div>

              {/* CTAs */}
              {isEnroll ? (
                <Link
                  to={`/student/courses/${courseId}`}
                  className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <FaPlay size={12} />
                  <span>Go to Course</span>
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <FaShoppingCart size={13} />
                  <span>Add to Cart & Enroll</span>
                </button>
              )}

              {/* Includes List */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Course Features
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <FaBookOpen className="text-violet-500" />
                    <span>{course.chapters?.length || 5} comprehensive modules</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FaClock className="text-violet-500" />
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FaGraduationCap className="text-violet-500" />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
