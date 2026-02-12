
import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Phone, Calendar } from "lucide-react";
import ScoreShield from "./common/ScoreShield"; // Updated component
import BookingModal from "./BookingModal";
import Confetti from "./common/Confetti";

export default function ResultScreen({ score, onRestart, onThankYou, firstName }) {
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
        subtext = "You have learned important financial and insurance concepts.";
    } else if (finalScore === 5) {
        heading = "Excellent";
        subtext = "You have learned important financial and insurance concepts.";
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
        <div className="w-full h-full min-h-screen flex flex-col items-center p-6 text-center space-y-6 game-bg-gradient overflow-y-auto font-sans relative">
            <Confetti />

            {/* Header Section */}
            <div className="w-full pt-4 relative">
                {/* Top Share Button removed as per design focus on the main share button below score */}

                {/* Top Right Share Logo/Button */}
                <button
                    onClick={handleShare}
                    className="absolute right-0 top-0 p-2 text-white hover:text-orange-400 transition-colors z-20"
                    title="Share Score"
                >
                    <Share2 className="w-7 h-7" />
                </button>

                <div className="space-y-1 mt-6">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-extrabold text-white tracking-widest uppercase"
                    >
                        HI {name}!
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm font-semibold text-white/80 tracking-widest uppercase"
                    >
                        YOUR <span className="text-orange-500 font-extrabold text-lg mx-1">LIFE GOALS</span> SCORE IS
                    </motion.div>
                </div>
            </div>

            {/* Score Shield Section (Centered) */}
            <div className="w-full flex justify-center py-4">
                <ScoreShield score={finalScore} />
            </div>

            {/* Score Message */}
            <div className="space-y-2 max-w-md px-4">
                <h2 className="text-2xl font-bold text-white tracking-wide">
                    {heading}
                </h2>
                <p className="text-white/80 text-sm leading-relaxed">
                    {subtext}
                </p>
            </div>


            {/* Share Button (Square & Orange) */}
            <motion.button
                onClick={handleShare}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                // Square button: rounded-none. Orange background.
                className="flex items-center justify-center gap-3 bg-orange-500 text-white font-bold py-3 px-8 uppercase tracking-widest hover:bg-orange-600 transition-all w-full max-w-xs shadow-lg border border-white/10 rounded-none"
            >
                {/* Text First, Then Custom Forward Icon */}
                SHARE
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M14 5V2L22 9L14 16V13C7 13 4 15 2 20C4 12 7 8 14 8V5Z" />
                </svg>
            </motion.button>

            {/* Info Box (Square) - Existing structure below */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-xs bg-blue-900/40 border border-white/10 p-4 text-center shadow-lg"
            >
                <p className="text-white/90 text-sm font-medium leading-relaxed">
                    "You can improve your preparedness score further. Our Relationship Manager will reach out shortly."
                </p>
            </motion.div>

            {/* CTA Section - Existing structure below */}
            <div className="w-full max-w-xs space-y-4 pt-2 pb-8">
                {/* CALL NOW */}
                <button
                    onClick={() => window.location.href = "tel:18002099999"}
                    className="w-full py-4 bg-blue-600 text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors shadow-md uppercase tracking-wide border-2 border-transparent hover:border-white/20"
                >
                    <Phone className="w-6 h-6 fill-current" />
                    CALL NOW
                </button>

                {/* BOOK SLOT */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-4 bg-amber-500 text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-amber-600 transition-all shadow-md uppercase tracking-wide border-2 border-transparent hover:border-white/20"
                >
                    <Calendar className="w-6 h-6" />
                    BOOK A CONVENIENT SLOT
                </button>

            </div>

            {/* Booking Modal */}
            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={onThankYou}
                initialName={firstName}
            />
        </div>
    );
}
