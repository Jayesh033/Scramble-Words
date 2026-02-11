import { motion } from "framer-motion";
import { Award, Phone, Share2, Calendar, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function ResultScreen({ score, onRestart }) {

    useEffect(() => {
        const end = Date.now() + 1500;
        const colors = ['#f59e0b', '#ffffff', '#3b82f6'];

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }, []);

    const buttons = [
        {
            label: "Book a Free Session",
            icon: Calendar,
            primary: true,
            color: "from-amber-500 to-orange-600"
        },
        {
            label: "Call Relationship Manager",
            icon: Phone,
            primary: false,
            color: "bg-blue-600"
        },
        {
            label: "Share with Friends",
            icon: Share2,
            primary: false,
            color: "border-blue-400/50 hover:bg-blue-400/10"
        }
    ];

    return (
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8">

            {/* Trophy Section */}
            <div className="relative">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-40 h-40 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.5)] border-4 border-white/20"
                >
                    <Award className="w-20 h-20 text-white drop-shadow-md" />
                </motion.div>

                {/* Floating stars */}
                <motion.div
                    className="absolute -top-4 -right-4 text-4xl"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    ✨
                </motion.div>
            </div>

            {/* Score Text */}
            <div className="space-y-2">
                <motion.h2
                    className="text-3xl font-bold text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {score === 100 ? "Perfect Score!" : "Good Game!"}
                </motion.h2>
                <motion.div
                    className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 drop-shadow-sm"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                >
                    {score}/100
                </motion.div>
                <motion.p
                    className="text-blue-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    You're on your way to financial mastery!
                </motion.p>
            </div>

            {/* Buttons */}
            <div className="w-full max-w-sm space-y-4 pt-4">
                {buttons.map((btn, i) => (
                    <motion.button
                        key={i}
                        className={`
               w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all
               ${btn.primary
                                ? `bg-gradient-to-r ${btn.color} text-white shadow-lg shadow-amber-500/20`
                                : btn.label.includes('Share')
                                    ? `border-2 ${btn.color} text-blue-100`
                                    : `${btn.color} text-white shadow-lg`
                            }
            `}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 + (i * 0.1), type: "spring" }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={btn.label.includes('Share') ? onRestart : undefined}
                    >
                        <btn.icon className="w-5 h-5" />
                        {btn.label}
                    </motion.button>
                ))}
            </div>

            <motion.div
                className="text-xs text-blue-400/60 max-w-xs pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                Want to secure your future? Connect with our experts to learn more about these products.
            </motion.div>

        </div>
    );
}
