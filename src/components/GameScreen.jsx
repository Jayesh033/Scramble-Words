import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WORDS } from "../data/words";
import WordLinker from "./WordLinker";
import expertImg from "../assets/MaleImg.png";

export default function GameScreen({ onEnd }) {
    const [wordIndex, setWordIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [shuffledLetters, setShuffledLetters] = useState([]);
    const [placedLetters, setPlacedLetters] = useState([]); // Array of {char, originalIndex} or null
    const [usedLetterIndices, setUsedLetterIndices] = useState([]); // Indices from shuffledLetters
    const [hintUsedCount, setHintUsedCount] = useState(0);
    const [wrongTryCount, setWrongTryCount] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [showRevealedPop, setShowRevealedPop] = useState(false);

    // Limit to first 5 questions
    const gameWords = (WORDS || []).slice(0, 5);
    const currentWordObj = (gameWords && gameWords[wordIndex]) ? gameWords[wordIndex] : null;

    // Shuffle letters whenever wordIndex changes
    useEffect(() => {
        if (currentWordObj && currentWordObj.word) {
            const letters = currentWordObj.word.split("").sort(() => Math.random() - 0.5);
            setShuffledLetters(letters);
            setPlacedLetters(new Array(currentWordObj.word.length).fill(null));
            setUsedLetterIndices([]);
            setHintUsedCount(0);
            setWrongTryCount(0);
            setIsLocked(false);
            setIsError(false);
            setMessage("");
            setShowRevealedPop(false);
        }
    }, [wordIndex, currentWordObj?.word]);

    const handleLetterPlace = (shuffledIndex, targetBoxIndex = null) => {
        if (isLocked || isTransitioning || usedLetterIndices.includes(shuffledIndex)) return;

        const char = shuffledLetters[shuffledIndex];
        const nextEmptyIndex = targetBoxIndex !== null ? targetBoxIndex : placedLetters.indexOf(null);

        if (nextEmptyIndex !== -1 && nextEmptyIndex < placedLetters.length) {
            // If targeted box is already full, we can either swap or just place in next empty
            // User said "place over there", so let's allow overwriting or returning old letter
            const oldPlaced = placedLetters[nextEmptyIndex];
            const newPlaced = [...placedLetters];
            const newUsed = [...usedLetterIndices];

            if (oldPlaced) {
                // Remove old letter from used list
                const oldIdx = newUsed.indexOf(oldPlaced.shuffledIndex);
                if (oldIdx !== -1) newUsed.splice(oldIdx, 1);
            }

            newPlaced[nextEmptyIndex] = { char, shuffledIndex };
            newUsed.push(shuffledIndex);

            setPlacedLetters(newPlaced);
            setUsedLetterIndices(newUsed);

            // Auto-validate if all filled
            if (newPlaced.every(p => p !== null)) {
                const formedWord = newPlaced.map(p => p.char).join("");
                validateWord(formedWord);
            }
        }
    };

    const handleRemoveLetter = (index) => {
        if (isLocked || isTransitioning || !placedLetters[index]) return;

        const removedLetter = placedLetters[index];
        const newPlaced = [...placedLetters];
        newPlaced[index] = null;
        setPlacedLetters(newPlaced);

        setUsedLetterIndices(prev => prev.filter(idx => idx !== removedLetter.shuffledIndex));
    };

    const validateWord = (formedWord) => {
        if (formedWord === currentWordObj.word) {
            handleSuccess();
        } else {
            handleError();
        }
    };

    const handleSuccess = () => {
        setScore(prev => prev + 10);
        setMessage("Excellent!");
        setIsTransitioning(true);
        setIsLocked(true);

        setTimeout(() => {
            setMessage("");
            if (wordIndex < gameWords.length - 1) {
                setWordIndex(prev => prev + 1);
                setIsTransitioning(false);
            } else {
                onEnd(score + 10);
            }
        }, 1500);
    };

    const handleError = () => {
        const nextWrongCount = wrongTryCount + 1;
        setWrongTryCount(nextWrongCount);

        setIsError(true);
        setMessage("Try Again!");

        if (nextWrongCount >= 2) {
            setIsLocked(true);
            setTimeout(() => {
                setIsError(false);
                setMessage("");
                setShowRevealedPop(true);
                setIsTransitioning(true); // Fill slots as well for visual clarity

                setTimeout(() => {
                    setShowRevealedPop(false);
                    if (wordIndex < gameWords.length - 1) {
                        setWordIndex(prev => prev + 1);
                        setIsTransitioning(false);
                    } else {
                        onEnd(score);
                    }
                }, 2000);
            }, 1000);
        } else {
            setTimeout(() => {
                setIsError(false);
                setMessage("");
                handleReset(); // Automatically reset on wrong attempt to allow retry
            }, 1000);
        }
    };

    const handleReset = () => {
        if (isLocked || isTransitioning) return;
        setPlacedLetters(new Array(currentWordObj.word.length).fill(null));
        setUsedLetterIndices([]);
    };

    const handleHint = () => {
        if (isLocked || isTransitioning || hintUsedCount >= 3 || hintUsedCount >= currentWordObj.word.length) {
            if (hintUsedCount >= 3) setMessage("Hints Exhausted");
            setTimeout(() => setMessage(""), 1000);
            return;
        }

        const nextEmptyIndex = placedLetters.indexOf(null);
        if (nextEmptyIndex === -1) return;

        const targetChar = currentWordObj.word[nextEmptyIndex];

        // Find this character in shuffledLetters that isn't used yet
        const shuffledIndex = shuffledLetters.findIndex((char, idx) =>
            char === targetChar && !usedLetterIndices.includes(idx)
        );

        if (shuffledIndex !== -1) {
            handleLetterPlace(shuffledIndex, nextEmptyIndex);
            setHintUsedCount(prev => prev + 1);
        }
    };

    if (!currentWordObj) return <div className="text-white p-10 font-game">Loading...</div>;

    return (
        <div className="w-full h-dvh flex flex-col items-center justify-between px-3 py-3 sm:p-4 md:p-6 relative game-bg-gradient overflow-hidden">

            {/* Top Info Bar */}
            <div className="z-10 w-full max-w-lg flex justify-between items-center mt-1 sm:mt-4 shrink-0">
                <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 sm:px-6 sm:py-2 rounded-2xl border border-white/20">
                    <span className="text-blue-300 font-bold uppercase tracking-wider text-[10px] sm:text-xs block text-left">Quest</span>
                    <span className="text-xl sm:text-2xl font-game text-white">{wordIndex + 1}/{gameWords ? gameWords.length : 0}</span>
                </div>

                <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 sm:px-6 sm:py-2 rounded-2xl border border-white/20 text-center">
                    <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs block">Score</span>
                    <span className="text-xl sm:text-2xl font-game text-white">{score}</span>
                </div>
            </div>

            {/* Expert Character & Hint Pill */}
            <motion.div
                className="z-10 w-full max-w-lg shrink-0 relative flex items-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                key={`hint-pill-${wordIndex}`}
            >
                <div className="shrink-0 w-12 h-12 sm:w-[4.5rem] sm:h-[4.5rem] rounded-full overflow-hidden border-[3px] border-amber-400 bg-gradient-to-br from-blue-100 to-slate-200 shadow-lg z-10 relative">
                    <img
                        src={expertImg}
                        alt="Expert character"
                        className="w-full h-full object-cover object-top"
                    />
                </div>

                <div className="flex-1 -ml-6 sm:-ml-10 bg-white/90 backdrop-blur-sm rounded-r-full rounded-l-[2rem] py-2 pl-10 pr-4 sm:pl-14 sm:pr-6 sm:py-4 shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-white/40">
                    <p className="text-blue-900 font-semibold text-xs sm:text-base leading-tight sm:leading-snug text-center">
                        {currentWordObj.hint}
                    </p>
                </div>
            </motion.div>

            {/* Success / Error Message / Reveal Pop */}
            <div className="h-10 sm:h-14 flex items-center justify-center shrink-0">
                <AnimatePresence mode="wait">
                    {message && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            key={`msg-${message}`}
                            className={`z-50 px-5 py-1.5 sm:px-8 sm:py-3 rounded-full font-game text-base sm:text-2xl shadow-xl ${message === "Excellent!"
                                ? "bg-emerald-500 text-white"
                                : "bg-rose-500 text-white"
                                }`}
                        >
                            {message}
                        </motion.div>
                    )}

                    {showRevealedPop && !message && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="z-50 bg-amber-500 text-blue-900 px-6 py-2 sm:px-8 sm:py-3 rounded-2xl font-game text-lg sm:text-2xl shadow-[0_0_25px_rgba(245,158,11,0.5)] border-2 border-amber-300"
                        >
                            Correct: <span className="text-white tracking-widest">{currentWordObj.word}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Active Word Slots */}
            <div className="z-10 flex flex-wrap justify-center gap-1 sm:gap-2 mb-1 sm:mb-4 shrink-0">
                {placedLetters.map((placed, i) => (
                    <div
                        key={`${wordIndex}-${i}`}
                        data-box-index={i}
                        onClick={() => handleRemoveLetter(i)}
                        className={`w-9 h-11 sm:w-12 sm:h-14 rounded-xl border-b-4 bg-white/10 border-white/20 flex items-center justify-center transition-all duration-300
                            ${placed ? 'cursor-pointer hover:bg-white/20' : ''}
                            ${isError ? 'animate-shake border-rose-500 bg-rose-500/10' : ''}
                            ${(isTransitioning && !isError) ? 'border-emerald-500 bg-emerald-500/20 success-glow scale-105' : ''}
                        `}
                    >
                        {(placed || isTransitioning) && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-white font-game text-xl sm:text-2xl pointer-events-none"
                            >
                                {isTransitioning ? (currentWordObj.word[i]) : placed.char}
                            </motion.span>
                        )}
                    </div>
                ))}
            </div>

            <div className="z-10 w-full max-w-lg mb-2 sm:mb-6 shrink-0 flex flex-col items-center gap-4 sm:gap-6">
                <WordLinker
                    key={`linker-${wordIndex}`}
                    letters={shuffledLetters}
                    usedIndices={usedLetterIndices}
                    onLetterSelect={handleLetterPlace}
                />

                <div className="flex gap-3 sm:gap-4 pb-2 sm:pb-0">
                    <motion.button
                        onClick={handleHint}
                        className="bg-amber-400 backdrop-blur-md px-4 py-1.5 sm:px-6 sm:py-2 rounded-2xl border border-amber-500 text-blue-900 font-game text-base sm:text-lg uppercase tracking-wider hover:bg-amber-300 transition-all shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Hint ({3 - hintUsedCount})
                    </motion.button>

                    <motion.button
                        onClick={handleReset}
                        className="bg-white/10 backdrop-blur-md px-4 py-1.5 sm:px-6 sm:py-2 rounded-2xl border border-white/20 text-white font-game text-base sm:text-lg uppercase tracking-wider hover:bg-white/20 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Reset
                    </motion.button>
                </div>
            </div>

            <style>{`
                .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
                .success-glow {
                    animation: success-pulse 1s infinite alternate;
                    box-shadow: 0 0 25px rgba(16, 185, 129, 0.8), inset 0 0 15px rgba(16, 185, 129, 0.4);
                    border-color: #10b981 !important;
                    background: rgba(16, 185, 129, 0.15);
                }
                @keyframes success-pulse {
                    from { box-shadow: 0 0 15px rgba(16, 185, 129, 0.5), inset 0 0 10px rgba(16, 185, 129, 0.3); transform: scale(1.05); }
                    to { box-shadow: 0 0 35px rgba(16, 185, 129, 1), inset 0 0 20px rgba(16, 185, 129, 0.5); transform: scale(1.08); }
                }
            `}</style>
        </div>
    );
}
