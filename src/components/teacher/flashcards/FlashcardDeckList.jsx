import React from 'react';
import { CheckCircle2, Circle, BookOpen, Layers, Eye, Edit3, Trash2, BarChart2, Star } from 'lucide-react';

const FlashcardDeckList = ({ decks, onEdit, onDelete }) => {
  if (decks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200/80 rounded-3xl text-center shadow-xs">
        <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mb-4 border border-cyan-200">
          <Layers className="w-8 h-8 text-cyan-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No flashcard decks yet</h3>
        <p className="text-slate-500 font-medium">Create your first deck to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.map(deck => (
        <div key={deck._id} className="bg-white border border-slate-200/80 hover:border-cyan-500/50 rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4 gap-4">
            <h3 className="text-xl font-bold text-slate-900 line-clamp-2">{deck.title}</h3>
            <span className={`shrink-0 px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 ${deck.isPublished ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
              {deck.isPublished ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Circle className="w-3.5 h-3.5" />}
              {deck.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>

          {deck.description && (
            <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-3">
              {deck.description}
            </p>
          )}

          <div className="flex flex-col gap-2 mb-6 text-sm text-slate-700 font-medium">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-600" />
              <span className="truncate">{deck.courseId?.title || 'Unknown Course'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600" />
              <span>{deck.cards?.length || 0} cards</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-600" />
              <span className="capitalize">{deck.visibility}</span>
            </div>
          </div>

          {deck.stats && (
            <div className="mb-6 flex items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-cyan-600" />
                <span>{deck.stats.totalReviews} reviews</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>{deck.stats.avgRating?.toFixed(1) || '0.0'}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-200">
            <button
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all flex items-center justify-center gap-2 shadow-xs"
              onClick={() => onEdit(deck)}
              title="Edit this deck"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
            <button
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold text-sm border border-red-200/80 transition-all flex items-center justify-center gap-2"
              onClick={() => onDelete(deck._id)}
              title="Delete this deck"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlashcardDeckList;