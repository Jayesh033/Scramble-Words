import { motion } from "framer-motion";
import { Play, PiggyBank } from "lucide-react";

export default function StartScreen({ onStart }) {
    return (
        <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">

            {/* Background Animated Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[100px]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-orange-500/10 blur-[100px]"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
            </div>

            {/* Main Content Container */}
            <div className="z-10 flex flex-col items-center max-w-md w-full text-center space-y-12">

                {/* Title Section */}
                <div className="space-y-2">
                    <motion.h1
                        className="text-5xl md:text-6xl font-black tracking-tight"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="text-white drop-shadow-lg">Financial</span>
                        <br />
                        <span className="text-gradient-gold drop-shadow-lg">Word Quest</span>
                    </motion.h1>

                    <motion.p
                        className="text-lg text-blue-100/80 font-medium"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    >
                        Unscramble. Learn. Prosper.
                    </motion.p>
                </div>

                {/* Hero Illustration */}
                <motion.div
                    className="relative"
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center justify-center border-4 border-white/10 glass-panel">
                        <PiggyBank className="w-24 h-24 md:w-32 md:h-32 text-indigo-50 drop-shadow-md" strokeWidth={1.5} />

                        {/* Floating Coins/Icons - purely decorative */}
                        <motion.div
                            className="absolute -top-4 -right-4 text-3xl"
                            animate={{ rotate: [0, 10, 0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            💰
                        </motion.div>
                        <motion.div
                            className="absolute -bottom-2 -left-2 text-3xl"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        >
                            💎
                        </motion.div>
                    </div>
                </motion.div>

                {/* Start Button */}
                <motion.button
                    onClick={onStart}
                    className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] active:scale-95"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                >
                    <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-3 text-2xl font-bold text-white tracking-wide">
                        START QUEST
                        <Play className="w-6 h-6 fill-white" />
                    </span>
                </motion.button>
            </div>

        </div>
    );
}
