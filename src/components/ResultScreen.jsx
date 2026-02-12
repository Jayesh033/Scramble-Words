import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Phone, Calendar } from "lucide-react";
import ScoreGauge from "./common/ScoreGauge";
import BookingModal from "./BookingModal";

export default function ResultScreen({ score, onRestart, onThankYou, firstName }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Normalize score 1-5
    // If score > 5, assume it's scaled e.g. 50, so divide by 10.
    const normalizedScore = score > 5 ? Math.ceil(score / 10) : (score === 0 ? 1 : score);
    const finalScore = Math.min(Math.max(normalizedScore, 1), 5);
    const name = firstName || "BAJAJ";

    const handleShare = async () => {
        const shareData = {
            title: 'My Financial Readiness Score',
            text: `I scored ${finalScore}/5 on my Financial Readiness Test!`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(shareData.text + " " + shareData.url);
            alert("Result copied to clipboard!");
        }
    };

    return (
        <div className="w-full h-full min-h-screen flex flex-col items-center p-6 text-center space-y-6 game-bg-gradient overflow-y-auto font-sans">

            {/* Header Section */}
            <div className="w-full pt-4 relative">
                <button
                    onClick={handleShare}
                    className="absolute right-0 top-0 p-2 text-white/80 hover:text-white transition-colors bg-white/10 rounded-lg backdrop-blur-sm"
                >
                    <Share2 className="w-6 h-6" />
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
                        YOUR <span className="text-amber-500 font-extrabold text-lg mx-1">LIFE GOALS</span> SCORE IS
                    </motion.div>
                </div>
            </div>

            {/* Score Gauge Section */}
            <div className="w-full flex justify-center py-2 h-40">
                <ScoreGauge score={finalScore} />
            </div>

            {/* Score Message */}
            <div className="space-y-4 max-w-sm">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide">
                        Financial Readiness Score
                    </h2>
                    <p className="text-blue-200 text-xs mt-2 leading-relaxed px-4">
                        To learn more about insurance and savings products, please connect with our Relationship Manager.
                    </p>
                </div>
            </div>

            {/* Share Button (Square & Orange) */}
            <motion.button
                onClick={handleShare}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 px-6 uppercase tracking-widest hover:brightness-110 transition-all w-48 shadow-lg border border-white/10"
            >
                <Share2 className="w-5 h-5" />
                SHARE
            </motion.button>

            {/* Info Box (Square) */}
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

            {/* CTA Section */}
            <div className="w-full max-w-xs space-y-4 pt-2 pb-8">
                {/* CALL NOW - Square Blue */}
                <button
                    onClick={() => window.location.href = "tel:18002099999"}
                    className="w-full py-4 bg-blue-600 text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors shadow-md uppercase tracking-wide border-2 border-transparent hover:border-white/20"
                >
                    <Phone className="w-6 h-6 fill-current" />
                    CALL NOW
                </button>

                {/* BOOK SLOT - Square Orange */}
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
            />
        </div>
    );
}
