import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WORDS } from "../data/words";
import { ArrowLeft, RefreshCw, Lightbulb, SkipForward } from "lucide-react";
import confetti from "canvas-confetti";
import Shuffle from "./Shuffle";

/**
 * Returns responsive tile size classes based on word length.
 * Longer words get smaller tiles to prevent horizontal overflow.
 * @param {number} length - Number of letters in the word
 * @returns {{ slot: string, tile: string }} Tailwind class strings
 */
function getTileClasses(length) {
    if (length >= 12) {
        return {
            slot: "w-8 h-10 sm:w-10 sm:h-12 md:w-14 md:h-16 rounded-lg",
            tile: "w-8 h-10 sm:w-10 sm:h-12 md:w-14 md:h-16 rounded-lg",
            font: "text-sm sm:text-lg md:text-2xl",
        };
    }
    if (length >= 9) {
        return {
            slot: "w-9 h-11 sm:w-11 sm:h-14 md:w-14 md:h-16 rounded-lg",
            tile: "w-9 h-11 sm:w-11 sm:h-14 md:w-14 md:h-16 rounded-lg",
            font: "text-base sm:text-lg md:text-2xl",
        };
    }
    if (length >= 7) {
        return {
            slot: "w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 rounded-xl",
            tile: "w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 rounded-xl",
            font: "text-lg sm:text-xl md:text-2xl",
        };
    }
    return {
        slot: "w-12 h-14 sm:w-14 sm:h-16 md:w-16 md:h-20 rounded-xl",
        tile: "w-12 h-14 sm:w-14 sm:h-16 md:w-16 md:h-20 rounded-xl",
        font: "text-xl sm:text-2xl md:text-2xl",
    };
}

