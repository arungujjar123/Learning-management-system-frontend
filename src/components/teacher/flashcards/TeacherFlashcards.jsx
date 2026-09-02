import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Plus, Loader2, AlertCircle } from 'lucide-react';
import CreateFlashcardDeck from './CreateFlashcardDeck';
import FlashcardDeckList from './FlashcardDeckList';
import EditDeck from './EditDeck';

const TeacherFlashcards = () => {
  const [decks, setDecks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preselectedCourseId, setPreselectedCourseId] = useState(null);
  const [searchParams] = useSearchParams();

  const API_URL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/flashcards`;
  const token = localStorage.getItem('token');

  const fetchDecks = useCallback(async () => {
    try {
      setLoading(true);
      if (!token) {
        setError('Not authenticated');
        return;
      }
      const response = await axios.get(`${API_URL}/teacher/decks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDecks(response.data.data);
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load flashcard decks';
      setError(msg);
      console.error('fetchDecks error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchDecks();
    const qsCourseId = searchParams.get('courseId');
    if (qsCourseId) {
      setPreselectedCourseId(qsCourseId);
      setShowCreateModal(true);
    }
  }, [searchParams, fetchDecks]);

  const handleCreateDeck = async (deckData) => {
    try {
      await axios.post(`${API_URL}/create`, deckData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchDecks();
      setShowCreateModal(false);
      alert('Flashcard deck created successfully!');
    } catch (err) {
      alert('Failed to create deck: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteDeck = async (deckId) => {
    if (!window.confirm('Are you sure you want to delete this deck?')) return;

    try {
      await axios.delete(`${API_URL}/${deckId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDecks(decks.filter(d => d._id !== deckId));
      alert('Deck deleted successfully!');
    } catch (err) {
      alert('Failed to delete deck');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mb-4" />
          <p className="font-medium">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cyan-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">My Flashcard Decks</h1>
          </div>
          <button 
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 w-full md:w-auto"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
            Create New Deck
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 font-semibold">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p>{error}</p>
          </div>
        )}

        {showCreateModal && (
          <CreateFlashcardDeck
            initialCourseId={preselectedCourseId}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateDeck}
          />
        )}

        {editingDeck && (
          <EditDeck
            deck={editingDeck}
            onClose={() => setEditingDeck(null)}
            onUpdate={fetchDecks}
          />
        )}

        <FlashcardDeckList
          decks={decks}
          onEdit={setEditingDeck}
          onDelete={handleDeleteDeck}
        />
      </div>
    </div>
  );
};

export default TeacherFlashcards;