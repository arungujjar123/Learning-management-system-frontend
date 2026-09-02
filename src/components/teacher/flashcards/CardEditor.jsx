import React, { useState } from 'react';
import { X } from 'lucide-react';

const CardEditor = ({ card, onSave, onCancel }) => {
  const [cardType, setCardType] = useState(card.type || 'qa');
  const [formData, setFormData] = useState({
    _id: card._id,
    type: card.type || 'qa',
    question: card.question || '',
    answer: card.answer || '',
    clozeText: card.clozeText || '',
    hints: card.hints ? card.hints.join(', ') : '',
    difficulty: card.difficulty || 'medium',
    tags: card.tags ? card.tags.join(', ') : '',
    lectureTimestamp: card.lectureTimestamp || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert('Question and answer are required');
      return;
    }

    const updated = {
      _id: formData._id,
      type: cardType,
      question: formData.question,
      answer: formData.answer,
      clozeText: formData.clozeText,
      hints: formData.hints.length > 0 ? formData.hints.split(',').map(h => h.trim()) : [],
      difficulty: formData.difficulty,
      tags: formData.tags.length > 0 ? formData.tags.split(',').map(t => t.trim()) : [],
      lectureTimestamp: formData.lectureTimestamp
    };

    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-800">
          <h4 className="text-xl font-bold text-white">Edit Card</h4>
          <button className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-full hover:bg-slate-800" onClick={onCancel}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
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
              rows="3"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Answer *</label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              rows="3"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none"
            />
          </div>

          {cardType === 'cloze' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Cloze Text</label>
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
                placeholder="e.g., 12:34"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Hints (comma-separated)</label>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardEditor;
