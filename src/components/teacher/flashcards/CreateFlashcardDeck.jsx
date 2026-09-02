import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { X, Loader2 } from 'lucide-react';

const CreateFlashcardDeck = ({ onClose, onCreate, initialCourseId }) => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    visibility: 'private'
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem('token');

  const fetchTeacherCourses = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/teacher/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data.data);
    } catch (err) {
      alert('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTeacherCourses();
  }, [fetchTeacherCourses]);

  useEffect(() => {
    if (initialCourseId && courses.length > 0) {
      setFormData(prev => ({ ...prev, courseId: initialCourseId }));
    }
  }, [initialCourseId, courses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.courseId) {
      newErrors.courseId = 'Please select a course';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 font-sans">
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xl max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Create New Flashcard Deck</h2>
          <button className="text-slate-400 hover:text-slate-700 transition-colors" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Course *</label>
            {loading ? (
              <div className="flex items-center gap-2 text-slate-500 text-sm py-2">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-600" /> Loading courses...
              </div>
            ) : (
              <>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.courseId ? 'border-red-500' : 'border-slate-200'} text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm`}
                >
                  <option value="">-- Choose a course --</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title || course.name}
                    </option>
                  ))}
                </select>
                {errors.courseId && <p className="mt-1 text-xs text-red-600">{errors.courseId}</p>}
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deck Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Chapter 3 - Key Concepts"
              maxLength="100"
              required
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.title ? 'border-red-500' : 'border-slate-200'} text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What topics does this deck cover?"
              rows="4"
              maxLength="500"
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.description ? 'border-red-500' : 'border-slate-200'} text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm resize-none`}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-slate-400">{formData.description.length}/500</span>
              {errors.description && <span className="text-xs text-red-600">{errors.description}</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Visibility</label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            >
              <option value="private">Private (Only you)</option>
              <option value="course">Course (All enrolled students)</option>
              <option value="public">Public (Everyone)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-200">
            <button 
              type="button" 
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all shadow-xs"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-95"
            >
              Create Deck
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFlashcardDeck;