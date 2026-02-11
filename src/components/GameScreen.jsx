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
        <div className="w-full h-dvh flex flex-col items-center justify-between px-3 py-3 sm:p-4 md:p-6 relative game-bg-gradient overflow-hidden">

            {/* Top Info Bar */}
            <div className="z-10 w-full max-w-lg flex justify-between items-center mt-2 sm:mt-4 shrink-0">
                <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20">
                    <span className="text-blue-300 font-bold uppercase tracking-wider text-xs block text-left">Quest</span>
                    <span className="text-2xl font-game text-white">{wordIndex + 1}/{WORDS ? WORDS.length : 0}</span>
                </div>

                <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20 text-center">
                    <span className="text-amber-400 font-bold uppercase tracking-wider text-xs block">Score</span>
                    <span className="text-2xl font-game text-white">{score}</span>
                </div>
            </div>

            {/* Expert Character & Hint Pill — character overlaps the left edge */}
            <motion.div
                className="z-10 w-full max-w-lg shrink-0 relative flex items-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                key={`hint-pill-${wordIndex}`}
            >
                {/* Character avatar — circular, on top of the pill's left edge */}
                <div className="shrink-0 w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem] rounded-full overflow-hidden border-[3px] border-amber-400 bg-gradient-to-br from-blue-100 to-slate-200 shadow-lg z-10 relative">
                    <img
                        src={expertImg}
                        alt="Expert character"
                        className="w-full h-full object-cover object-top"
                    />
                </div>

                {/* Pill-shaped hint container — slides well behind the avatar */}
                <div className="flex-1 -ml-8 sm:-ml-10 bg-white/90 backdrop-blur-sm rounded-r-full rounded-l-[2rem] py-3 pl-12 pr-5 sm:pl-14 sm:pr-6 sm:py-4 shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-white/40">
                    <p className="text-blue-900 font-semibold text-sm sm:text-base leading-snug text-center">
                        {currentWordObj.hint}
                    </p>
                </div>
            </motion.div>

            {/* Success / Error Message */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        key={`msg-${message}`}
                        className={`z-50 px-6 py-2 sm:px-8 sm:py-3 rounded-full font-game text-lg sm:text-2xl shadow-xl shrink-0 ${message === "Excellent!"
                            ? "bg-emerald-500 text-white"
                            : "bg-rose-500 text-white"
                            }`}
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Word Slots */}
            <div className="z-10 flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-4 shrink-0">
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

            <div className="z-10 mb-3 sm:mb-6 md:mb-12 shrink-0">
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
