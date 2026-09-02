import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Upload, 
  BookOpen, 
  Calendar, 
  Award, 
  AlertCircle, 
  FileText, 
  Download, 
  Paperclip,
  XCircle,
  Loader2
} from "lucide-react";
import useLearningTimer from "../../../helper/customHooks/useLearningTimer";

const SubmitAssignment = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Track learning time automatically
  const { isActive, formattedTime } = useLearningTimer();

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    fetchAssignmentDetails();
  }, [assignmentId]);

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // We need to get assignment from the list
      const response = await fetch(`${BACKEND_URL}/assignments/student/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        const found = data.data.find((a) => a._id === assignmentId);
        if (found) {
          setAssignment(found);

          // Check if already submitted
          if (found.submissionStatus.submitted) {
            alert("You have already submitted this assignment!");
            navigate("/student/assignments");
          }
        } else {
          alert("Assignment not found");
          navigate("/student/assignments");
        }
      } else {
        console.error("Failed to fetch assignments:", data.message);
        alert("Failed to load assignment. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching assignment:", error);
      alert("Error loading assignment. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxFileSize = 10 * 1024 * 1024; // 10MB per file
    const maxFiles = 10;
    
    const oversizedFiles = selectedFiles.filter(f => f.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({ ...prev, files: 'Each file must be less than 10MB' }));
      e.target.value = '';
      return;
    }
    
    if (selectedFiles.length > maxFiles) {
      setErrors(prev => ({ ...prev, files: `Maximum ${maxFiles} files allowed` }));
      e.target.value = '';
      return;
    }
    
    setErrors(prev => ({ ...prev, files: '' }));
    setFiles(selectedFiles);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check if at least one submission method is provided
    if (!textContent.trim() && files.length === 0) {
      newErrors.submission = 'Please provide either text content or upload files';
    }
    
    // Text content validation
    if (textContent && textContent.length > 10000) {
      newErrors.textContent = 'Text content must be less than 10000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("textContent", textContent);

      files.forEach((file) => {
        formData.append("attachments", file);
      });

      const response = await fetch(
        `${BACKEND_URL}/assignments/student/submit/${assignmentId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Assignment submitted successfully!");
        navigate("/student/assignments");
      } else {
        alert(data.message || "Failed to submit assignment");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading assignment...</p>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <XCircle className="w-12 h-12 text-red-600 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-4">Assignment not found</h2>
        <button
          onClick={() => navigate("/student/assignments")}
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all flex items-center gap-2 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Assignments
        </button>
      </div>
    );
  }

  const now = new Date();
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = now > dueDate;

  return (
    <div className="space-y-6 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-6">
        
        <div className="mb-8">
          <button
            onClick={() => navigate("/student/assignments")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4 text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Assignments
          </button>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 mb-1">
            Submit Work
          </p>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Upload className="w-6 h-6 text-cyan-600" />
            {assignment.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-4">Assignment Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Course</span>
                    <span className="font-semibold text-slate-900">{assignment.course?.title}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Max Marks</span>
                      <span className="font-extrabold text-cyan-700">{assignment.maxMarks}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className={`w-5 h-5 shrink-0 mt-0.5 ${isOverdue ? 'text-red-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Due Date</span>
                      <span className={`font-semibold ${isOverdue ? "text-red-600" : "text-slate-900"}`}>
                        {dueDate.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {isOverdue && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-200">
                      This assignment is overdue.{" "}
                      <span className="font-bold">
                        {assignment.allowLateSubmission
                          ? "Late submissions are allowed."
                          : "Late submissions are not allowed!"}
                      </span>
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-sm font-bold text-slate-300 mb-2">Description</h4>
                  <p className="text-slate-400 text-sm whitespace-pre-wrap">{assignment.description}</p>
                </div>

                {assignment.instructions && (
                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-sm font-bold text-slate-300 mb-2">Instructions</h4>
                    <p className="text-slate-400 text-sm whitespace-pre-wrap">{assignment.instructions}</p>
                  </div>
                )}

                {assignment.attachments && assignment.attachments.length > 0 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mt-4">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-violet-400 mb-2">
                      <Paperclip className="w-4 h-4" /> Reference Files
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">Download and review these files before submitting:</p>
                    <ul className="space-y-2">
                      {assignment.attachments.map((file, index) => (
                        <li key={index}>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 hover:border-violet-500/50 rounded-xl group transition-all"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <FileText className="w-5 h-5 text-slate-500 group-hover:text-violet-400 shrink-0 transition-colors" />
                              <span className="text-sm text-slate-300 group-hover:text-slate-200 truncate font-medium">
                                {file.filename || `File ${index + 1}`}
                              </span>
                            </div>
                            <Download className="w-4 h-4 text-slate-500 group-hover:text-violet-400 shrink-0 transition-colors" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-4">Your Submission</h3>

              {errors.submission && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{errors.submission}</p>
                </div>
              )}

              <div className="space-y-6">
                {(assignment.submissionType === "text" || assignment.submissionType === "both") && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Text Content <span className="text-slate-500 font-normal">(max 10000 characters)</span>
                      {assignment.submissionType === "text" && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      rows="8"
                      placeholder="Type your answer here..."
                      required={assignment.submissionType === "text"}
                      maxLength={10000}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none transition-colors ${
                        errors.textContent ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-800 focus:border-transparent'
                      }`}
                    />
                    <div className="flex justify-between items-center mt-2">
                      {errors.textContent ? (
                        <span className="text-xs text-red-400 font-medium">{errors.textContent}</span>
                      ) : (
                        <span className="text-xs text-transparent">Space</span> // For layout consistency
                      )}
                      <span className={`text-xs font-medium ${textContent.length > 9000 ? 'text-amber-400' : 'text-slate-500'}`}>
                        {textContent.length}/10000
                      </span>
                    </div>
                  </div>
                )}

                {(assignment.submissionType === "file" || assignment.submissionType === "both") && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Upload Files <span className="text-slate-500 font-normal">(max 10 files, 10MB each)</span>
                      {assignment.submissionType === "file" && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    
                    <div className="relative border-2 border-dashed border-slate-700 hover:border-violet-500/50 rounded-xl p-8 text-center transition-colors bg-slate-950">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt,.jpg,.png,.zip"
                        required={assignment.submissionType === "file" && files.length === 0}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Choose files to upload"
                      />
                      <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                      <p className="text-sm text-slate-300 font-medium mb-1">Click or drag files here to upload</p>
                      <p className="text-xs text-slate-500">Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, ZIP</p>
                    </div>

                    {errors.files && <span className="text-xs text-red-400 font-medium mt-2 block">{errors.files}</span>}
                    
                    {files.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Selected Files ({files.length})</p>
                        <ul className="space-y-2">
                          {files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <FileText className="w-4 h-4 text-violet-400 shrink-0" />
                                <span className="text-sm text-slate-300 truncate">{file.name}</span>
                                <span className="text-xs text-slate-500 shrink-0">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="p-1 hover:bg-slate-700 rounded-md transition-colors group"
                                title="Remove file"
                              >
                                <XCircle className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => navigate("/student/assignments")}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || (isOverdue && !assignment.allowLateSubmission)}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-md shadow-violet-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" /> Submit Work
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="hidden lg:block space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sticky top-8">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-violet-400" /> Reminders
              </h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                  <p>Make sure your files are under 10MB each.</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                  <p>Double check your work before submitting, as you can only submit once.</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                  <p>Allowed formats: PDF, DOC, DOCX, TXT, JPG, PNG, ZIP.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitAssignment;
