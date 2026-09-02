import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Brain, BookOpen } from 'lucide-react';

const StudentFlashcards = () => {
    const { courseId } = useParams();
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const token = localStorage.getItem('token');
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
                const response = await axios.get(`${backendUrl}/api/flashcards/course/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setDecks(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching decks", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDecks();
    }, [courseId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="w-8 h-8 border-3 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 mb-1">Study Material</p>
                    <h2 className="text-3xl font-extrabold text-slate-900">Course Flashcards</h2>
                </div>

                {decks.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center bg-white border border-slate-200/80 rounded-3xl text-center shadow-xs">
                        <div className="w-16 h-16 bg-cyan-50 border border-cyan-200/80 rounded-full flex items-center justify-center mb-4">
                            <Brain className="w-8 h-8 text-cyan-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No flashcards found</h3>
                        <p className="text-slate-500">There are no flashcards available for this course yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {decks.map(deck => (
                            <div 
                                key={deck._id} 
                                className="bg-white border border-slate-200/80 rounded-3xl p-6 hover:border-cyan-500/50 transition-all flex flex-col cursor-pointer group hover:-translate-y-1 shadow-xs hover:shadow-xl"
                                onClick={() => navigate(`/student/sidebar/deck/${deck._id}`)}
                            >
                                <div className="w-12 h-12 bg-cyan-50 text-cyan-600 border border-cyan-200/80 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-cyan-700 transition-colors">{deck.title}</h3>
                                <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-3">{deck.description}</p>
                                
                                <button className="w-full px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all">
                                    Study Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentFlashcards;
