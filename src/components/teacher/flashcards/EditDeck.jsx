import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Clock, Plus, Trash2, Edit3, Rocket, AlertCircle, BookOpen, Layers, CheckCircle2, Circle } from 'lucide-react';
import AddCard from './AddCard';
import CardEditor from './CardEditor';

const EditDeck = ({ deck, onClose, onUpdate }) => {
  const [cards, setCards] = useState(deck.cards || []);
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState(null);
  const [deckPublished, setDeckPublished] = useState(deck.isPublished);
  const [deckInfo, setDeckInfo] = useState(deck);

  const API_URL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/flashcards`;
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function loadDetails() {
      try {
        const resp = await axios.get(`${API_URL}/${deck._id}/details`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const fullDeck = resp.data.data;
        setDeckInfo(fullDeck);
        setCards(fullDeck.cards || []);
        setDeckPublished(!!fullDeck.isPublished);
      } catch (err) {
        console.error('Failed to load deck details', err);
      }
    }
    loadDetails();
  }, [API_URL, deck._id, token]);

  const handleAddCard = async (cardData) => {
    try {
      const resp = await axios.post(`${API_URL}/${deck._id}/cards`, { cards: [cardData] }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCards(resp.data.data.cards || []);
      setShowAddCard(false);
      alert('Card added successfully!');
    } catch (err) {
      alert('Failed to add card');
      console.error(err);
    }
  };

  const handleEditCard = async (updatedCard) => {
    try {
      const cardId = cards[editingCardIndex]._id;
      await axios.put(`${API_URL}/${deck._id}/cards/${cardId}`, updatedCard, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newCards = [...cards];
      newCards[editingCardIndex] = { ...newCards[editingCardIndex], ...updatedCard };
      setCards(newCards);
      setEditingCardIndex(null);
      alert('Card updated successfully!');
    } catch (err) {
      alert('Failed to update card');
      console.error(err);
    }
  };

  const handleDeleteCard = async (index) => {
    if (!window.confirm('Delete this card?')) return;

    try {
      const cardId = cards[index]._id;
      await axios.delete(`${API_URL}/${deck._id}/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCards(cards.filter((_, i) => i !== index));
      alert('Card deleted!');
    } catch (err) {
      alert('Failed to delete card');
      console.error(err);
    }
  };

  const handlePublish = async () => {
    if (cards.length === 0) {
      alert('Add at least one card before publishing');
      return;
    }

    try {
      await axios.put(`${API_URL}/${deck._id}/publish`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeckPublished(true);
      alert('Deck published successfully!');
      onUpdate();
    } catch (err) {
      alert('Failed to publish deck');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-slate-950/90 backdrop-blur-sm p-4 md:p-8 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-4xl h-fit min-h-[50vh]">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-800">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <span className="text-2xl">📝</span> {deck.title}
          </h2>
          <button className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-full hover:bg-slate-800" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-violet-500/10 p-2 rounded-lg text-violet-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Course</p>
              <p className="text-sm text-slate-200 font-medium truncate">{deckInfo.courseId?.title}</p>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${deckPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              {deckPublished ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</p>
              <p className="text-sm text-slate-200 font-medium">{deckPublished ? 'Published' : 'Draft'}</p>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Cards</p>
              <p className="text-sm text-slate-200 font-medium">{cards.length}</p>
            </div>
          </div>
        </div>

        {deckPublished && (
          <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-300/90 leading-relaxed">
              This deck is published. You cannot edit or delete cards. Create a new version to make changes.
            </p>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Flashcards ({cards.length})</h3>
            </div>
            {!deckPublished && !showAddCard && (
              <button
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
                onClick={() => setShowAddCard(true)}
              >
                <Plus className="w-4 h-4" />
                Add Card
              </button>
            )}
          </div>

          {showAddCard && (
            <AddCard
              onAdd={handleAddCard}
              onCancel={() => setShowAddCard(false)}
            />
          )}

          <div className="space-y-4">
            {cards.length === 0 ? (
              <div className="text-center py-12 bg-slate-950 border border-slate-800 border-dashed rounded-2xl text-slate-500">
                <p>No cards yet. Add your first card!</p>
              </div>
            ) : (
              cards.map((card, index) => (
                <div key={index} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row gap-4 hover:border-slate-700 transition-colors">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        {card.type}
                      </span>
                      {card.lectureTimestamp && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5" /> {card.lectureTimestamp}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-2">
                        <span className="font-bold text-slate-500 shrink-0">Q:</span>
                        <p className="text-slate-200">{card.question}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold text-slate-500 shrink-0">A:</span>
                        <p className="text-slate-300">{card.answer}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center md:flex-col justify-end gap-2 shrink-0 md:pl-4 md:border-l md:border-slate-800">
                    {!deckPublished && (
                      <>
                        <button
                          className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                          onClick={() => setEditingCardIndex(index)}
                          title="Edit Card"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 border border-transparent hover:border-red-500/30 transition-colors"
                          onClick={() => handleDeleteCard(index)}
                          title="Delete Card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {editingCardIndex !== null && (
          <CardEditor
            card={cards[editingCardIndex]}
            onSave={handleEditCard}
            onCancel={() => setEditingCardIndex(null)}
          />
        )}

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-end gap-3">
          <button 
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition-all text-center" 
            onClick={onClose}
          >
            Close
          </button>
          {!deckPublished && (
            <button 
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-md shadow-violet-600/20 transition-all active:scale-95 flex items-center justify-center gap-2" 
              onClick={handlePublish}
            >
              <Rocket className="w-4 h-4" />
              Publish Deck
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditDeck;