import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useLearningTimer from "../../helper/customHooks/useLearningTimer";
import { Play, FileText, CheckCircle2, ChevronRight, ChevronDown, Edit3, BookOpen, Star, MessageSquare, BookText, AlertCircle } from "lucide-react";

const CourseDetail = () => {
  const [course, setCourse] = useState({});
  const [studentId, setStudentId] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isEnroll, setIsEnroll] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const { courseId } = useParams();

  const [activeTab, setActiveTab] = useState("materi");
  const { startTimer, stopTimer, seconds } = useLearningTimer();
  
  useEffect(() => {
    startTimer();
    return () => {
      stopTimer();
    };
  }, []);
  
  const [openChapters, setOpenChapters] = useState([0]);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingMsg, setRatingMsg] = useState(null);

  useEffect(() => {
    async function getStudentProfile() {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/student/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setStudentId(data.data._id);
      } catch (error) {
        console.log("err occurred...", error);
      }
    }
    getStudentProfile();
  }, []);

  useEffect(() => {
    async function getCourseById() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/student/courses/${courseId}`
        );
        const courseResponse = await response.json();

        if (response.ok && courseResponse.success) {
          setCourse(courseResponse.data);
          if (courseResponse.data.video) {
            setSelectedVideo(courseResponse.data.video);
          } else if (
            courseResponse.data.chapters &&
            courseResponse.data.chapters[0] &&
            courseResponse.data.chapters[0].topics[0]
          ) {
            setSelectedVideo(courseResponse.data.chapters[0].topics[0].video);
          }
        } else {
          console.error("Error fetching course:", courseResponse.message);
        }
      } catch (error) {
        console.log("err occurred...", error);
      }
    }
    getCourseById();
  }, [courseId]);

  useEffect(() => {
    if (course?.students && studentId) {
      setIsEnroll(course.students.includes(studentId));
    }
  }, [course, studentId]);

  if (!course?.title) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Loading course detail...</p>
      </div>
    );
  }

  const avgRating = course?.rating?.average || 0;
  const ratingCount = course?.rating?.count || 0;

  const handleTopicClick = (tpVideo, chIdx, tpIdx) => {
    if (isEnroll || (chIdx === 0 && tpIdx === 0)) {
      if (tpVideo) {
        setSelectedVideo(tpVideo);
      }
    } else if (!isEnroll) {
      setShowPopUp(true);
    }
  };

  const toggleChapter = (chapterIndex) => {
    setOpenChapters((prevOpenChapters) => {
      const isOpen = prevOpenChapters.includes(chapterIndex);
      if (isOpen) {
        return prevOpenChapters.filter((idx) => idx !== chapterIndex);
      } else {
        return [...prevOpenChapters, chapterIndex];
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden font-sans">
      {/* ===== LEFT SIDEBAR ===== */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-slate-200/80 flex flex-col h-screen overflow-hidden">
        <div className="flex border-b border-slate-200 bg-white sticky top-0 z-10">
          <button
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === "materi"
                ? "border-cyan-600 text-cyan-800"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
            onClick={() => setActiveTab("materi")}
          >
            <BookText className="w-4 h-4 inline mr-2" /> Material
          </button>
          <button
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === "komentar"
                ? "border-cyan-600 text-cyan-800"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
            onClick={() => setActiveTab("komentar")}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" /> Comments
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "materi" && (
            <div>
              {course.chapters && course.chapters.length > 0 ? (
                course.chapters.map((chapter, chIdx) => (
                  <div key={chIdx} className="border-b border-slate-800/50 last:border-b-0">
                    <button
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/50 transition-colors"
                      onClick={() => toggleChapter(chIdx)}
                    >
                      <span className="font-semibold text-slate-200 text-sm">{chapter.title}</span>
                      {openChapters.includes(chIdx) ? (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    
                    {openChapters.includes(chIdx) && (
                      <div className="bg-slate-950/50 py-2">
                        {chapter.topics.map((topic, tpIdx) => (
                          <React.Fragment key={tpIdx}>
                            <button
                              className={`w-full flex items-start text-left px-4 py-3 text-sm transition-colors border-l-2 ${
                                selectedVideo === topic.video
                                  ? "border-violet-500 bg-violet-500/10 text-violet-300 font-medium"
                                  : "border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                              }`}
                              onClick={() => handleTopicClick(topic.video, chIdx, tpIdx)}
                            >
                              <Play className={`w-4 h-4 mr-3 mt-0.5 flex-shrink-0 ${selectedVideo === topic.video ? "text-violet-400" : "text-slate-500"}`} />
                              <span className="flex-1">{topic.title}</span>
                            </button>
                            
                            <Link
                              to={`/student/courses/${course._id}/${chapter._id}/${topic._id}/quiz`}
                              className="w-full flex items-start text-left px-4 py-3 text-sm transition-colors border-l-2 border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                            >
                              <FileText className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0 text-slate-500" />
                              <span className="flex-1">Quiz: {topic.title}</span>
                            </Link>
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No chapters added yet.
                </div>
              )}
            </div>
          )}

          {activeTab === "komentar" && (
            <div className="p-8 text-center text-slate-500 text-sm">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>Comments feature coming soon.</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== RIGHT MAIN CONTENT ===== */}
      <div className="flex-1 h-screen overflow-y-auto bg-slate-950">
        <div className="max-w-5xl mx-auto p-4 lg:p-8">
          
          <div className="bg-black rounded-2xl overflow-hidden aspect-video shadow-xl border border-slate-800 mb-6 relative group">
            {selectedVideo ? (
              <video
                src={selectedVideo}
                controls
                className="w-full h-full object-contain bg-black"
                key={selectedVideo}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                <Play className="w-16 h-16 mb-4 opacity-50" />
                <p>Select a video from the curriculum to play</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
            <button className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              Transcript
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold text-white mb-3">{course.title}</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">{course.description}</p>
                
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</span>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-slate-700"}`} />
                      ))}
                    </div>
                    <span className="text-slate-400">({ratingCount} ratings)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px]">
                <Link
                  to={`/teacher/courses/${course._id}/edit`}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-sm transition-all flex items-center justify-center text-center"
                >
                  <Edit3 className="w-4 h-4 mr-2" /> Edit Course
                </Link>
                <Link
                  to={`/teacher/flashcards?courseId=${course._id}`}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-md shadow-violet-600/20 transition-all active:scale-95 flex items-center justify-center text-center"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Manage Flashcards
                </Link>
                
                {course.notes && (
                  <a
                    href={course.notes}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition-all mt-2 flex items-center justify-center text-center"
                  >
                    <FileText className="w-4 h-4 mr-2" /> Course Notes (PDF)
                  </a>
                )}
              </div>
            </div>

            {isEnroll && (
              <div className="mt-8 pt-8 border-t border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-widest text-violet-400 mb-4">Rate this course</h3>
                <div className="flex flex-col max-w-xl">
                  <div className="flex items-center gap-2 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const val = i + 1;
                      return (
                        <button
                          key={i}
                          onClick={() => setRatingValue(val)}
                          className="transition-transform hover:scale-110 focus:outline-none"
                          aria-label={`Rate ${val} stars`}
                        >
                          <Star className={`w-8 h-8 ${val <= ratingValue ? "fill-amber-400 text-amber-400" : "text-slate-700"}`} />
                        </button>
                      );
                    })}
                  </div>
                  
                  <textarea
                    placeholder="Leave an optional review"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm resize-none mb-3"
                    rows={3}
                  />
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={async () => {
                        if (!ratingValue) {
                          setRatingMsg("Please select a rating");
                          return;
                        }
                        setRatingSubmitting(true);
                        setRatingMsg(null);
                        try {
                          const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
                          const token = localStorage.getItem("token");
                          const res = await fetch(`${backendUrl}/courses/${courseId}/rate`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ rating: ratingValue, review: reviewText }),
                          });
                          const j = await res.json();
                          if (j.success) {
                            setRatingMsg("Thank you for your rating");
                            setCourse((c) => ({
                              ...c,
                              rating: {
                                average: j.data.average,
                                count: j.data.count,
                              },
                            }));
                          } else {
                            setRatingMsg(j.message || "Could not save rating");
                          }
                        } catch (err) {
                          console.error(err);
                          setRatingMsg("Network error");
                        } finally {
                          setRatingSubmitting(false);
                        }
                      }}
                      disabled={ratingSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-md shadow-violet-600/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {ratingSubmitting ? "Saving..." : "Submit Review"}
                    </button>
                    {ratingMsg && (
                      <span className={`text-sm font-medium ${ratingMsg.includes("Thank you") ? "text-emerald-400" : "text-amber-400"}`}>
                        {ratingMsg}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== ENROLLMENT POP-UP MODAL ===== */}
      {showPopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl max-w-md w-full text-center">
            <div className="w-16 h-16 bg-violet-500/10 text-violet-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">Enrollment Required</h2>
            <p className="text-slate-400 mb-8">
              You need to enroll in this course to watch the complete video materials.
            </p>
            
            <div className="flex flex-col gap-3">
              <Link 
                to="" 
                className="w-full px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-md shadow-violet-600/20 transition-all active:scale-95"
              >
                Enroll Now
              </Link>
              <button
                className="w-full px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition-all"
                onClick={() => setShowPopUp(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
