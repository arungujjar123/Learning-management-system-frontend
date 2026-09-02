import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, Video, FileText, Image as ImageIcon, AlertCircle, RefreshCw } from "lucide-react";

const EditCourse = () => {
  const token = localStorage.getItem("token");
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    duration: "",
    price: "",
    image: null,
    video: null,
    notes: null,
    chapters: [],
  });

  const [existingFiles, setExistingFiles] = useState({
    image: null,
    video: null,
    notes: null,
  });

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/student/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.success) {
          const course = data.data;
          setFormData({
            title: course.title || "",
            description: course.description || "",
            category: course.category || "",
            level: course.level || "Beginner",
            duration: course.duration || "",
            price: course.price || "",
            image: null,
            video: null,
            notes: null,
            chapters: course.chapters || [],
          });
          setExistingFiles({
            image: course.image,
            video: course.video,
            notes: course.notes,
          });
        } else {
          setError("Failed to load course");
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files && files[0]) {
      const file = files[0];
      const maxSize = name === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setFormErrors(prev => ({
          ...prev,
          [name]: name === 'video' ? 'Video file must be less than 100MB' : 'File must be less than 10MB'
        }));
        e.target.value = '';
        return;
      }
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleAddChapter = () => {
    setFormData({
      ...formData,
      chapters: [...formData.chapters, { title: "", topics: [] }],
    });
  };

  const handleAddTopic = (chapterIdx) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx] = {
      ...newChapters[chapterIdx],
      topics: [
        ...newChapters[chapterIdx].topics,
        { title: "", video: "", quiz: [] },
      ],
    };
    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };

  const handleAddQuestion = (chapterIdx, topicIdx) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx].topics[topicIdx] = {
      ...newChapters[chapterIdx].topics[topicIdx],
      quiz: [
        ...(newChapters[chapterIdx].topics[topicIdx].quiz || []),
        {
          question: "",
          options: ["", "", "", ""],
          correctOption: "",
          explaination: "",
        },
      ],
    };
    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };

  const handleChapterChange = (chapterIdx, value) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx].title = value;
    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };

  const handleTopicChange = (chapterIdx, topicIdx, field, e) => {
    const newChapters = [...formData.chapters];
    if (field === "title") {
      newChapters[chapterIdx].topics[topicIdx][field] = e.target.value;
    } else if (field === "video") {
      newChapters[chapterIdx].topics[topicIdx].newVideo = e.target.files[0];
    }
    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };

  const handleQuizOptionChange = (e, chapterIdx, topicIdx, quizIdx, quizOptionIdx) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx].topics[topicIdx].quiz[quizIdx].options[quizOptionIdx] = e.target.value;
    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };

  const handleQuizCorrectOption = (e, chapterIdx, topicIdx, quizIdx, val) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx].topics[topicIdx].quiz[quizIdx].correctOption = val;
    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };

  const handleDeleteChapter = (chapterIdx) => {
    const newChapters = formData.chapters.filter((_, idx) => idx !== chapterIdx);
    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };

  const handleDeleteTopic = (chapterIdx, topicIdx) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx].topics = newChapters[chapterIdx].topics.filter((_, idx) => idx !== topicIdx);
    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 150) {
      newErrors.title = 'Title must be less than 150 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    } else if (formData.category.trim().length > 50) {
      newErrors.category = 'Category must be less than 50 characters';
    }
    
    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    } else if (Number(formData.duration) <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    } else if (Number(formData.duration) > 1000) {
      newErrors.duration = 'Duration must be less than 1000 hours';
    }
    
    if (formData.price === '' || formData.price === null) {
      newErrors.price = 'Price is required';
    } else if (Number(formData.price) < 0) {
      newErrors.price = 'Price cannot be negative';
    } else if (Number(formData.price) > 999999) {
      newErrors.price = 'Price must be less than ₹999999';
    }
    
    formData.chapters.forEach((chapter, chIdx) => {
      if (!chapter.title.trim()) {
        newErrors[`chapter_${chIdx}`] = `Chapter ${chIdx + 1} title is required`;
      }
      chapter.topics.forEach((topic, tpIdx) => {
        if (!topic.title.trim()) {
          newErrors[`topic_${chIdx}_${tpIdx}`] = `Topic ${tpIdx + 1} title is required`;
        }
        topic.quiz?.forEach((q, qIdx) => {
          if (q.question.trim() && q.options.filter(o => o.trim()).length < 2) {
            newErrors[`quiz_${chIdx}_${tpIdx}_${qIdx}`] = `Question needs at least 2 options`;
          }
        });
      });
    });
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting');
      return;
    }
    
    setSaving(true);
    setError(null);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("level", formData.level);
    data.append("duration", formData.duration);
    data.append("price", formData.price);

    if (formData.image) data.append("image", formData.image);
    if (formData.video) data.append("video", formData.video);
    if (formData.notes) data.append("notes", formData.notes);

    const chaptersCopy = formData.chapters.map((chapter, chapterIdx) => {
      return {
        _id: chapter._id,
        title: chapter.title,
        topics: chapter.topics.map((topic, topicIdx) => {
          if (topic.newVideo) {
            data.append(`chapters[${chapterIdx}][topics][${topicIdx}][video]`, topic.newVideo);
          }
          return {
            _id: topic._id,
            title: topic.title,
            video: topic.video,
            quiz: topic.quiz,
          };
        }),
      };
    });

    data.append("chapters", JSON.stringify(chaptersCopy));

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/teacher/courses/${courseId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const result = await response.json();

      if (result.success) {
        navigate(`/teacher/courses/${courseId}`);
      } else {
        setError(result.message || "Failed to update course");
      }
    } catch (err) {
      console.error("Error updating course:", err);
      setError("Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-medium">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-lg">
          
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900">Edit Course</h2>
            <p className="mt-2 text-sm text-slate-500">Update your course details and curriculum</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center justify-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-cyan-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Course Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${formErrors.title ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-cyan-500 focus:border-cyan-500'} text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 text-sm transition-all`}
                />
                {formErrors.title && <div className="mt-2 text-xs text-red-400 flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1" />{formErrors.title}</div>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-violet-400 mb-2">Description</label>
                <textarea
                  name="description"
                  placeholder="Course Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  maxLength={2000}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${formErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-violet-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all resize-none`}
                />
                {formErrors.description && <div className="mt-2 text-xs text-red-400 flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1" />{formErrors.description}</div>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-violet-400 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    maxLength={50}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${formErrors.category ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-violet-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all`}
                  />
                  {formErrors.category && <div className="mt-2 text-xs text-red-400 flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1" />{formErrors.category}</div>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-violet-400 mb-2">Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm transition-all"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advance">Advance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-violet-400 mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    name="duration"
                    placeholder="Duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    min="1"
                    max="1000"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${formErrors.duration ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-violet-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all`}
                  />
                  {formErrors.duration && <div className="mt-2 text-xs text-red-400 flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1" />{formErrors.duration}</div>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-violet-400 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    max="999999"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${formErrors.price ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:ring-violet-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all`}
                  />
                  {formErrors.price && <div className="mt-2 text-xs text-red-400 flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1" />{formErrors.price}</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800/50">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-violet-400 mb-2 flex items-center justify-between">
                    <span><FileText className="w-4 h-4 inline mr-1" /> Notes (PDF)</span>
                  </label>
                  {existingFiles.notes && (
                    <div className="mb-2 text-xs text-emerald-400 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></div>
                      Current file exists
                    </div>
                  )}
                  <input
                    type="file"
                    name="notes"
                    accept="application/pdf"
                    onChange={handleChange}
                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 transition-all cursor-pointer"
                  />
                  {formErrors.notes && <div className="mt-2 text-xs text-red-400">{formErrors.notes}</div>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-violet-400 mb-2 flex items-center justify-between">
                    <span><ImageIcon className="w-4 h-4 inline mr-1" /> Preview Image</span>
                  </label>
                  {existingFiles.image && (
                    <img src={existingFiles.image} alt="Preview" className="w-full h-24 object-cover rounded-xl mb-3 border border-slate-800" />
                  )}
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 transition-all cursor-pointer"
                  />
                  {formErrors.image && <div className="mt-2 text-xs text-red-400">{formErrors.image}</div>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-violet-400 mb-2 flex items-center justify-between">
                    <span><Video className="w-4 h-4 inline mr-1" /> Preview Video</span>
                  </label>
                  {existingFiles.video && (
                    <div className="mb-2 text-xs text-emerald-400 flex items-center h-24 bg-slate-900 border border-slate-800 rounded-xl justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></div>
                      Current video exists
                    </div>
                  )}
                  <input
                    type="file"
                    name="video"
                    accept="video/*"
                    onChange={handleChange}
                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 transition-all cursor-pointer"
                  />
                  {formErrors.video && <div className="mt-2 text-xs text-red-400">{formErrors.video}</div>}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Course Curriculum</h3>
                  <p className="text-sm text-slate-400">Update chapters, topics, and quizzes</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddChapter}
                  className="flex items-center px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Chapter
                </button>
              </div>

              <div className="space-y-6">
                {formData.chapters.map((chapter, chapterIdx) => (
                  <div key={chapterIdx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-violet-400 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center mr-2 text-xs border border-violet-500/30">
                          {chapterIdx + 1}
                        </span>
                        Chapter {chapterIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteChapter(chapterIdx)}
                        className="flex items-center text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                      </button>
                    </div>

                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Chapter title"
                        value={chapter.title}
                        onChange={(e) => handleChapterChange(chapterIdx, e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${formErrors[`chapter_${chapterIdx}`] ? 'border-red-500' : 'border-slate-800'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all`}
                      />
                      {formErrors[`chapter_${chapterIdx}`] && <p className="mt-1 text-xs text-red-400">{formErrors[`chapter_${chapterIdx}`]}</p>}
                    </div>

                    <div className="space-y-4 mt-6 ml-2 sm:ml-6 pl-4 border-l-2 border-slate-800">
                      {chapter.topics.map((topic, topicIdx) => (
                        <div key={topicIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-slate-300 text-sm">Topic {topicIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteTopic(chapterIdx, topicIdx)}
                              className="text-slate-500 hover:text-red-400 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <input
                                type="text"
                                placeholder="Topic Title"
                                value={topic.title}
                                onChange={(e) => handleTopicChange(chapterIdx, topicIdx, "title", e)}
                                className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${formErrors[`topic_${chapterIdx}_${topicIdx}`] ? 'border-red-500' : 'border-slate-800'} text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm`}
                              />
                              {formErrors[`topic_${chapterIdx}_${topicIdx}`] && <p className="mt-1 text-xs text-red-400">{formErrors[`topic_${chapterIdx}_${topicIdx}`]}</p>}
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center">
                                Topic Video
                                {topic.video && <span className="ml-2 text-emerald-400 font-normal">(Current video exists)</span>}
                              </label>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleTopicChange(chapterIdx, topicIdx, "video", e)}
                                className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Quiz Section */}
                          <div className="mt-5 p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Quiz Questions</span>
                              <button
                                type="button"
                                onClick={() => handleAddQuestion(chapterIdx, topicIdx)}
                                className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-md transition-colors flex items-center"
                              >
                                <Plus className="w-3 h-3 mr-1" /> Add Question
                              </button>
                            </div>

                            <div className="space-y-4">
                              {topic.quiz && topic.quiz.map((q, quizIdx) => (
                                <div key={quizIdx} className="pt-3 border-t border-slate-800/50">
                                  <div className="flex justify-between mb-2">
                                    <span className="text-xs font-medium text-slate-400">Q{quizIdx + 1}</span>
                                  </div>

                                  <input
                                    type="text"
                                    placeholder="Enter question"
                                    value={q.question}
                                    onChange={(e) => {
                                      const newChapters = [...formData.chapters];
                                      newChapters[chapterIdx].topics[topicIdx].quiz[quizIdx].question = e.target.value;
                                      setFormData({ ...formData, chapters: newChapters });
                                    }}
                                    className="w-full px-3 py-2 mb-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                                  />
                                  {formErrors[`quiz_${chapterIdx}_${topicIdx}_${quizIdx}`] && (
                                    <p className="mt-1 text-xs text-red-400 mb-2">{formErrors[`quiz_${chapterIdx}_${topicIdx}_${quizIdx}`]}</p>
                                  )}

                                  <div className="space-y-2">
                                    {q.options && q.options.map((option, optIdx) => (
                                      <div key={optIdx} className="flex items-center gap-3">
                                        <input
                                          type="radio"
                                          name={`correct-${chapterIdx}-${topicIdx}-${quizIdx}`}
                                          checked={q.correctOption === option && option !== ""}
                                          onChange={() => handleQuizCorrectOption(null, chapterIdx, topicIdx, quizIdx, option)}
                                          className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500/50 cursor-pointer"
                                        />
                                        <input
                                          type="text"
                                          placeholder={`Option ${optIdx + 1}`}
                                          value={option}
                                          onChange={(e) => handleQuizOptionChange(e, chapterIdx, topicIdx, quizIdx, optIdx)}
                                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                                        />
                                      </div>
                                    ))}
                                  </div>

                                  <div className="mt-3">
                                    <input
                                      type="text"
                                      placeholder="Explanation (optional)"
                                      value={q.explaination || ""}
                                      onChange={(e) => {
                                        const newChapters = [...formData.chapters];
                                        newChapters[chapterIdx].topics[topicIdx].quiz[quizIdx].explaination = e.target.value;
                                        setFormData({ ...formData, chapters: newChapters });
                                      }}
                                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs italic"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => handleAddTopic(chapterIdx)}
                        className="flex items-center text-sm font-semibold text-slate-300 hover:text-white mt-2 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Topic
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Update Course"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
