import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import bgImg from "../assets/front-page/NewSartScreen.png";

export default function StartScreen({ onStart }) {
    const [showNamePopup, setShowNamePopup] = useState(false);
    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');

    const handleStartClick = () => {
        setShowNamePopup(true);
    };

    const handleNameSubmit = (e) => {
        e.preventDefault();
        const trimmedName = userName.trim();

        if (!trimmedName) {
            setError('Please enter your name');
            return;
        }

        // Validation: Words only (no numbers, no special chars)
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(trimmedName)) {
            setError('Name must contain only letters (no numbers or special characters)');
            return;
        }

        setError('');
        setShowNamePopup(false);

        setTimeout(() => {
            onStart(trimmedName);
        }, 600);
    };

    return (
        <div className="w-full h-dvh flex items-center justify-center bg-[#0d1b3e]">
            {/* Phone-width container — same look on mobile & desktop */}
            <div
                className="relative w-full max-w-[480px] h-full flex flex-col items-center justify-end overflow-hidden"
                style={{
                    backgroundImage: `url(${bgImg})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="z-20 w-[40%] max-w-[150px] sm:w-[50%] sm:max-w-[200px] mb-1 sm:mb-3">
                    <motion.button
                        onClick={handleStartClick}
                        className="game-button-blue w-full py-2 sm:py-2.5 rounded-[1rem] sm:rounded-[1.2rem] font-game text-xs sm:text-base md:text-lg tracking-widest uppercase"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Start Quest
                    </motion.button>
                </div>

                {/* Name Input Popup */}
                <AnimatePresence>
                    {showNamePopup && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
                            onClick={() => setShowNamePopup(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative bg-white shadow-2xl w-full max-w-[320px] min-[375px]:max-w-[340px] p-5 min-[375px]:p-6 border-[4px] sm:border-[6px] border-[#0066B2] rounded-2xl"
                            >
                                <button
                                    onClick={() => setShowNamePopup(false)}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-5 h-5 min-[375px]:w-6 min-[375px]:h-6" />
                                </button>

                                <div className="text-center mb-4 min-[375px]:mb-6">
                                    <div className="w-14 h-14 min-[375px]:w-16 min-[375px]:h-16 sm:w-20 sm:h-20 bg-[#0066B2] flex items-center justify-center mx-auto mb-3 min-[375px]:mb-4 shadow-xl border-4 border-white rounded-full">
                                        <span className="text-2xl min-[375px]:text-3xl sm:text-4xl">👋</span>
                                    </div>
                                    <h2 className="text-[#0066B2] text-lg min-[375px]:text-xl sm:text-2xl font-black mb-1">Welcome!</h2>
                                    <p className="text-slate-500 font-bold text-xs min-[375px]:text-sm sm:text-base">What should we call you?</p>
                                </div>

                                <form onSubmit={handleNameSubmit} className="space-y-3 min-[375px]:space-y-4">
                                    <div className="space-y-1 min-[375px]:space-y-1.5">
                                        <label className="block text-slate-700 text-[9px] min-[375px]:text-[10px] sm:text-xs font-black uppercase tracking-widest ml-1" htmlFor="userName">
                                            Your Name
                                        </label>
                                        <input
                                            id="userName"
                                            type="text"
                                            value={userName}
                                            onChange={(e) => {
                                                setUserName(e.target.value);
                                                setError('');
                                            }}
                                            placeholder="Full Name"
                                            className="w-full px-3 py-2.5 min-[375px]:px-4 min-[375px]:py-3 sm:py-4 border-4 border-slate-100 focus:border-[#0066B2] focus:outline-none focus:ring-4 focus:ring-[#0066B2]/10 text-slate-800 font-bold text-sm min-[375px]:text-base sm:text-lg transition-all rounded-lg"
                                            autoFocus
                                        />
                                        {error && (
                                            <p className="text-red-500 text-[9px] min-[375px]:text-[10px] font-black uppercase tracking-wider ml-1">{error}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="game-button-blue w-full py-2.5 min-[375px]:py-3 sm:py-4 rounded-xl font-game text-sm sm:text-lg tracking-widest"
                                    >
                                        Let's Go!
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
