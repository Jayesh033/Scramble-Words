import { motion } from "framer-motion";

export default function StartScreen({ onStart }) {
    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-between py-16 px-6 overflow-hidden game-bg-gradient">
            
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Stars */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={`star-${i}`}
                        className="star"
                        style={{
                            top: `${Math.random() * 70}%`,
                            left: `${Math.random() * 100}%`,
                            scale: Math.random() * 0.5 + 0.5
                        }}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
                    />
                ))}

                {/* Clouds */}
                <motion.div 
                    className="cloud w-64 h-32 -bottom-10 -left-10"
                    animate={{ x: [-20, 20, -20] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                    className="cloud w-80 h-40 bottom-10 -right-20"
                    animate={{ x: [20, -20, 20] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                    className="cloud w-96 h-48 -bottom-20 left-1/2 -translate-x-1/2"
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Title Section */}
            <div className="z-10 flex flex-col items-center text-center mt-12 px-4">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: [0, -10, 0], opacity: 1 }}
                    transition={{ 
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        opacity: { duration: 0.5 }
                    }}
                >
                    <h1 className="font-game text-5xl sm:text-7xl md:text-[10rem] flex flex-col items-center space-y-4 py-8 relative z-20">
                        <span className="text-stroke-game" data-text="Financial">Financial</span>
                        <span className="text-stroke-game pb-4" data-text="Word Quest">Word Quest</span>
                    </h1>
                </motion.div>

                <motion.p
                    className="font-game text-xl md:text-2xl text-white mt-8 tracking-widest text-stroke-small"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                >
                    Unscramble. Learn. Prosper.
                </motion.p>
            </div>

            {/* Bottom Section with Button */}
            <div className="z-10 w-full max-w-xs mb-12">
                <motion.button
                    onClick={onStart}
                    className="game-button-blue w-full py-6 rounded-3xl font-game text-3xl md:text-4xl tracking-widest uppercase"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Start Quest
                </motion.button>
            </div>

            {/* Extra cartoon clouds at the very bottom corners for effect */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
}

