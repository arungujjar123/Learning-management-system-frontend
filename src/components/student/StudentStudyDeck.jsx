import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

const StudentStudyDeck = () => {
    const { deckId } = useParams();
    const [deck, setDeck] = useState(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const token = localStorage.getItem('token');
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
                const response = await axios.get(`${backendUrl}/api/flashcards/student/deck/${deckId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setDeck(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching deck", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDeck();
    }, [deckId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="w-8 h-8 border-3 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!deck) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center font-sans">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Deck not found</h2>
                    <button onClick={() => navigate(-1)} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all border border-slate-200 shadow-xs">Go Back</button>
                </div>
            </div>
        );
    }

    if (!deck.cards || deck.cards.length === 0) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center font-sans">
                <div className="text-center bg-white border border-slate-200/80 rounded-3xl p-8 max-w-md w-full mx-4 shadow-xs">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Empty Deck</h2>
                    <p className="text-slate-500 mb-6 font-medium">There are no cards in this deck yet.</p>
                    <button onClick={() => navigate(-1)} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-95">Go Back</button>
                </div>
            </div>
        );
    }

    const currentCard = deck.cards[currentCardIndex];
    const progressPercentage = ((currentCardIndex + 1) / deck.cards.length) * 100;

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCardIndex((prev) => (prev + 1) % deck.cards.length);
        }, 150);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCardIndex((prev) => (prev - 1 + deck.cards.length) % deck.cards.length);
        }, 150);
    };

    return (
        <div className="space-y-6 font-sans flex flex-col min-h-[calc(100vh-120px)]">
            <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex-1 flex flex-col">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all shadow-xs"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-cyan-700">Study Deck</p>
                        <h2 className="text-2xl font-extrabold text-slate-900">{deck.title}</h2>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 w-full max-w-2xl mx-auto">
                    <div className="flex justify-between text-sm text-slate-500 mb-2 font-bold">
                        <span>Card {currentCardIndex + 1} of {deck.cards.length}</span>
                        <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                        <div 
                            className="h-full bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 transition-all duration-300 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Flashcard 3D Scene */}
                <div className="flex-1 flex flex-col items-center justify-center perspective-1000 mb-8 w-full">
                    {/* The 3D container */}
                    <div 
                        className={`w-full max-w-2xl aspect-[4/3] md:aspect-[16/9] relative transition-transform duration-500 cursor-pointer ${isFlipped ? '-scale-x-100' : ''}`}
                        onClick={() => setIsFlipped(!isFlipped)}
                        style={{ transformStyle: 'preserve-3d', perspective: '1000px', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                    >
                        {/* Front (Question) */}
                        <div className="absolute inset-0 bg-white border-2 border-slate-200/80 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center shadow-xl hover:border-cyan-500/50 transition-colors" style={{ backfaceVisibility: 'hidden' }}>
                            <div className="absolute top-6 left-6 px-3 py-1 bg-cyan-50 text-cyan-800 text-xs font-bold rounded-full border border-cyan-200">
                                Question
                            </div>
                            <p className="text-2xl md:text-3xl text-center font-bold text-slate-900 leading-relaxed">{currentCard.question}</p>
                            
                            <div className="absolute bottom-6 flex items-center gap-2 text-slate-400 text-sm font-semibold animate-pulse">
                                <RotateCw className="w-4 h-4 text-cyan-600" /> Click to flip
                            </div>
                        </div>

                        {/* Back (Answer) */}
                        <div className="absolute inset-0 bg-cyan-50/40 border-2 border-cyan-200 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center shadow-xl" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                            <div className="absolute top-6 left-6 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                                Answer
                            </div>
                            <p className="text-xl md:text-2xl text-center text-slate-900 leading-relaxed font-semibold">{currentCard.answer}</p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6 pb-8">
                    <button 
                        onClick={handlePrev} 
                        disabled={deck.cards.length <= 1}
                        className="w-14 h-14 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                        title="Previous Card"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <button 
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold shadow-md shadow-cyan-600/20 transition-all active:scale-95 flex items-center gap-2"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <RotateCw className="w-5 h-5" /> Flip Card
                    </button>

                    <button 
                        onClick={handleNext} 
                        disabled={deck.cards.length <= 1}
                        className="w-14 h-14 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                        title="Next Card"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default StudentStudyDeck;