export default function GameScreen({ onEnd }) {
    const [gameWords] = useState(() =>
        [...WORDS].sort(() => Math.random() - 0.5).slice(0, 5)
    );

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
    const [skippedIndices, setSkippedIndices] = useState(new Set());

    /** Tile size classes derived from current word length */
    const tileClasses = useMemo(() => {
        if (!currentWordObj) return getTileClasses(6);
        return getTileClasses(currentWordObj.word.length);
    }, [currentWordObj]);

    /** Load new word when wordIndex changes */
    useEffect(() => {
        if (gameWords.length === 0) return;

        if (wordIndex >= gameWords.length) {
            onEnd(score);
            return;
        }

        const wordObj = gameWords[wordIndex];
        if (!wordObj) return;

        setCurrentWordObj(wordObj);

        const letters = wordObj.word.split("").map((l, i) => ({
            id: `${wordIndex}-${l}-${i}`,
            letter: l,
        }));

        setShuffledLetters([...letters].sort(() => Math.random() - 0.5));
        setPlacedLetters(new Array(wordObj.word.length).fill(null));
        setIsSuccess(false);
        setIsError(false);
        setShowShuffleAnim(false);
        setIsSkipped(false);
    }, [wordIndex, onEnd, score, gameWords]);

    /** Check if word is complete and correct */
    const checkCompletion = useCallback(
        (currentPlaced) => {
            if (currentPlaced.every((l) => l !== null)) {
                const formedWord = currentPlaced.map((l) => l.letter).join("");
                if (formedWord === currentWordObj.word) {
                    handleSuccess();
                } else {
                    handleError();
                }
            }
        },
        [currentWordObj]
    );

    const handleDragEnd = useCallback(
        (e, info, letterObj) => {
            const elements = document.elementsFromPoint(info.point.x, info.point.y);
            const slotElement = elements.find(
                (el) => el.getAttribute("data-slot-index") !== null
            );

            if (slotElement) {
                const slotIndex = parseInt(
                    slotElement.getAttribute("data-slot-index")
                );

                if (placedLetters[slotIndex] === null) {
                    const newPlaced = [...placedLetters];
                    newPlaced[slotIndex] = letterObj;
                    setPlacedLetters(newPlaced);
                    setShuffledLetters((prev) =>
                        prev.filter((l) => l.id !== letterObj.id)
                    );
                    checkCompletion(newPlaced);
                }
            }
        },
        [placedLetters, checkCompletion]
    );

    const handleReturnToShelf = useCallback(
        (index) => {
            if (isSuccess) return;
            const letter = placedLetters[index];
            if (letter) {
                const newPlaced = [...placedLetters];
                newPlaced[index] = null;
                setPlacedLetters(newPlaced);
                setShuffledLetters((prev) => [...prev, letter]);
            }
        },
        [isSuccess, placedLetters]
    );

    const handleReset = useCallback(() => {
        if (isSuccess || !currentWordObj) return;
        const allPlaced = placedLetters.filter((l) => l !== null);
        setPlacedLetters(new Array(currentWordObj.word.length).fill(null));
        setShuffledLetters((prev) =>
            [...prev, ...allPlaced].sort(() => Math.random() - 0.5)
        );
    }, [isSuccess, currentWordObj, placedLetters]);

    const handlePrevious = useCallback(() => {
        if (wordIndex > 0) {
            setWordIndex((prev) => prev - 1);
        }
    }, [wordIndex]);

    const handleSkip = useCallback(() => {
        if (isSuccess) return;

        if (!solvedIndices.has(wordIndex)) {
            setSkippedIndices((prev) => new Set(prev).add(wordIndex));
        }

        setIsSkipped(true);
        setTimeout(() => setWordIndex((prev) => prev + 1), 400);
    }, [isSuccess, solvedIndices, wordIndex]);

    const handleSuccess = useCallback(() => {
        setIsSuccess(true);

        if (!solvedIndices.has(wordIndex)) {
            setScore((prev) => prev + 20);
            setSolvedIndices((prev) => new Set(prev).add(wordIndex));
            setSkippedIndices((prev) => {
                const next = new Set(prev);
                next.delete(wordIndex);
                return next;
            });
        }

        setShowShuffleAnim(true);
    }, [solvedIndices, wordIndex]);

    const handleShuffleComplete = useCallback(() => {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#3b82f6", "#f59e0b", "#ffffff"],
        });
        setTimeout(() => setWordIndex((prev) => prev + 1), 1500);
    }, []);

    const handleError = useCallback(() => {
        setIsError(true);
        setTimeout(() => setIsError(false), 500);
    }, []);

    if (!currentWordObj) {
        return (
            <div className="w-full h-dvh flex items-center justify-center text-white text-xl">
                Loading Quest...
            </div>
        );
    }

    const isPrevDisabled = wordIndex === 0 || isSuccess;

    return (
        <div className="w-full h-dvh flex flex-col items-center px-3 py-4 sm:px-4 sm:py-5 md:p-6 relative overflow-hidden">

            {/* ── Top Bar ── */}
            <div className="w-full max-w-lg flex justify-between items-center shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 rounded-full backdrop-blur-md border border-white/10">
                    <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-blue-300">
                        Level
                    </span>
                    <span className="text-base sm:text-lg font-bold text-white">
                        {Math.min(wordIndex + 1, 5)}/5
                    </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 rounded-full backdrop-blur-md border border-white/10">
                    <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-amber-400">
                        Score
                    </span>
                    <span className="text-base sm:text-lg font-bold text-white">
                        {score}
                    </span>
                </div>
            </div>

            {/* ── Hint Card ── */}
            <motion.div
                className="w-full max-w-lg bg-gradient-to-br from-blue-900/80 to-slate-900/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl px-4 py-3 sm:p-5 md:p-6 mt-3 sm:mt-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-center relative overflow-hidden shrink-0"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                key={currentWordObj.word}
            >
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 bg-amber-500/10 rounded-full">
                        <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                    </div>
                    <p className="text-blue-50 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                        {currentWordObj.hint}
                    </p>
                </div>
            </motion.div>

            {/* ── Slots Area (grows to fill available space) ── */}
            <div className="flex-1 flex items-center justify-center w-full min-h-0 py-2 sm:py-4">
                <motion.div
                    className={`flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3 ${isError ? "animate-shake" : ""}`}
                    layout
                >
                    {placedLetters.map((letter, index) => (
                        <div
                            key={`slot-${index}`}
                            data-slot-index={index}
                            onClick={() => handleReturnToShelf(index)}
                            className={`
                                ${tileClasses.slot} border-2 transition-all duration-300 relative flex items-center justify-center
                                ${isSuccess
                                    ? "bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                                    : isError
                                        ? "bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                                        : "bg-white/5 border-white/10 hover:border-blue-400/50"
                                }
                            `}
                        >
                            {letter && (
                                <motion.div
                                    layoutId={letter.id}
                                    className="w-full h-full bg-gradient-to-t from-blue-600 to-blue-500 rounded-lg shadow-lg flex items-center justify-center border-t border-white/20"
                                    transition={{
                                        type: "spring",
                                        bounce: 0.2,
                                        duration: 0.6,
                                    }}
                                >
                                    <span
                                        className={`${tileClasses.font} font-bold text-white drop-shadow-md`}
                                    >
                                        {letter.letter}
                                    </span>
                                </motion.div>
                            )}
                            {!letter && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/30" />
                                </div>
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ── Shuffle Animation Overlay ── */}
            <AnimatePresence>
                {showShuffleAnim && currentWordObj && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="flex flex-col items-center gap-4 w-full max-w-[90vw] md:max-w-lg"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.3 }}
                        >
                            <div className="px-4 py-5 md:px-8 md:py-6 w-full bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-xl border border-green-500/40 rounded-3xl shadow-[0_0_60px_rgba(34,197,94,0.3)] overflow-hidden flex items-center justify-center">
                                <Shuffle
                                    text={currentWordObj.word}
                                    className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-wide md:tracking-widest"
                                    shuffleDirection="up"
                                    duration={0.4}
                                    shuffleTimes={5}
                                    stagger={0.06}
                                    onShuffleComplete={handleShuffleComplete}
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        letterSpacing: "clamp(0.05em, 2vw, 0.15em)",
                                    }}
                                />
                            </div>
                            <motion.p
                                className="text-green-300 text-base md:text-lg font-medium tracking-wide"
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

            {/* ── Letter Shelf ── */}
            <div className="w-full max-w-lg shrink-0 flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3 p-2.5 sm:p-3 md:p-4 bg-black/20 rounded-2xl sm:rounded-3xl backdrop-blur-sm border border-white/5 min-h-[3.5rem] sm:min-h-[4.5rem]">
                <AnimatePresence mode="popLayout">
                    {shuffledLetters.map((letter) => (
                        <motion.div
                            key={letter.id}
                            layoutId={letter.id}
                            drag
                            dragSnapToOrigin
                            whileDrag={{
                                scale: 1.1,
                                zIndex: 50,
                                cursor: "grabbing",
                            }}
                            dragTransition={{
                                bounceStiffness: 600,
                                bounceDamping: 20,
                            }}
                            onDragEnd={(e, info) =>
                                handleDragEnd(e, info, letter)
                            }
                            className={`${tileClasses.tile} bg-gradient-to-t from-amber-600 to-amber-500 shadow-lg flex items-center justify-center cursor-grab border-b-4 border-amber-700 active:scale-95 transition-transform`}
                        >
                            <span
                                className={`${tileClasses.font} font-bold text-white drop-shadow-sm`}
                            >
                                {letter.letter}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* ── Bottom Controls ── */}
            <div className="flex gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-3 md:mt-4 shrink-0 flex-wrap justify-center pb-1">
                <button
                    onClick={handlePrevious}
                    disabled={isPrevDisabled}
                    className={`
                        flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg
                        ${isPrevDisabled
                            ? "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30 active:scale-95"
                        }
                    `}
                >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    Previous
                </button>
                <button
                    onClick={handleReset}
                    disabled={isSuccess}
                    className={`
                        flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg
                        ${isSuccess
                            ? "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                            : "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/30 active:scale-95"
                        }
                    `}
                >
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                    Reset
                </button>
                <button
                    onClick={handleSkip}
                    disabled={isSuccess}
                    className={`
                        flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg
                        ${isSuccess
                            ? "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-500/30 active:scale-95"
                        }
                    `}
                >
                    <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
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
