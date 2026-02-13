
import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Phone, Calendar } from "lucide-react";
import ScoreShield from "./common/ScoreShield"; // Updated component
import BookingModal from "./BookingModal";
import Confetti from "./common/Confetti";
import { useGameState } from "../hooks/useGameState"; // Import hook

export default function ResultScreen({ score, onRestart, onThankYou, firstName }) {
    const { lastSubmittedPhone } = useGameState(); // Get phone
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Normalize score 1-5
    // Game score comes in as 0, 10, 20, 30, 40, 50
    const normalizedScore = score > 5 ? Math.round(score / 10) : score;
    const finalScore = Math.min(Math.max(normalizedScore, 1), 5);
    const name = firstName || "BAJAJ";

    // Dynamic Heading & Subtext based on score
    let heading = "";
    let subtext = "";

    if (finalScore === 1 || finalScore === 2) {
        heading = "Not up the mark";
        subtext = "You can do it better.";
    } else if (finalScore === 3) {
        heading = "Good";
        subtext = "You can do better.";
    } else if (finalScore === 4) {
        heading = "Good Job";
        subtext = "You have learned important\nfinancial and insurance concepts.";
    } else if (finalScore === 5) {
        heading = "Excellent";
        subtext = "You have learned important\nfinancial and insurance concepts.";
    }

    const handleShare = async () => {
        const shareText = `Check your Life Goals readiness! Take the Bajaj Life Scrumbled Words and discover how prepared you are for your future.${window.location.href}`;
        const shareData = {
            title: 'My Financial Readiness Score',
            text: shareText,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(shareText);
            alert("Result copied to clipboard!");
        }
    };

    return (
        <div className="w-full h-full min-h-screen flex flex-col items-center px-4 py-2 text-center game-bg-gradient overflow-hidden font-sans relative">
            <Confetti />

            {/* Top Share Button */}
            <button
                onClick={handleShare}
                className="absolute right-2 top-2 p-2 text-white hover:text-orange-400 transition-colors z-20"
                title="Share Score"
            >
                <Share2 className="w-6 h-6" />
            </button>

            {/* Content Container - Flex Justified to fill space */}
            <div className="flex-1 flex flex-col items-center justify-between w-full max-w-sm h-full py-2">

                {/* 1. Header Section */}
                <div className="flex flex-col items-center gap-0 mt-2">
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl min-[375px]:text-3xl font-extrabold text-white tracking-widest uppercase leading-tight"
                    >
                        HI {name}!
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs min-[375px]:text-sm font-semibold text-white/80 tracking-widest uppercase mt-1"
                    >
                        YOUR <span className="text-orange-500 font-extrabold text-sm min-[375px]:text-base mx-1">SCORE</span> IS
                    </motion.div>
                </div>

                {/* 2. Score Shield Section - Scaled Down */}
                <div className="origin-center scale-75 min-[375px]:scale-90 -my-4">
                    <ScoreShield score={finalScore} />
                </div>

                {/* 3. Score Message */}
                <div className="space-y-1 px-2 -mt-2">
                    <h2 className="text-xl min-[375px]:text-2xl font-bold text-white tracking-wide leading-tight">
                        {heading}
                    </h2>
                    <p className="text-white/80 text-xs min-[375px]:text-sm leading-tight whitespace-pre-line">
                        {subtext}
                    </p>
                </div>


                {/* 4. Share Button (Square & Orange) */}
                <motion.button
                    onClick={handleShare}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-2 bg-orange-500 text-white font-bold py-2.5 px-6 uppercase tracking-widest hover:bg-orange-600 transition-all w-full max-w-[240px] shadow-md border border-white/10 rounded-none text-sm min-[375px]:text-base mt-2"
                >
                    SHARE
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 5V2L22 9L14 16V13C7 13 4 15 2 20C4 12 7 8 14 8V5Z" />
                    </svg>
                </motion.button>

                {/* 5. Info Box (Square) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full bg-blue-900/40 border border-white/10 p-2 min-[375px]:p-3 text-center shadow-sm mt-2 mb-1"
                >
                    <p className="text-white/90 text-[10px] min-[375px]:text-xs font-medium leading-tight">
                        "You can improve your preparedness score further. Our Relationship Manager will reach out shortly."
                    </p>
                </motion.div>

                {/* 6. CTA Section */}
                <div className="w-full space-y-2 mb-2">
                    {/* CALL NOW */}
                    <button
                        onClick={() => window.location.href = "tel:18002099999"}
                        className="w-full py-2.5 min-[375px]:py-3 bg-blue-600 text-white font-bold text-sm min-[375px]:text-base flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm uppercase tracking-wide border-2 border-transparent hover:border-white/20 rounded-md"
                    >
                        <Phone className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5 fill-current" />
                        CALL NOW
                    </button>

                    {/* BOOK SLOT */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-2.5 min-[375px]:py-3 bg-amber-500 text-white font-bold text-sm min-[375px]:text-base flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-sm uppercase tracking-wide border-2 border-transparent hover:border-white/20 rounded-md"
                    >
                        <Calendar className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" />
                        BOOK A CONVENIENT SLOT
                    </button>
                </div>
            </div>

            {/* Booking Modal */}
            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={onThankYou}
                initialName={firstName}
                initialMobile={lastSubmittedPhone}
            />
        </div>
    );
}

