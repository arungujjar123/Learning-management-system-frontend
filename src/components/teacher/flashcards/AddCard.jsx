import React, { useState } from 'react';

const AddCard = ({ onAdd, onCancel }) => {
  const [cardType, setCardType] = useState('qa');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    type: 'qa',
    question: '',
    answer: '',
    clozeText: '',
    hints: [],
    difficulty: 'medium',
    tags: '',
    lectureTimestamp: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    } else if (formData.question.trim().length < 3) {
      newErrors.question = 'Question must be at least 3 characters';
    } else if (formData.question.length > 1000) {
      newErrors.question = 'Question must be less than 1000 characters';
    }
    
    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
    } else if (formData.answer.trim().length < 1) {
      newErrors.answer = 'Answer is required';
    } else if (formData.answer.length > 2000) {
      newErrors.answer = 'Answer must be less than 2000 characters';
    }
    
    if (formData.lectureTimestamp && formData.lectureTimestamp.trim()) {
      const timestampRegex = /^(?:[0-9]{1,2}:)?[0-5]?[0-9]:[0-5][0-9]$/;
      if (!timestampRegex.test(formData.lectureTimestamp.trim())) {
        newErrors.lectureTimestamp = 'Invalid format. Use MM:SS or HH:MM:SS (e.g., 12:34 or 1:23:45)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const card = {
      type: cardType,
      question: formData.question,
      answer: formData.answer,
      clozeText: formData.clozeText,
      hints: formData.hints.length > 0 ? formData.hints.split(',').map(h => h.trim()) : [],
      difficulty: formData.difficulty,
      tags: formData.tags.length > 0 ? formData.tags.split(',').map(t => t.trim()) : [],
      lectureTimestamp: formData.lectureTimestamp
    };

    onAdd(card);
    setFormData({
      type: 'qa',
      question: '',
      answer: '',
      clozeText: '',
      hints: [],
      difficulty: 'medium',
      tags: '',
      lectureTimestamp: ''
    });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <h4 className="text-lg font-bold text-white mb-6">Add New Card</h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Card Type</label>
            <select 
              value={cardType} 
              onChange={(e) => setCardType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            >
              <option value="qa">Question & Answer</option>
              <option value="cloze">Cloze (Fill the blank)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Difficulty</label>
            <select 
              name="difficulty" 
              value={formData.difficulty} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Question *</label>
          <textarea
            name="question"
            value={formData.question}
            onChange={handleChange}
            placeholder="Enter the question or prompt"
            rows="3"
            required
            maxLength={1000}
            className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${errors.question ? 'border-red-500' : 'border-slate-800'} text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none`}
          />
          {errors.question && <p className="mt-1 text-xs text-red-400">{errors.question}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Answer *</label>
          <textarea
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            placeholder="Enter the answer"
            rows="3"
            required
            maxLength={2000}
            className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${errors.answer ? 'border-red-500' : 'border-slate-800'} text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none`}
          />
          {errors.answer && <p className="mt-1 text-xs text-red-400">{errors.answer}</p>}
        </div>

        {cardType === 'cloze' && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Cloze Text (Optional)</label>
            <input
              type="text"
              name="clozeText"
              value={formData.clozeText}
              onChange={handleChange}
              placeholder="e.g., The capital of France is ___"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., biology, chapter3, important"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Lecture Timestamp</label>
            <input
              type="text"
              name="lectureTimestamp"
              value={formData.lectureTimestamp}
              onChange={handleChange}
              placeholder="e.g., 12:34 or 1:23:45"
              className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${errors.lectureTimestamp ? 'border-red-500' : 'border-slate-800'} text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm`}
            />
            {errors.lectureTimestamp && <p className="mt-1 text-xs text-red-400">{errors.lectureTimestamp}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Hints (comma-separated, optional)</label>
          <input
            type="text"
            name="hints"
            value={formData.hints}
            onChange={handleChange}
            placeholder="e.g., Think about Europe, major city"
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-800">
          <button 
            type="button" 
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition-all" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-md shadow-violet-600/20 transition-all active:scale-95"
          >
            Add Card
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCard;