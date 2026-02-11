import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WORDS } from "../data/words";
import { ArrowLeft, ArrowRight, RefreshCw, Lightbulb, SkipForward } from "lucide-react";
import confetti from "canvas-confetti";
import Shuffle from "./Shuffle";

export default function GameScreen({ onEnd }) {
    // Shuffle words once on mount to ensure random order every game
    const [gameWords] = useState(() => [...WORDS].sort(() => Math.random() - 0.5).slice(0, 5));

    const [wordIndex, setWordIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [currentWordObj, setCurrentWordObj] = useState(null);
    const [shuffledLetters, setShuffledLetters] = useState([]);
    const [placedLetters, setPlacedLetters] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [showShuffleAnim, setShowShuffleAnim] = useState(false);
    const [isSkipped, setIsSkipped] = useState(false);

    const [solvedIndices, setSolvedIndices] = useState(new Set());
    // Track skipped indices — score stays 0 for these
    const [skippedIndices, setSkippedIndices] = useState(new Set());

    // Load new word
    useEffect(() => {
        if (gameWords.length === 0) return;

        if (wordIndex >= gameWords.length) {
            onEnd(score);
            return;
        }

        const wordObj = gameWords[wordIndex];
        if (!wordObj) return;

        setCurrentWordObj(wordObj);

        // Re-initialize letters
        const letters = wordObj.word.split("").map((l, i) => ({
            id: `${wordIndex}-${l}-${i}`,
            letter: l
        }));

        setShuffledLetters([...letters].sort(() => Math.random() - 0.5));
        setPlacedLetters(new Array(wordObj.word.length).fill(null));
        setIsSuccess(false);
        setIsError(false);
        setShowShuffleAnim(false);
        setIsSkipped(false);
    }, [wordIndex, onEnd, score, gameWords]);

    const handleDragEnd = (e, info, letterObj) => {
        const elements = document.elementsFromPoint(info.point.x, info.point.y);
        const slotElement = elements.find(el => el.getAttribute("data-slot-index") !== null);

        if (slotElement) {
            const slotIndex = parseInt(slotElement.getAttribute("data-slot-index"));

            // Only place if slot is empty
            if (placedLetters[slotIndex] === null) {
                const newPlaced = [...placedLetters];
                newPlaced[slotIndex] = letterObj;
                setPlacedLetters(newPlaced);
                setShuffledLetters(prev => prev.filter(l => l.id !== letterObj.id));
                checkCompletion(newPlaced);
            }
        }
    };

    const handleReturnToShelf = (index) => {
        if (isSuccess) return;
        const letter = placedLetters[index];
        if (letter) {
            const newPlaced = [...placedLetters];
            newPlaced[index] = null;
            setPlacedLetters(newPlaced);
            setShuffledLetters(prev => [...prev, letter]);
        }
    };

    const handleReset = () => {
        if (isSuccess) return;
        // Return all placed letters to shelf
        const allPlaced = placedLetters.filter(l => l !== null);
        setPlacedLetters(new Array(currentWordObj.word.length).fill(null));
        setShuffledLetters(prev => [...prev, ...allPlaced].sort(() => Math.random() - 0.5));
    };

    const handlePrevious = () => {
        if (wordIndex > 0) {
            setWordIndex(prev => prev - 1);
        }
    };

    // Skip / Next — move to next word, mark as skipped (0 score)
    const handleSkip = () => {
        if (isSuccess) return; // Already solved, no need to skip

        // Mark this word as skipped — no score awarded
        if (!solvedIndices.has(wordIndex)) {
            setSkippedIndices(prev => new Set(prev).add(wordIndex));
        }

        setIsSkipped(true);
        // Move to next word after a brief moment
        setTimeout(() => setWordIndex(prev => prev + 1), 400);
    };

    const checkCompletion = (currentPlaced) => {
        if (currentPlaced.every(l => l !== null)) {
            const formedWord = currentPlaced.map(l => l.letter).join("");
            if (formedWord === currentWordObj.word) {
                handleSuccess();
            } else {
                handleError();
            }
        }
    };

    const handleSuccess = () => {
        setIsSuccess(true);

        // Only increment score if not already solved
        if (!solvedIndices.has(wordIndex)) {
            setScore(prev => prev + 1);
            setSolvedIndices(prev => new Set(prev).add(wordIndex));
            // Remove from skipped if it was previously skipped
            setSkippedIndices(prev => {
                const next = new Set(prev);
                next.delete(wordIndex);
                return next;
            });
        }

        // Show shuffle animation first, then confetti after it finishes
        setShowShuffleAnim(true);
    };

    const handleShuffleComplete = () => {
        // Fire confetti after shuffle animation completes
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#f59e0b', '#ffffff']
        });
        setTimeout(() => setWordIndex(prev => prev + 1), 1500);
    };

    const handleError = () => {
        setIsError(true);
        setTimeout(() => setIsError(false), 500);
    };

    if (!currentWordObj) {
        return <div className="w-full h-full min-h-screen flex items-center justify-center text-white text-xl">Loading Quest...</div>;
    }

    return (
        <div className="w-full h-full min-h-screen flex flex-col items-center p-6 relative">

            {/* Top Bar */}
            <div className="w-full max-w-lg flex flex-col gap-4 mb-8">
                <div className="flex justify-between items-center text-blue-100">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur-md border border-white/10">
                        <span className="text-sm font-medium uppercase tracking-wider text-blue-300">Level</span>
                        <span className="text-lg font-bold text-white">{Math.min(wordIndex + 1, 5)}/5</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur-md border border-white/10">
                        <span className="text-sm font-medium uppercase tracking-wider text-amber-400">Score</span>
                        <span className="text-lg font-bold text-white">{score}</span>
                    </div>
                </div>


            </div>

            {/* Hint Card */}
            <motion.div
                className="w-full max-w-lg bg-gradient-to-br from-blue-900/80 to-slate-900/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 mb-12 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-center relative overflow-hidden"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                key={currentWordObj.word}
            >
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-amber-500/10 rounded-full">
                        <Lightbulb className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-blue-50 text-lg font-medium leading-relaxed">
                        {currentWordObj.hint}
                    </p>
                </div>
            </motion.div>

            {/* Slots Area */}
            <motion.div
                className={`flex flex-wrap justify-center gap-3 mb-16 ${isError ? 'animate-shake' : ''}`}
                layout
            >
                {placedLetters.map((letter, index) => (
                    <div
                        key={`slot-${index}`}
                        data-slot-index={index}
                        onClick={() => handleReturnToShelf(index)}
                        className={`
              w-14 h-16 md:w-16 md:h-20 rounded-xl border-2 transition-all duration-300 relative flex items-center justify-center
              ${isSuccess
                                ? 'bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                                : isError
                                    ? 'bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                    : 'bg-white/5 border-white/10 hover:border-blue-400/50'
                            }
            `}
                    >
                        {letter && (
                            <motion.div
                                layoutId={letter.id}
                                className="w-full h-full bg-gradient-to-t from-blue-600 to-blue-500 rounded-lg shadow-lg flex items-center justify-center border-t border-white/20"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            >
                                <span className="text-2xl font-bold text-white drop-shadow-md">{letter.letter}</span>
                            </motion.div>
                        )}
                        {!letter && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                                <div className="w-2 h-2 rounded-full bg-white/30" />
                            </div>
                        )}
                    </div>
                ))}
            </motion.div>

            {/* Shuffle Animation Overlay - shown on correct answer */}
            <AnimatePresence>
                {showShuffleAnim && currentWordObj && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="flex flex-col items-center gap-6"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.3 }}
                        >
                            <div className="px-8 py-6 bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-xl border border-green-500/40 rounded-3xl shadow-[0_0_60px_rgba(34,197,94,0.3)]">
                                <Shuffle
                                    text={currentWordObj.word}
                                    className="text-5xl md:text-6xl font-black tracking-widest"
                                    shuffleDirection="up"
                                    duration={0.4}
                                    shuffleTimes={5}
                                    stagger={0.06}
                                    onShuffleComplete={handleShuffleComplete}
                                    style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '0.15em' }}
                                />
                            </div>
                            <motion.p
                                className="text-green-300 text-lg font-medium tracking-wide"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                ✨ Correct! Well done! ✨
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Letter Shelf */}
            <div className="w-full max-w-2xl min-h-[100px] flex flex-wrap justify-center gap-3 p-4 bg-black/20 rounded-3xl backdrop-blur-sm border border-white/5">
                <AnimatePresence mode="popLayout">
                    {shuffledLetters.map((letter) => (
                        <motion.div
                            key={letter.id}
                            layoutId={letter.id}
                            drag
                            dragSnapToOrigin
                            whileDrag={{ scale: 1.1, zIndex: 50, cursor: 'grabbing' }}
                            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                            onDragEnd={(e, info) => handleDragEnd(e, info, letter)}
                            className="w-14 h-16 md:w-16 md:h-20 bg-gradient-to-t from-amber-600 to-amber-500 rounded-xl shadow-lg flex items-center justify-center cursor-grab border-b-4 border-amber-700 active:scale-95 transition-transform"
                        >
                            <span className="text-2xl font-bold text-white drop-shadow-sm">{letter.letter}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="flex gap-4 mt-8 flex-wrap justify-center">
                <button
                    onClick={handlePrevious}
                    disabled={wordIndex === 0 || isSuccess}
                    className={`
                        flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all shadow-lg
                        ${wordIndex === 0 || isSuccess
                            ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30 active:scale-95'
                        }
                    `}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Previous
                </button>
                <button
                    onClick={handleReset}
                    disabled={isSuccess}
                    className={`
                        flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all shadow-lg
                        ${isSuccess
                            ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                            : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/30 active:scale-95'
                        }
                    `}
                >
                    <RefreshCw className="w-5 h-5" />
                    Reset
                </button>
                <button
                    onClick={handleSkip}
                    disabled={isSuccess}
                    className={`
                        flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all shadow-lg
                        ${isSuccess
                            ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-500/30 active:scale-95'
                        }
                    `}
                >
                    <SkipForward className="w-5 h-5" />
                    Skip
                </button>
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
