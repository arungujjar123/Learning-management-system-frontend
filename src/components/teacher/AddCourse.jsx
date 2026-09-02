import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Video, FileText, Image as ImageIcon, AlertCircle } from "lucide-react";

const AddCourse = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    teacher: "",
    chapters: [],
  });
  
  const [createFlashcards, setCreateFlashcards] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      const maxSize = name === "video" ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          [name]: name === "video" ? "Video file must be less than 100MB" : "File must be less than 10MB",
        }));
        e.target.value = "";
        return;
      }
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (["title", "description", "category"].includes(name)) {
      const hasNumbers = /[0-9]/.test(value);
      if (hasNumbers) {
        setErrors((prev) => ({
          ...prev,
          [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} should contain only text, numbers are not allowed`,
        }));
        return;
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }

    if (["duration", "price"].includes(name)) {
      if (value !== "" && !/^\d*\.?\d*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} should contain only numbers`,
        }));
        return;
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleDeleteChapter = (chapterIdx) => {
    const newChapters = formData.chapters.filter((_, idx) => idx !== chapterIdx);
    setFormData({ ...formData, chapters: newChapters });
  };

  const handleDeleteTopic = (chapterIdx, topicIdx) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx].topics = newChapters[chapterIdx].topics.filter((_, idx) => idx !== topicIdx);
    setFormData({ ...formData, chapters: newChapters });
  };

  const handleDeleteQuestion = (chapterIdx, topicIdx, quizIdx) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx].topics[topicIdx].quiz = newChapters[chapterIdx].topics[topicIdx].quiz.filter((_, idx) => idx !== quizIdx);
    setFormData({ ...formData, chapters: newChapters });
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
        ...newChapters[chapterIdx].topics[topicIdx].quiz,
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
      newChapters[chapterIdx].topics[topicIdx][field] = e.target.files[0];
    }

    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };
  console.log(".....", formData);

  const handleQuizOptionChange = (e, chapterIdx, topicIdx, quizIdx, quizOptionIdx) => {
    const newChapters = [...formData.chapters];
    const oldValue = newChapters[chapterIdx].topics[topicIdx].quiz[quizIdx].options[quizOptionIdx];
    const newValue = e.target.value;

    newChapters[chapterIdx].topics[topicIdx].quiz[quizIdx].options[quizOptionIdx] = newValue;

    if (newChapters[chapterIdx].topics[topicIdx].quiz[quizIdx].correctOption === oldValue) {
      newChapters[chapterIdx].topics[topicIdx].quiz[quizIdx].correctOption = newValue;
    }

    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };

  const handleQuizCorrectOption = (chapterIdx, topicIdx, quizIdx, optionIndex) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx].topics[topicIdx].quiz[quizIdx].correctOption =
      newChapters[chapterIdx].topics[topicIdx].quiz[quizIdx].options[optionIndex];

    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.trim().length > 150) {
      newErrors.title = "Title must be less than 150 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = "Description must be less than 2000 characters";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    } else if (formData.category.trim().length < 2) {
      newErrors.category = "Category must be at least 2 characters";
    } else if (formData.category.trim().length > 50) {
      newErrors.category = "Category must be less than 50 characters";
    }

    if (!formData.duration) {
      newErrors.duration = "Duration is required";
    } else if (Number(formData.duration) <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    } else if (Number(formData.duration) > 1000) {
      newErrors.duration = "Duration must be less than 1000 hours";
    }

    if (formData.price === "" || formData.price === null || formData.price === undefined) {
      newErrors.price = "Price is required";
    } else if (Number(formData.price) < 0) {
      newErrors.price = "Price cannot be negative";
    } else if (Number(formData.price) > 999999) {
      newErrors.price = "Price must be less than ₹999999";
    }

    formData.chapters.forEach((chapter, chIdx) => {
      if (!chapter.title.trim()) {
        newErrors[`chapter_${chIdx}_title`] = `Chapter ${chIdx + 1} title is required`;
      } else if (chapter.title.trim().length > 150) {
        newErrors[`chapter_${chIdx}_title`] = `Chapter ${chIdx + 1} title is too long`;
      }

      chapter.topics.forEach((topic, tpIdx) => {
        if (!topic.title.trim()) {
          newErrors[`topic_${chIdx}_${tpIdx}_title`] = `Topic ${tpIdx + 1} in Chapter ${chIdx + 1} needs a title`;
        }

        topic.quiz.forEach((q, qIdx) => {
          if (!q.question.trim()) {
            newErrors[`quiz_${chIdx}_${tpIdx}_${qIdx}_question`] = `Question ${qIdx + 1} is empty`;
          }

          const filledOptions = q.options.filter((opt) => opt.trim() !== "");
          if (filledOptions.length < 2) {
            newErrors[`quiz_${chIdx}_${tpIdx}_${qIdx}_options`] = `Question ${qIdx + 1} needs at least 2 options`;
          }

          if (!q.correctOption || !q.options.includes(q.correctOption)) {
            newErrors[`quiz_${chIdx}_${tpIdx}_${qIdx}_correct`] = `Select correct answer for Question ${qIdx + 1}`;
          }
        });
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector(".input-error");
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("level", formData.level);
    data.append("duration", formData.duration);
    data.append("price", formData.price);
    data.append("image", formData.image);
    data.append("video", formData.video);
    if (formData.notes) data.append("notes", formData.notes);
    data.append("teacher", formData.teacher);

    const chaptersCopy = formData.chapters.map((chapter, chapterIdx) => {
      return {
        title: chapter.title,
        topics: chapter.topics.map((topic, topicIdx) => {
          if (topic.video) {
            data.append(`chapters[${chapterIdx}][topics][${topicIdx}][video]`, topic.video);
          }

          return {
            title: topic.title,
            quiz: topic.quiz,
          };
        }),
      };
    });

    data.append("chapters", JSON.stringify(chaptersCopy));

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/teacher/courses/create_course`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const coursesResponse = await response.json();

      if (response.ok) {
        const newCourseId = coursesResponse?.data?._id;
        if (createFlashcards && newCourseId) {
          navigate(`/teacher/flashcards?courseId=${newCourseId}`);
        } else {
          navigate("/teacher/courses");
        }
      }
    } catch (err) {
      console.log("error occured", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-lg">
          
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900">Add New Course</h2>
            <p className="mt-2 text-sm text-slate-500">Create a comprehensive learning experience</p>
          </div>

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
                  className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.title ? 'border-red-500 focus:ring-red-500 input-error' : 'border-slate-200 focus:ring-cyan-500 focus:border-cyan-500'} text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 text-sm transition-all`}
                />
                {errors.title && <div className="mt-2 flex items-center text-xs text-red-600"><AlertCircle className="w-4 h-4 mr-1" />{errors.title}</div>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-cyan-700 mb-2">Description</label>
                <textarea
                  name="description"
                  placeholder="Course Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  maxLength={2000}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.description ? 'border-red-500 focus:ring-red-500 input-error' : 'border-slate-200 focus:ring-cyan-500 focus:border-cyan-500'} text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 text-sm transition-all resize-none`}
                />
                {errors.description && <div className="mt-2 flex items-center text-xs text-red-600"><AlertCircle className="w-4 h-4 mr-1" />{errors.description}</div>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-cyan-700 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    maxLength={50}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.category ? 'border-red-500 focus:ring-red-500 input-error' : 'border-slate-200 focus:ring-cyan-500 focus:border-cyan-500'} text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 text-sm transition-all`}
                  />
                  {errors.category && <div className="mt-2 flex items-center text-xs text-red-600"><AlertCircle className="w-4 h-4 mr-1" />{errors.category}</div>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-cyan-700 mb-2">Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition-all"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advance">Advance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-cyan-700 mb-2">Duration (in hours)</label>
                  <input
                    type="number"
                    name="duration"
                    placeholder="Duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    min="1"
                    max="1000"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.duration ? 'border-red-500 focus:ring-red-500 input-error' : 'border-slate-200 focus:ring-cyan-500 focus:border-cyan-500'} text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 text-sm transition-all`}
                  />
                  {errors.duration && <div className="mt-2 flex items-center text-xs text-red-600"><AlertCircle className="w-4 h-4 mr-1" />{errors.duration}</div>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-cyan-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    max="999999"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${errors.price ? 'border-red-500 focus:ring-red-500 input-error' : 'border-slate-200 focus:ring-cyan-500 focus:border-cyan-500'} text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 text-sm transition-all`}
                  />
                  {errors.price && <div className="mt-2 flex items-center text-xs text-red-600"><AlertCircle className="w-4 h-4 mr-1" />{errors.price}</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-cyan-700 mb-2"><FileText className="w-4 h-4 inline mr-1"/> Notes (PDF)</label>
                  <input
                    type="file"
                    name="notes"
                    accept="application/pdf"
                    onChange={handleChange}
                    className="block w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-800 hover:file:bg-cyan-100 transition-all cursor-pointer"
                  />
                  {errors.notes && <div className="mt-2 text-xs text-red-600">{errors.notes}</div>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-cyan-700 mb-2"><ImageIcon className="w-4 h-4 inline mr-1"/> Preview Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="block w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-800 hover:file:bg-cyan-100 transition-all cursor-pointer"
                  />
                  {errors.image && <div className="mt-2 text-xs text-red-600">{errors.image}</div>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-cyan-700 mb-2"><Video className="w-4 h-4 inline mr-1"/> Preview Video</label>
                  <input
                    type="file"
                    name="video"
                    accept="video/*"
                    onChange={handleChange}
                    className="block w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-800 hover:file:bg-cyan-100 transition-all cursor-pointer"
                  />
                  {errors.video && <div className="mt-2 text-xs text-red-600">{errors.video}</div>}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Course Curriculum</h3>
                  <p className="text-sm text-slate-500">Organize your course into chapters and topics</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddChapter}
                  className="flex items-center px-4 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-sm border border-cyan-200/80 transition-all shadow-xs"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Chapter
                </button>
              </div>

              <div className="space-y-6">
                {formData.chapters.map((chapter, chapterIdx) => (
                  <div key={chapterIdx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-cyan-800 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center mr-2 text-xs border border-cyan-200 text-cyan-800">
                          {chapterIdx + 1}
                        </span>
                        Chapter {chapterIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteChapter(chapterIdx)}
                        className="flex items-center text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200/60 transition-all"
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
                        className={`w-full px-4 py-2.5 rounded-xl bg-white border ${errors[`chapter_${chapterIdx}_title`] ? 'border-red-500' : 'border-slate-200'} text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm transition-all`}
                      />
                      {errors[`chapter_${chapterIdx}_title`] && <p className="mt-1 text-xs text-red-600">{errors[`chapter_${chapterIdx}_title`]}</p>}
                    </div>

                    <div className="space-y-4 mt-6 ml-2 sm:ml-6 pl-4 border-l-2 border-cyan-200">
                      {chapter.topics.map((topic, topicIdx) => (
                        <div key={topicIdx} className="bg-white border border-slate-200/80 rounded-xl p-4 relative shadow-xs">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-slate-800 text-sm">Topic {topicIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteTopic(chapterIdx, topicIdx)}
                              className="text-slate-400 hover:text-red-600 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-600 mb-1">Topic Title</label>
                              <input
                                type="text"
                                placeholder="Enter topic title"
                                value={topic.title}
                                onChange={(e) => handleTopicChange(chapterIdx, topicIdx, "title", e)}
                                className={`w-full px-3 py-2 rounded-lg bg-slate-50 border ${errors[`topic_${chapterIdx}_${topicIdx}_title`] ? 'border-red-500' : 'border-slate-200'} text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm`}
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-600 mb-1">Topic Video</label>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleTopicChange(chapterIdx, topicIdx, "video", e)}
                                className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-800 hover:file:bg-cyan-100 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Quiz Section */}
                          <div className="mt-5 p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Quiz Questions</span>
                              <button
                                type="button"
                                onClick={() => handleAddQuestion(chapterIdx, topicIdx)}
                                className="text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-md border border-teal-200/80 transition-colors flex items-center"
                              >
                                <Plus className="w-3 h-3 mr-1" /> Add Question
                              </button>
                            </div>

                            <div className="space-y-4">
                              {topic.quiz.map((q, quizIdx) => (
                                <div key={quizIdx} className="pt-3 border-t border-slate-200">
                                  <div className="flex justify-between mb-2">
                                    <span className="text-xs font-medium text-slate-600">Q{quizIdx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteQuestion(chapterIdx, topicIdx, quizIdx)}
                                      className="text-xs text-slate-400 hover:text-red-600"
                                    >
                                      Delete
                                    </button>
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
                                    className="w-full px-3 py-2 mb-3 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm"
                                  />

                                  <div className="space-y-2">
                                    {q.options.map((option, optIdx) => (
                                      <div key={optIdx} className="flex items-center gap-3">
                                        <input
                                          type="radio"
                                          name={`correct-${chapterIdx}-${topicIdx}-${quizIdx}`}
                                          checked={q.correctOption === option && option !== ""}
                                          onChange={() => handleQuizCorrectOption(chapterIdx, topicIdx, quizIdx, optIdx)}
                                          className="w-4 h-4 text-teal-600 bg-white border-slate-300 focus:ring-teal-500 cursor-pointer"
                                        />
                                        <input
                                          type="text"
                                          placeholder={`Option ${optIdx + 1}`}
                                          value={option}
                                          onChange={(e) => handleQuizOptionChange(e, chapterIdx, topicIdx, quizIdx, optIdx)}
                                          className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm"
                                        />
                                      </div>
                                    ))}
                                  </div>

                                  <div className="mt-3">
                                    <input
                                      type="text"
                                      placeholder="Explanation (optional)"
                                      value={q.explaination}
                                      onChange={(e) => {
                                        const newChapters = [...formData.chapters];
                                        newChapters[chapterIdx].topics[topicIdx].quiz[quizIdx].explaination = e.target.value;
                                        setFormData({ ...formData, chapters: newChapters });
                                      }}
                                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs italic"
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
                        className="flex items-center text-sm font-bold text-cyan-700 hover:text-cyan-800 mt-2 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Topic
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-cyan-50/60 border border-cyan-200/80 rounded-xl p-4 flex items-start gap-3">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="checkbox"
                  id="createFlashcards"
                  checked={createFlashcards}
                  onChange={(e) => setCreateFlashcards(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 bg-white cursor-pointer"
                />
              </div>
              <label htmlFor="createFlashcards" className="text-sm text-slate-700 cursor-pointer">
                <span className="font-bold text-slate-900 block">Create Flashcards Deck</span>
                Automatically navigate to the flashcards manager after this course is created.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Course...
                </>
              ) : (
                "Publish Course"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
