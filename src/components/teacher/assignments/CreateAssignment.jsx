import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Upload, Plus, Check } from "lucide-react";

const CreateAssignment = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    course: "",
    chapter: "",
    maxMarks: 100,
    dueDate: "",
    allowLateSubmission: false,
    submissionType: "both",
  });
  const [files, setFiles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/teacher/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxFileSize = 10 * 1024 * 1024; // 10MB per file
    
    const oversizedFiles = selectedFiles.filter(f => f.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({ ...prev, files: 'Each file must be less than 10MB' }));
      e.target.value = '';
      return;
    }
    
    if (selectedFiles.length > 5) {
      setErrors(prev => ({ ...prev, files: 'Maximum 5 files allowed' }));
      e.target.value = '';
      return;
    }
    
    setErrors(prev => ({ ...prev, files: '' }));
    setFiles(selectedFiles);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }
    
    // Course validation
    if (!formData.course) {
      newErrors.course = 'Please select a course';
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }
    
    // Instructions validation (optional but has limits)
    if (formData.instructions && formData.instructions.length > 5000) {
      newErrors.instructions = 'Instructions must be less than 5000 characters';
    }
    
    // Max marks validation
    if (!formData.maxMarks || formData.maxMarks < 1) {
      newErrors.maxMarks = 'Max marks must be at least 1';
    } else if (formData.maxMarks > 1000) {
      newErrors.maxMarks = 'Max marks cannot exceed 1000';
    }
    
    // Due date validation
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.dueDate = 'Due date must be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append files
      files.forEach((file) => {
        formDataToSend.append("attachments", file);
      });

      const response = await fetch(
        `${BACKEND_URL}/assignments/teacher/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Assignment created successfully!");
        navigate("/teacher/assignments");
      } else {
        alert(data.message || "Failed to create assignment");
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      alert("Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/teacher/assignments")}
            className="flex items-center justify-center p-2.5 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 shadow-xs transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-600" />
            Create New Assignment
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-700 mb-6">
              Basic Information
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  placeholder="e.g., Week 1 - JavaScript Basics"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-cyan-500 focus:border-cyan-500'} text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 text-sm transition-all`}
                />
                {errors.title && <p className="mt-1.5 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Course *</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${errors.course ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-800 focus:ring-violet-500'} text-white focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all`}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                {errors.course && <p className="mt-1.5 text-sm text-red-400">{errors.course}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Chapter (Optional)</label>
                <input
                  type="text"
                  name="chapter"
                  value={formData.chapter}
                  onChange={handleChange}
                  placeholder="e.g., Chapter 3: Functions"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  maxLength={2000}
                  placeholder="Brief description of the assignment"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${errors.description ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-800 focus:ring-violet-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent text-sm resize-none transition-all`}
                />
                {errors.description && <p className="mt-1.5 text-sm text-red-400">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Detailed Instructions</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  rows="5"
                  maxLength={5000}
                  placeholder="Provide detailed instructions for students..."
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${errors.instructions ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-800 focus:ring-violet-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent text-sm resize-none transition-all`}
                />
                {errors.instructions && <p className="mt-1.5 text-sm text-red-400">{errors.instructions}</p>}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-6">
              Assignment Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Maximum Marks *</label>
                <input
                  type="number"
                  name="maxMarks"
                  value={formData.maxMarks}
                  onChange={handleChange}
                  required
                  min="1"
                  max="1000"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${errors.maxMarks ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-800 focus:ring-violet-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all`}
                />
                {errors.maxMarks && <p className="mt-1.5 text-sm text-red-400">{errors.maxMarks}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Due Date *</label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${errors.dueDate ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-800 focus:ring-violet-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all [color-scheme:dark]`}
                />
                {errors.dueDate && <p className="mt-1.5 text-sm text-red-400">{errors.dueDate}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Submission Type</label>
              <select
                name="submissionType"
                value={formData.submissionType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm transition-all"
              >
                <option value="both">File & Text</option>
                <option value="file">File Only</option>
                <option value="text">Text Only</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 rounded border border-slate-700 bg-slate-900 group-hover:border-violet-500 transition-colors">
                  <input
                    type="checkbox"
                    name="allowLateSubmission"
                    checked={formData.allowLateSubmission}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  {formData.allowLateSubmission && <Check className="w-3.5 h-3.5 text-violet-400" />}
                </div>
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">Allow late submissions</span>
              </label>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-6">
              Attachments (Optional)
            </h3>
            
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Upload Reference Files (Max 5 files, 10MB each)
              </label>
              
              <div className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-700 px-6 py-10 hover:border-violet-500/50 hover:bg-slate-900/50 transition-all group">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-slate-500 group-hover:text-violet-400 transition-colors" aria-hidden="true" />
                  <div className="mt-4 flex justify-center text-sm leading-6 text-slate-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-transparent font-semibold text-violet-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-violet-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 hover:text-violet-300"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-slate-500">PDF, DOC, TXT, JPG up to 10MB</p>
                </div>
              </div>

              {errors.files && <p className="mt-2 text-sm text-red-400">{errors.files}</p>}
              
              {files.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Selected files</h4>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                        <FileText className="w-4 h-4 text-violet-400" />
                        <span className="truncate flex-1">{file.name}</span>
                        <span className="text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/teacher/assignments")}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all shadow-xs"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Create Assignment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;
