import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useLearningTimer from "../../helper/customHooks/useLearningTimer";
import { 
  Play, 
  FileText, 
  Star, 
  MessageSquare, 
  Folder, 
  CheckCircle2, 
  Clock, 
  Upload, 
  ChevronDown, 
  ChevronRight, 
  Check, 
  Brain, 
  File, 
  AlertCircle,
  Download,
  BookOpen
} from "lucide-react";

const CourseDetail = () => {
  const [course, setCourse] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState({ chapterId: null, topicId: null });
  const [markingComplete, setMarkingComplete] = useState(false);

  const { courseId } = useParams();

  const [activeTab, setActiveTab] = useState("materi");

  const { isActive, formattedTime, currentSessionMinutes } = useLearningTimer();
  const [openChapters, setOpenChapters] = useState([0]);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingMsg, setRatingMsg] = useState(null);

  const toggleChapter = (chIdx) => {
    if (openChapters.includes(chIdx)) {
      setOpenChapters(openChapters.filter((idx) => idx !== chIdx));
    } else {
      setOpenChapters([...openChapters, chIdx]);
    }
  };

  const isTopicCompleted = (chapterId, topicId) => {
    return completedTopics.some(
      (ct) => ct.chapterId === chapterId && ct.topicId === topicId
    );
  };

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
    if (!courseId) return;
    
    async function fetchCompletedTopics() {
      try {
        const token = localStorage.getItem("token");
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        
        const response = await fetch(
          `${backendUrl}/student/topic-completion?courseId=${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        const data = await response.json();
        if (data.success) {
          setCompletedTopics(data.data.completedTopics || []);
        }
      } catch (error) {
        console.error("Error fetching completed topics:", error);
      }
    }
    
    fetchCompletedTopics();
  }, [courseId]);

  useEffect(() => {
    async function getCourseById() {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${backendUrl}/student/courses/${courseId}`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : {}
        );
        const courseResponse = await response.json();

        if (response.ok && courseResponse.success) {
          setCourse(courseResponse.data);
          console.log("Course data with ratings:", courseResponse.data.ratings);
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
    if (course?.video) {
      setSelectedVideo(course.video);
    }
  }, [course]);

  useEffect(() => {
    if (activeTab === "assignments" && courseId) {
      fetchCourseAssignments();
    }
  }, [activeTab, courseId]);

  const fetchCourseAssignments = async () => {
    try {
      setLoadingAssignments(true);
      const token = localStorage.getItem("token");
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

      const response = await fetch(
        `${backendUrl}/assignments/student/list?courseId=${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setAssignments(data.data);
      }
    } catch (error) {
      console.error("Error fetching course assignments:", error);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const getStatusBadge = (assignment) => {
    if (assignment.submissionStatus.submitted) {
      if (assignment.submissionStatus.grade?.marks !== null) {
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={14} /> Graded ({assignment.submissionStatus.grade.marks}/
            {assignment.maxMarks})
          </span>
        );
      }
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
          <Upload size={14} /> Submitted
        </span>
      );
    } else if (assignment.submissionStatus.isOverdue) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
          <Clock size={14} /> Overdue
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <FileText size={14} /> Pending
        </span>
      );
    }
  };

  const getDaysLeft = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (diff < 0) return "Overdue";
    if (diff === 0) return "Due Today";
    if (diff === 1) return "1 day left";
    return `${diff} days left`;
  };

  if (!course || (course.length === 0 && !course._id)) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
    </div>
  );

  const handleTopicClick = (tpVideo, chapterId, topicId) => {
    if (tpVideo) {
      setSelectedVideo(tpVideo);
      setSelectedTopic({ chapterId, topicId });
    } else if (course.video) {
      setSelectedVideo(course.video);
      setSelectedTopic({ chapterId: null, topicId: null });
    }
  };

  const markTopicAsComplete = async () => {
    if (!selectedTopic.chapterId || !selectedTopic.topicId) {
      alert("Please select a video topic first");
      return;
    }

    if (isTopicCompleted(selectedTopic.chapterId, selectedTopic.topicId)) {
      alert("This topic is already marked as complete");
      return;
    }

    try {
      setMarkingComplete(true);
      const token = localStorage.getItem("token");
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

      const response = await fetch(
        `${backendUrl}/student/mark-topic-complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId,
            chapterId: selectedTopic.chapterId,
            topicId: selectedTopic.topicId,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setCompletedTopics([...completedTopics, {
          chapterId: selectedTopic.chapterId,
          topicId: selectedTopic.topicId,
          completedAt: new Date()
        }]);
        alert("✅ Topic marked as complete!");
      } else {
        alert(data.message || "Failed to mark topic as complete");
      }
    } catch (error) {
      console.error("Error marking topic as complete:", error);
      alert("Error marking topic as complete");
    } finally {
      setMarkingComplete(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 max-w-[1800px] mx-auto font-sans">
      {/* ===== LEFT SIDEBAR ===== */}
      <div className="lg:w-80 w-full flex-shrink-0 flex flex-col gap-4">
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden h-fit max-h-[calc(100vh-80px)] overflow-y-auto sticky top-5 shadow-xs">
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              className={`flex-1 py-4 px-3 text-center cursor-pointer font-bold text-sm transition-all border-b-2 ${activeTab === "materi" ? "text-cyan-700 border-cyan-600 bg-white" : "text-slate-500 border-transparent hover:text-slate-800"}`}
              onClick={() => setActiveTab("materi")}
            >
              Material
            </button>
            <button
              className={`flex-1 py-4 px-3 text-center cursor-pointer font-bold text-sm transition-all border-b-2 ${activeTab === "komentar" ? "text-cyan-700 border-cyan-600 bg-white" : "text-slate-500 border-transparent hover:text-slate-800"}`}
              onClick={() => setActiveTab("komentar")}
            >
              Comments
            </button>
            <button
              className={`flex-1 py-4 px-3 text-center cursor-pointer font-bold text-sm transition-all border-b-2 ${activeTab === "assignments" ? "text-cyan-700 border-cyan-600 bg-white" : "text-slate-500 border-transparent hover:text-slate-800"}`}
              onClick={() => setActiveTab("assignments")}
            >
              Tasks
            </button>
          </div>

          {activeTab === "materi" && (
            <div className="flex flex-col">
              {/* Flashcards Link */}
              <div className="p-4 border-b border-cyan-100 bg-cyan-50/50">
                <Link
                  to={`/student/sidebar/courses/${courseId}/flashcards`}
                  className="flex items-center gap-2 text-cyan-700 hover:text-cyan-800 font-bold text-sm transition-colors"
                >
                  <Brain size={18} /> Flashcards
                </Link>
              </div>

              {course.chapters && course.chapters.length > 0 ? (
                course.chapters.map((chapter, chIdx) => (
                  <div key={chIdx} className="border-b border-slate-200 last:border-none">
                    <button
                      className="w-full p-4 flex justify-between items-center text-sm font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 transition-colors border-l-2 border-transparent"
                      onClick={() => toggleChapter(chIdx)}
                    >
                      <span className="text-left">{chapter.title}</span>
                      {openChapters.includes(chIdx) ? <ChevronDown size={16} className="text-slate-500" /> : <ChevronRight size={16} className="text-slate-500" />}
                    </button>
                    {openChapters.includes(chIdx) && (
                      <ul className="list-none p-0 m-0 bg-white">
                        {chapter.topics.map((topic, tpIdx) => {
                          const isActiveTopic = selectedVideo === topic.video;
                          const isCompleted = isTopicCompleted(chapter._id, topic._id);
                          return (
                            <React.Fragment key={tpIdx}>
                              {/* Video Item */}
                              <li
                                className={`p-3 pl-5 cursor-pointer flex items-center gap-2.5 transition-all text-sm border-l-2 ${isActiveTopic ? "bg-cyan-50 text-cyan-900 font-bold border-cyan-600" : "text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900"}`}
                                onClick={() =>
                                  handleTopicClick(
                                    topic.video,
                                    chapter._id,
                                    topic._id
                                  )
                                }
                              >
                                <Play size={14} className={isActiveTopic ? "text-cyan-600" : "text-slate-400"} />
                                <span className="flex-1 truncate">{topic.title}</span>
                                {isCompleted && (
                                  <CheckCircle2 size={14} className="text-emerald-600" />
                                )}
                              </li>
                              {/* Quiz Item */}
                              <li className="p-3 pl-5 flex items-center gap-2.5 text-sm border-l-2 border-transparent hover:bg-slate-50 transition-all">
                                <Link
                                  to={`/student/courses/${course._id}/${chapter._id}/${topic._id}/quiz`}
                                  className="flex items-center gap-2 text-cyan-700 hover:text-cyan-800 font-bold w-full"
                                >
                                  <FileText size={14} />
                                  Quiz: {topic.title}
                                </Link>
                              </li>
                            </React.Fragment>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <p className="p-4 text-slate-500 text-sm font-medium">No chapters added yet.</p>
              )}
            </div>
          )}

          {activeTab === "komentar" && (
            <div className="p-6 text-center text-slate-500 text-sm flex flex-col items-center gap-3">
              <MessageSquare size={32} className="text-slate-400" />
              <p className="font-medium">Comments feature coming soon.</p>
            </div>
          )}

          {activeTab === "assignments" && (
            <div className="p-4">
              {loadingAssignments ? (
                <div className="flex justify-center p-8">
                  <div className="w-6 h-6 border-2 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
                </div>
              ) : assignments.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment._id}
                      className="p-5 bg-white border border-slate-200/80 rounded-2xl transition-all shadow-xs"
                    >
                      <div className="flex flex-col gap-2 mb-3">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-base font-bold text-slate-900 leading-tight">
                            {assignment.title}
                          </h3>
                          <div className="shrink-0">{getStatusBadge(assignment)}</div>
                        </div>
                      </div>

                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                        {assignment.description}
                      </p>

                      {assignment.attachments &&
                        assignment.attachments.length > 0 && (
                          <div className="bg-slate-50 p-3 rounded-xl mb-4 border border-slate-200">
                            <div className="text-xs font-bold text-cyan-700 mb-2 flex items-center gap-1.5">
                              <Folder size={12} /> Attachments ({assignment.attachments.length})
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {assignment.attachments.map((file, idx) => (
                                <a
                                  key={idx}
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
                                >
                                  <File size={12} className="text-slate-400" /> {file.filename || `File ${idx + 1}`}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-400 font-medium">Due Date</span>
                          <span className="font-bold text-slate-800">
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-400 font-medium">Marks</span>
                          <span className="font-bold text-slate-800">
                            {assignment.maxMarks}
                          </span>
                        </div>
                        <div className="col-span-2">
                           <span className={`font-bold ${assignment.submissionStatus.isOverdue ? "text-red-600" : "text-emerald-600"}`}>
                            {getDaysLeft(assignment.dueDate)}
                          </span>
                        </div>
                      </div>

                      {assignment.submissionStatus.submitted ? (
                        <div className="flex flex-col gap-2 p-3 bg-teal-50 rounded-xl border border-teal-200">
                          <span className="text-teal-800 text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-teal-600" /> Submitted on{" "}
                            {new Date(
                              assignment.submissionStatus.submittedAt
                            ).toLocaleDateString()}
                          </span>
                          {assignment.submissionStatus.grade?.marks !== null && (
                            <span className="text-cyan-800 font-extrabold text-sm">
                              Grade: {assignment.submissionStatus.grade.marks}/
                              {assignment.maxMarks}
                            </span>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={`/student/assignments/${assignment._id}/submit`}
                          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                            assignment.submissionStatus.isOverdue
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none border border-slate-200"
                              : "bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-md shadow-cyan-600/20 active:scale-95"
                          }`}
                        >
                          {assignment.submissionStatus.isOverdue
                            ? <><AlertCircle size={16} /> Overdue</>
                            : <><Upload size={16} /> Submit Assignment</>}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 flex flex-col items-center gap-3">
                  <Folder size={32} className="text-slate-400" />
                  <p className="text-slate-500 text-sm font-medium">
                    No assignments for this course yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col min-w-0 bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        {/* Learning Timer Indicator */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-4 border-b border-slate-200 text-sm transition-colors ${isActive ? "bg-emerald-50 text-emerald-900 border-emerald-200" : "bg-slate-50 text-slate-600"}`}>
          <div className={`flex items-center gap-2 ${isActive ? "text-emerald-700" : "text-slate-600"}`}>
            {isActive ? <Clock size={16} className="animate-pulse text-emerald-600" /> : <Clock size={16} />}
            <span className="font-bold">
              Learning Timer: {formattedTime}
            </span>
            {currentSessionMinutes > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${isActive ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-slate-200 text-slate-700"}`}>
                {currentSessionMinutes} min{currentSessionMinutes > 1 ? 's' : ''} this session
              </span>
            )}
          </div>
          <div className={`text-xs font-semibold italic ${isActive ? "text-emerald-700" : "text-slate-400"}`}>
            {isActive ? "📈 Tracking your progress..." : "⏸️ Paused"}
          </div>
        </div>

        {/* Video Player */}
        <div className="w-full bg-black aspect-video flex items-center justify-center">
          <video
            src={selectedVideo}
            controls
            className="w-full h-full max-h-[600px] object-contain bg-black"
          />
        </div>
        
        {/* Mark as Done Button */}
        {selectedTopic.chapterId && selectedTopic.topicId && (
          <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-slate-600">
              {isTopicCompleted(selectedTopic.chapterId, selectedTopic.topicId) ? (
                <span className="text-emerald-700 font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" /> You've completed this topic
                </span>
              ) : (
                <span className="font-medium">
                  Mark this topic as complete to track your progress
                </span>
              )}
            </div>
            <button
              onClick={markTopicAsComplete}
              disabled={markingComplete || isTopicCompleted(selectedTopic.chapterId, selectedTopic.topicId)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                isTopicCompleted(selectedTopic.chapterId, selectedTopic.topicId)
                  ? "bg-emerald-50 text-emerald-700 cursor-not-allowed border border-emerald-200"
                  : markingComplete 
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed opacity-70"
                    : "bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-md shadow-cyan-600/20 active:scale-95"
              }`}
            >
              {markingComplete ? "Marking..." : isTopicCompleted(selectedTopic.chapterId, selectedTopic.topicId) ? <><Check size={16} /> Completed</> : "Mark as Done"}
            </button>
          </div>
        )}
        
        {/* Video Info Section */}
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
            {course.title}
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-wrap font-medium">
            {course.description}
          </p>

          {/* Course Rating Display */}
          <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 w-fit">
            <div className="font-extrabold text-xl text-slate-900">
              {course.rating?.average || "0.0"}
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={`${i < Math.round(course.rating?.average || 0) ? "fill-amber-400 text-amber-500" : "text-slate-300"}`}
                />
              ))}
            </div>
            <div className="text-slate-500 text-sm font-medium">
              ({course.rating?.count || 0} {course.rating?.count === 1 ? 'rating' : 'ratings'})
            </div>
          </div>

          {/* Rating Input Section - Only for enrolled students */}
          {course.students && course.students.includes(studentId) && (
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 mt-4">
              <h4 className="text-base font-bold text-slate-900 mb-4">
                Rate this course
              </h4>
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex gap-1 mr-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const val = i + 1;
                    return (
                      <button
                        key={i}
                        onClick={() => setRatingValue(val)}
                        className="bg-transparent border-none cursor-pointer p-1 transition-transform hover:scale-110 focus:outline-none"
                        aria-label={`Rate ${val} stars`}
                      >
                        <Star size={24} className={`${val <= ratingValue ? "fill-amber-400 text-amber-500" : "text-slate-300"}`} />
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={async () => {
                    if (!ratingValue) {
                      setRatingMsg("Please select a rating");
                      return;
                    }
                    setRatingSubmitting(true);
                    setRatingMsg(null);
                    try {
                      const backendUrl =
                        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
                      const token = localStorage.getItem("token");
                      const res = await fetch(
                        `${backendUrl}/courses/${courseId}/rate`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            rating: ratingValue,
                            review: reviewText,
                          }),
                        }
                      );
                      const j = await res.json();
                      if (j.success) {
                        setRatingMsg("Thank you for your rating!");
                        setCourse((prevCourse) => ({
                          ...prevCourse,
                          rating: {
                            average: j.data.average,
                            count: j.data.count,
                          },
                        }));
                        setRatingValue(0);
                        setReviewText("");
                        
                        setTimeout(async () => {
                          try {
                            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
                            const token = localStorage.getItem("token");
                            const refreshResponse = await fetch(
                              `${backendUrl}/student/courses/${courseId}`,
                              token ? { headers: { Authorization: `Bearer ${token}` } } : {}
                            );
                            const refreshData = await refreshResponse.json();
                            if (refreshData.success) {
                              setCourse(refreshData.data);
                            }
                          } catch (error) {
                            console.log("Error refreshing course data:", error);
                          }
                        }, 1000);
                      } else {
                        setRatingMsg(j.message || "Could not save rating");
                      }
                    } catch (err) {
                      console.error(err);
                      setRatingMsg("Network error occurred");
                    } finally {
                      setRatingSubmitting(false);
                    }
                  }}
                  disabled={!ratingValue || ratingSubmitting}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${ratingValue ? "bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/20 active:scale-95" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}
                >
                  {ratingSubmitting ? "Saving..." : "Submit"}
                </button>
              </div>

              <div className="mb-3">
                <textarea
                  placeholder="Leave an optional review..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  maxLength={1000}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm resize-none min-h-[100px]"
                  rows={3}
                />
                <div className="text-slate-500 text-xs mt-1 text-right">{reviewText.length}/1000 characters</div>
              </div>

              {ratingMsg && (
                <div
                  className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                    ratingMsg.includes("Thank you") || ratingMsg.includes("success") 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                      : "bg-red-500/10 text-red-400 border border-red-500/30"
                  }`}
                >
                  {ratingMsg.includes("Thank you") || ratingMsg.includes("success") ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {ratingMsg}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right - Course Info Panel */}
      <div className="lg:w-[360px] w-full flex-shrink-0 flex flex-col gap-6">
        {/* Notes Card */}
        {course.notes && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">
              Course Resources
            </h3>
            <a
              href={course.notes}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-md shadow-violet-600/20 transition-all active:scale-95"
            >
              <Download size={16} /> View / Download Notes
            </a>
          </div>
        )}

        {/* Course Content Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col max-h-[600px] overflow-hidden">
          <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4 shrink-0">
            Course Content
          </h3>
          <div className="overflow-y-auto pr-2 -mr-2">
            {course.chapters && course.chapters.length > 0 ? (
              course.chapters.map((chapter, chIdx) => (
                <div
                  key={chIdx}
                  className={`mb-5 pb-5 ${chIdx !== course.chapters.length - 1 ? "border-b border-slate-800" : ""}`}
                >
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <BookOpen size={16} className="text-violet-400" />
                    {chapter.title}
                  </h4>
                  <div className="pl-6 flex flex-col gap-2">
                    {chapter.topics.map((topic, tpIdx) => {
                       const isActiveVideo = selectedVideo === topic.video;
                       return (
                      <div key={tpIdx} className="flex flex-col gap-1">
                        <button
                          onClick={() => handleTopicClick(topic.video, chapter._id, topic._id)}
                          className={`w-full text-left p-2.5 rounded-xl text-sm transition-all flex items-start gap-2 ${
                            isActiveVideo
                              ? "bg-violet-500/10 text-violet-300 font-semibold border border-violet-500/30"
                              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300 border border-transparent"
                          }`}
                        >
                          <Play size={14} className={`mt-0.5 shrink-0 ${isActiveVideo ? "text-violet-400" : "text-slate-500"}`} />
                          <span className="flex-1">{topic.title}</span>
                        </button>
                        <Link
                          to={`/student/courses/${course._id}/${chapter._id}/${topic._id}/quiz`}
                          className="ml-8 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors py-1 w-fit"
                        >
                          <FileText size={12} /> Quiz
                        </Link>
                      </div>
                    )})}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm text-center py-6">
                No chapters added yet.
              </p>
            )}
          </div>
        </div>

        {/* Student Reviews Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col max-h-[500px] overflow-hidden">
          <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4 shrink-0">
            Student Reviews
          </h3>
          
          <div className="overflow-y-auto pr-2 -mr-2">
            {course.ratings && Array.isArray(course.ratings) && course.ratings.length > 0 ? (
              course.ratings.map((review, index) => (
                <div key={review._id || index} className={`mb-5 pb-5 ${index !== course.ratings.length - 1 ? "border-b border-slate-800" : ""}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
                        S
                      </div>
                      <span className="text-sm font-bold text-slate-300">Student</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < (review.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-700"}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-xs font-semibold text-slate-400">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                  
                  {review.review && review.review.trim() && (
                    <p className="text-sm text-slate-300 leading-relaxed mb-2 italic bg-slate-950/50 p-3 rounded-xl border border-slate-800 break-words">
                      "{review.review}"
                    </p>
                  )}
                  
                  <div className="text-xs text-slate-500">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Recently'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 flex flex-col items-center gap-2 text-slate-500">
                <MessageSquare size={24} className="text-slate-600 mb-2" />
                <p className="text-sm font-medium">No reviews yet.</p>
                <p className="text-xs">Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
