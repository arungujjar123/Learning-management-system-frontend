import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, FileText, CheckCircle2, Clock, Users, BookOpen, AlertCircle, Calendar, GraduationCap, FileSignature, Video } from "lucide-react";

const AdminCourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

      const response = await fetch(`${backendUrl}/admin/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setCourse(data.data);
        // Set default video to course intro video
        if (data.data.video) {
          setSelectedVideo(data.data.video);
        }
      } else {
        setError("Failed to fetch course details");
      }
    } catch (error) {
      setError("Network error while fetching course details");
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (topicVideo) => {
    if (topicVideo) {
      setSelectedVideo(topicVideo);
    } else if (course.video) {
      setSelectedVideo(course.video);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-3 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center font-sans">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Error</h3>
        <p className="text-slate-500 mb-6 font-medium">{error}</p>
        <button
          onClick={() => navigate("/admin/courses")}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center font-sans">
        <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Course not found</h3>
        <p className="text-slate-500 mb-6 font-medium">The course you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate("/admin/courses")}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <button
            onClick={() => navigate("/admin/courses")}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs transition-all flex items-center gap-2 w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">Course Review</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">{course.title}</h1>
            <p className="text-slate-500 font-medium mt-1">Admin View - Course Details & Content</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Video Player */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-cyan-600" />
                {selectedVideo === course.video
                  ? "Course Introduction"
                  : "Topic Video"}
              </h2>

              {selectedVideo ? (
                <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 aspect-video mb-6 shadow-sm">
                  <video
                    src={selectedVideo}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 mb-6">
                  <Video className="w-12 h-12 mb-3 opacity-30 text-cyan-600" />
                  <h3 className="text-lg font-bold text-slate-800">No video available</h3>
                  <p className="text-sm text-slate-500 font-medium">This section doesn't have any video content.</p>
                </div>
              )}

              {course.description && (
                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-slate-900 font-bold text-lg mb-3">Course Description</h3>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">{course.description}</p>
                </div>
              )}

              {course.notes && (
                <div className="pt-6 border-t border-slate-100 mt-6">
                  <h3 className="text-slate-900 font-bold text-lg mb-4">Course Notes</h3>
                  <a
                    href={course.notes}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-sm border border-cyan-200 transition-all shadow-xs"
                  >
                    <FileText className="w-4 h-4" /> Download Course Notes
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right - Chapters & Topics Sidebar */}
          <div className="space-y-6">
            {/* Info Panel */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
              <h3 className="text-slate-900 font-bold text-lg mb-5 border-b border-slate-100 pb-3">Course Information</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2 font-medium"><GraduationCap className="w-4 h-4" /> Teacher</span>
                  <span className="text-slate-900 font-bold text-right ml-4">
                    {course.teacher ? course.teacher.name : "No teacher assigned"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2 font-medium"><Users className="w-4 h-4" /> Students</span>
                  <span className="text-slate-900 font-bold">
                    {course.enrolledCount || 0} enrolled
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2 font-medium"><BookOpen className="w-4 h-4" /> Category</span>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                    {course.category || "Not specified"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2 font-medium"><CheckCircle2 className="w-4 h-4" /> Level</span>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {course.level || "Not specified"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2 font-medium"><Clock className="w-4 h-4" /> Duration</span>
                  <span className="text-slate-900 font-bold">
                    {course.duration || "Not specified"} hours
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2 font-medium"><FileSignature className="w-4 h-4" /> Price</span>
                  <span className="text-cyan-700 font-extrabold text-base">
                    {course.price ? `₹${course.price}` : "Free"}
                  </span>
                </div>
              </div>

              {/* Course Intro Video Button */}
              {course.video && (
                <button
                  onClick={() => setSelectedVideo(course.video)}
                  className={`w-full px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    selectedVideo === course.video 
                    ? "bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white shadow-md shadow-cyan-600/20" 
                    : "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs"
                  }`}
                >
                  <Play className="w-4 h-4" /> Course Introduction
                </button>
              )}
            </div>

            {/* Chapters Panel */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 max-h-[600px] overflow-y-auto custom-scrollbar shadow-xs">
              <h3 className="text-slate-900 font-bold text-lg mb-5 sticky top-0 bg-white/90 backdrop-blur-xs pb-2 z-10 border-b border-slate-100">
                Course Content ({course.chapters ? course.chapters.length : 0} chapters)
              </h3>
              
              {course.chapters && course.chapters.length > 0 ? (
                <div className="space-y-4">
                  {course.chapters.map((chapter, chapterIndex) => (
                    <div key={chapterIndex} className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden">
                      <div className="p-4 bg-slate-100/80 border-b border-slate-200/80">
                        <h4 className="text-slate-900 font-bold text-sm">{chapterIndex + 1}. {chapter.title}</h4>
                      </div>
                      
                      {chapter.topics && chapter.topics.length > 0 ? (
                        <ul className="divide-y divide-slate-200/60">
                          {chapter.topics.map((topic, topicIndex) => (
                            <li
                              key={topicIndex}
                              className={`p-3 text-sm flex items-start gap-3 cursor-pointer transition-colors ${
                                selectedVideo === topic.video 
                                ? "bg-cyan-50 text-cyan-950 font-bold" 
                                : "hover:bg-slate-100 text-slate-700 font-medium"
                              }`}
                              onClick={() => handleTopicClick(topic.video)}
                            >
                              <Play className={`w-4 h-4 mt-0.5 shrink-0 ${selectedVideo === topic.video ? "text-cyan-600" : "text-slate-400"}`} />
                              <span className="leading-tight">{topic.title}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-4 text-sm text-slate-400 italic text-center">
                          No topics available
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="w-10 h-10 text-slate-300 mb-3" />
                  <p className="text-slate-400 text-sm font-medium">No chapters available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enrolled Students Section */}
        {course.enrolledStudents && course.enrolledStudents.length > 0 && (
          <div className="pt-8 border-t border-slate-200/80">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">Class Roster</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1 mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-cyan-600" />
              Enrolled Students ({course.enrolledStudents.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.enrolledStudents.map((student) => (
                <div key={student._id} className="bg-white border border-slate-200/80 rounded-3xl p-5 hover:border-cyan-500/50 transition-all shadow-xs hover:shadow-xl">
                  <div className="flex items-center gap-4 mb-5 border-b border-slate-100 pb-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-800 flex items-center justify-center font-extrabold text-lg border border-cyan-200">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-slate-900 font-bold truncate">{student.name}</h4>
                      <p className="text-slate-500 text-xs truncate font-medium">{student.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Enrolled:</span>
                      </div>
                      <span className="text-slate-800 font-bold">
                        {student.enrolledAt
                          ? new Date(student.enrolledAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Completed Topics:</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                        {student.completedTopicsCount || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <FileSignature className="w-4 h-4 text-cyan-600" />
                        <span>Quizzes Taken:</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold border border-cyan-200">
                        {student.quizScoresCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourseDetail;
