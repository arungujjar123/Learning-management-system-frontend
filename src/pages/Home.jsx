import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { addToCart } from "../features/cart/cartSlice";
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Star,
  Users,
  Award,
  BookOpen,
  ChevronDown,
  Zap,
  Code,
  Brain,
  Layout,
  Smartphone,
  Cloud,
  Lock,
  MessageSquare,
  GraduationCap,
  Flame,
  Check,
  ShoppingCart,
  Eye,
} from "lucide-react";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: "10,000+",
    instructors: "250+",
    videos: "1,200+",
    materials: "500+",
  });
  const [activeTab, setActiveTab] = useState("video");
  const [openFaq, setOpenFaq] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);

  const fetchCourses = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://learning-management-system-backend-5aet.onrender.com";
      let response = await fetch(`${backendUrl}/courses`);
      if (!response.ok) {
        response = await fetch(`${backendUrl}/student/all-courses`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        const sortedCourses = data.data.sort((a, b) => {
          const aRating = a.rating?.average || 0;
          const bRating = b.rating?.average || 0;
          return bRating - aRating;
        });
        setCourses(sortedCourses.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://learning-management-system-backend-5aet.onrender.com";
      const response = await fetch(`${backendUrl}/stats`);
      const data = await response.json();

      if (data && data.success && data.data) {
        const payload = data.data;
        setStats({
          students: payload.students ? `${payload.students}+` : "15,000+",
          instructors: payload.instructors ? `${payload.instructors}+` : "200+",
          videos: payload.videos ? `${payload.videos}+` : "1,500+",
          materials: payload.materials ? `${payload.materials}+` : "600+",
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleAddToCart = async (e, courseId) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(`/login?next=${encodeURIComponent("/courses")}`);
      return;
    }

    try {
      await dispatch(addToCart(courseId)).unwrap();
      alert("Course added to cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      alert(err || "Course is already in cart or failed to add");
    }
  };

  const categories = [
    {
      title: "Web Development",
      count: "120+ Courses",
      icon: Code,
    },
    {
      title: "AI & Data Science",
      count: "85+ Courses",
      icon: Brain,
    },
    {
      title: "UI/UX & Product Design",
      count: "60+ Courses",
      icon: Layout,
    },
    {
      title: "Mobile App Dev",
      count: "75+ Courses",
      icon: Smartphone,
    },
    {
      title: "Cloud & DevOps",
      count: "50+ Courses",
      icon: Cloud,
    },
    {
      title: "Cyber Security",
      count: "40+ Courses",
      icon: Lock,
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning Paths",
      description: "Adaptive quizzes, intelligent recommendations, and personalized lesson tracking tailored to your speed.",
      badge: "Smart Tech",
    },
    {
      icon: GraduationCap,
      title: "Top Industry Mentors",
      description: "Learn directly from senior engineers and designers working at leading global technology companies.",
      badge: "Verified Experts",
    },
    {
      icon: Code,
      title: "Real-World Projects",
      description: "Build production-ready applications with hands-on code reviews and portfolio-building assignments.",
      badge: "Portfolio Ready",
    },
    {
      icon: Flame,
      title: "Interactive Revision",
      description: "Retain key concepts faster with gamified flashcard decks and instant topic knowledge checks.",
      badge: "Fast Retention",
    },
    {
      icon: Award,
      title: "Verifiable Certifications",
      description: "Earn shareable certificates with unique verification IDs to showcase on LinkedIn and your resume.",
      badge: "Career Proof",
    },
    {
      icon: MessageSquare,
      title: "24/7 Peer & Mentor Lounge",
      description: "Never get stuck. Ask questions, debug code together, and network with thousands of driven learners.",
      badge: "Live Support",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Frontend Developer at TechCorp",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      content: "SeekhoBharat changed my career path completely. The structured fullstack curriculum and live quizzes gave me the confidence to crack top developer interviews!",
      rating: 5,
    },
    {
      name: "Rahul Verma",
      role: "Data Analyst at Analytics Pro",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      content: "The quality of instructors and hands-on assignments is top-notch. I went from knowing basic Python to building machine learning models in 3 months.",
      rating: 5,
    },
    {
      name: "Ananya Patel",
      role: "UI/UX Designer at Creative Studio",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      content: "I love the interactive streak tracker and gamified revision decks. Learning feels fun and rewarding every single day!",
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: "How long do I have access to enrolled courses?",
      a: "You get full lifetime access to all course videos, reading materials, quizzes, and future module updates upon enrolling.",
    },
    {
      q: "Will I receive an official certificate after completing a course?",
      a: "Yes! Once you complete all chapters and pass the topic quizzes, you will receive a verifiable certificate with a unique credential URL.",
    },
    {
      q: "Can I learn at my own pace?",
      a: "Absolutely. All video lessons and interactive quizzes are self-paced, allowing you to learn anytime on mobile, tablet, or desktop.",
    },
    {
      q: "What if I get stuck while working on a project?",
      a: "You can post your queries in the course discussion lounge or mentor Q&A section to get timely code debugging support from mentors and peers.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      {/* Dynamic Background Blur Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-cyan-200/50 via-sky-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-[600px] right-0 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold tracking-wide uppercase shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Next-Gen Learning Ecosystem 2.0</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-slate-900"
            >
              Master Tech Skills <br />
              <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 bg-clip-text text-transparent">
                Shape Your Future
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Accelerate your career with interactive video courses, AI-powered quizzes, real-world portfolio projects, and guidance from verified industry leaders.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                to="/courses"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-xl shadow-cyan-600/20 transition-all duration-300 flex items-center justify-center gap-3 group active:scale-[0.98]"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features-demo"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2.5"
              >
                <Play className="w-4 h-4 text-cyan-600 fill-cyan-600" />
                <span>Explore Platform Demo</span>
              </a>
            </motion.div>

            {/* Micro Feature Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 border-t border-slate-200 max-w-lg mx-auto lg:mx-0 font-medium"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Self-Paced Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Verified Credentials</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>24/7 Peer Support</span>
              </div>
            </motion.div>
          </div>

          {/* Right Hero Graphic Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-30 animate-pulse" />

              <div className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl p-2">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                  alt="Students Learning Together"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                />

                {/* Floating Rating Pill */}
                <div className="absolute top-6 left-6 bg-white/95 border border-slate-200 backdrop-blur-md p-3.5 rounded-2xl shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
                    <Star className="w-5 h-5 fill-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-black text-slate-900">4.9 / 5.0</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">From 12,000+ Students</p>
                  </div>
                </div>

                {/* Floating Course Progress Pill */}
                <div className="absolute bottom-6 right-6 bg-white/95 border border-slate-200 backdrop-blur-md p-4 rounded-2xl shadow-lg max-w-xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-600" /> Fullstack Mastery
                    </span>
                    <span className="text-teal-700 font-bold">85% Complete</span>
                  </div>
                  <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full w-[85%]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS COUNTER BAR --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-8">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            <div className="flex items-center gap-4 pt-4 lg:pt-0">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{stats.students}</h3>
                <p className="text-xs text-slate-500 font-medium">Active Learners</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:pl-8">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{stats.instructors}</h3>
                <p className="text-xs text-slate-500 font-medium">Expert Mentors</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:pl-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{stats.videos}</h3>
                <p className="text-xs text-slate-500 font-medium">HD Video Lessons</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:pl-8">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">96%</h3>
                <p className="text-xs text-slate-500 font-medium">Course Completion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- POPULAR CATEGORIES --- */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600">
            Explore Domain Areas
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Explore Top Learning Categories
          </h2>
          <p className="text-sm text-slate-600">
            Choose from industry-aligned pathways designed to take you from foundational concepts to advanced production skills.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="group relative bg-white border border-slate-200/80 hover:border-cyan-500/50 rounded-3xl p-6 transition-all duration-300 overflow-hidden shadow-xs hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-cyan-800 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200/80">
                    {cat.count}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    Master essential tools and methodologies with curated project tracks.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to="/courses"
                    className="text-xs font-bold text-cyan-600 group-hover:text-cyan-700 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Browse Pathway</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* --- FEATURED TOP COURSES SHOWCASE --- */}
      {(loading || courses.length > 0) && (
        <section className="py-20 bg-white/70 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-600">
                  Top Rated Pathways
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  Featured Courses
                </h2>
              </div>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
              >
                <span>Explore All Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-10 h-10 border-3 border-cyan-500/30 border-t-cyan-600 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                  <motion.div
                    key={course._id}
                    whileHover={{ y: -6 }}
                    className="bg-white border border-slate-200/80 hover:border-cyan-500/50 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl flex flex-col justify-between group transition-all"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative aspect-video bg-slate-100 overflow-hidden">
                        <img
                          src={
                            course.image ||
                            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60"
                          }
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-cyan-800 border border-cyan-200/80 shadow-xs">
                          {course.category || "General"}
                        </div>
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-teal-800 border border-teal-200/80 shadow-xs">
                          {course.level || "All Levels"}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span className="text-slate-900 font-bold">{course.rating?.average || "4.8"}</span>
                          <span className="text-slate-400">({course.rating?.count || "48"} reviews)</span>
                        </div>

                        <Link to={`/courses/${course._id}`}>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors line-clamp-2 leading-snug">
                            {course.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-slate-500">
                          Mentor: <strong className="text-slate-700">{course.teacher?.name || "Verified Expert"}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                      <div>
                        <span className="text-2xl font-black text-slate-900">
                          {course.price ? `₹${course.price}` : "Free"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/courses/${course._id}`}
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={(e) => handleAddToCart(e, course._id)}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/20 transition-all active:scale-95"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Enroll</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* --- WHY CHOOSE SEEKHOBHARAT (FEATURES) --- */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Designed for Modern Tech Careers
          </h2>
          <p className="text-sm text-slate-600">
            Everything you need to master new tools, practice code, build projects, and get hired.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl space-y-4 hover:border-cyan-500/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200/80">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- INTERACTIVE PLATFORM DEMO PREVIEW --- */}
      <section id="features-demo" className="py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-600">
              Inside the Platform
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">Interactive Learning Experience</h2>
          </div>

          {/* Selector Tabs */}
          <div className="flex justify-center gap-3 border-b border-slate-200 pb-4">
            {[
              { id: "video", label: "HD Video Player", icon: Play },
              { id: "quiz", label: "Quiz Engine", icon: Brain },
              { id: "streak", label: "Habit Streak", icon: Flame },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Demo Content Showcase */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg max-w-4xl mx-auto">
            {activeTab === "video" && (
              <div className="space-y-6">
                <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=80"
                    alt="Video Demo"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute w-16 h-16 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-900">Lesson 4: React State Hooks</span>
                  <span>1080p HD • Speed 1.25x</span>
                </div>
              </div>
            )}

            {activeTab === "quiz" && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <span className="text-xs font-bold text-cyan-600 uppercase">Topic Assessment</span>
                  <h4 className="text-base font-bold text-slate-900">Q1: Which hook is used to handle side-effects in React?</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700">useState()</div>
                    <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-500 text-cyan-900 font-bold flex items-center justify-between">
                      <span>useEffect()</span>
                      <Check className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700">useContext()</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "streak" && (
              <div className="space-y-6 text-center">
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 max-w-sm mx-auto">
                  <Flame className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
                  <h3 className="text-3xl font-black text-slate-900">7 Day Streak!</h3>
                  <p className="text-xs text-slate-600">You're in the top 5% of consistent learners this week.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- STUDENT TESTIMONIALS --- */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600">
            Learner Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Loved by Thousands of Learners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-cyan-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FAQ ACCORDION --- */}
      <section className="py-20 bg-white/70 border-t border-slate-200 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Got questions? We've got answers.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-colors shadow-xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-cyan-700"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? "rotate-180 text-cyan-600" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* --- HIGH CONVERSION CTA BANNER --- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900 rounded-3xl p-8 sm:p-14 text-center space-y-6 border border-cyan-800/40 shadow-2xl relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Start Learning Tech Skills Today
          </h2>
          <p className="text-sm sm:text-base text-cyan-100 max-w-xl mx-auto">
            Join thousands of active learners gaining production-ready engineering and design skills.
          </p>

          <div className="pt-4 flex justify-center">
            <Link
              to="/courses"
              className="px-8 py-4 rounded-2xl text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 shadow-xl transition-all flex items-center gap-2 active:scale-95"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;