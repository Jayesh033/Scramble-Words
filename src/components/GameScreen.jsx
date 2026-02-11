import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WORDS } from "../data/words";
import WordLinker from "./WordLinker";
import expertImg from "../assets/expert.png";

export default function GameScreen({ onEnd }) {
    const [wordIndex, setWordIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [shuffledLetters, setShuffledLetters] = useState([]);

    const currentWordObj = (WORDS && WORDS[wordIndex]) ? WORDS[wordIndex] : null;

    // Shuffle letters whenever wordIndex changes
    useEffect(() => {
        if (currentWordObj && currentWordObj.word) {
            const letters = currentWordObj.word.split("").sort(() => Math.random() - 0.5);
            setShuffledLetters(letters);
        }
    }, [wordIndex]);

    const handleWordFound = (foundWord) => {
        if (isTransitioning || !currentWordObj) return;

        if (foundWord === currentWordObj.word) {
            handleSuccess();
        } else {
            handleError();
        }
    };

    const handleSuccess = () => {
        setScore(prev => prev + 10);
        setMessage("Excellent!");
        setIsTransitioning(true);

        setTimeout(() => {
            setMessage("");
            if (WORDS && wordIndex < WORDS.length - 1) {
                setWordIndex(prev => prev + 1);
                setIsTransitioning(false);
            } else {
                onEnd(score + 10);
            }
        }, 1500);
    };

    const handleError = () => {
        setIsError(true);
        setMessage("Next Question...");
        setIsTransitioning(true);
        
        setTimeout(() => {
            setIsError(false);
            setMessage("");
            if (WORDS && wordIndex < WORDS.length - 1) {
                setWordIndex(prev => prev + 1);
                setIsTransitioning(false);
            } else {
                onEnd(score);
            }
        }, 1200);
    };

    if (!currentWordObj) return <div className="text-white p-10 font-game">Loading...</div>;

    return (
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-between p-6 relative game-bg-gradient overflow-hidden">
            
            {/* Top Info Bar */}
            <div className="z-10 w-full max-w-lg flex justify-between items-center mt-4">
                <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20">
                    <span className="text-blue-300 font-bold uppercase tracking-wider text-xs block text-left">Quest</span>
                    <span className="text-2xl font-game text-white">{wordIndex + 1}/{WORDS ? WORDS.length : 0}</span>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20 text-right">
                    <span className="text-amber-400 font-bold uppercase tracking-wider text-xs block">Score</span>
                    <span className="text-2xl font-game text-white">{score}</span>
                </div>
            </div>

            {/* Expert Character & Hint Bubble Section */}
            <div className="z-10 w-full max-w-2xl flex flex-col items-center gap-4 py-8">
                <div className="relative flex flex-col md:flex-row items-center justify-center w-full gap-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={`hint-${wordIndex}`}
                        className="bg-white text-blue-900 p-6 rounded-3xl shadow-2xl max-w-sm relative border-4 border-blue-100 italic font-medium text-lg text-center"
                    >
                        {currentWordObj.hint}
                    </motion.div>

                    <motion.div
                        className="w-32 h-32 md:w-40 md:h-40 relative"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                    >
                        <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse" />
                        <img 
                            src={expertImg} 
                            alt="Expert" 
                            className="w-full h-full object-contain relative z-10"
                        />
                    </motion.div>
                </div>

                <AnimatePresence>
                    {message && (
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            key={`msg-${message}`}
                            className={`px-8 py-3 rounded-full font-game text-2xl shadow-xl z-50 mt-4 ${
                                message === "Excellent!" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                            }`}
                        >
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Active Word Slots */}
            <div className="z-10 flex gap-2 mb-4">
                {(currentWordObj.word || "").split("").map((_, i) => (
                    <div 
                        key={`${wordIndex}-${i}`}
                        className={`w-10 h-12 sm:w-12 sm:h-14 rounded-xl border-b-4 bg-white/10 border-white/20 flex items-center justify-center
                            ${isError ? 'animate-shake border-rose-500 bg-rose-500/10' : ''}
                            ${isTransitioning ? 'border-emerald-500 bg-emerald-500/10' : ''}
                        `}
                    >
                        {isTransitioning && (
                            <motion.span 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }} 
                                className="text-white font-game text-2xl"
                            >
                                {currentWordObj.word[i]}
                            </motion.span>
                        )}
                    </div>
                ))}
            </div>

            <div className="z-10 mb-12">
                <WordLinker 
                    key={`linker-${wordIndex}`}
                    letters={shuffledLetters} 
                    onWordFinalize={handleWordFound}
                />
            </div>

            <style>{`
                .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
            `}</style>
        </div>
    );
}
