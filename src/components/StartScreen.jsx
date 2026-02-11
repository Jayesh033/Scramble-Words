import { motion } from "framer-motion";
import logoImg from "../assets/front-page/Text.png";
import instructionRow1Img from "../assets/front-page/instruction_row1.png";
import row2TilesImg from "../assets/front-page/row2_tiles.png";
import characterImg from "../assets/front-page/PetiImage.png";

/**
 * RESPONSIVE DIMENSIONS FOR CHROME DEVTOOLS:
 * 📱 iPhone SE: 375 x 667 (Very tight height)
 * 📱 iPhone 12/13/14: 390 x 844 (Standard mobile)
 * 📱 Pixel 7: 412 x 915 (Tall mobile)
 * 💻 iPad Air: 820 x 1180 (Tablet)
 * 🖥️ Desktop: 1440 x 900+
 */

export default function StartScreen({ onStart }) {
    return (
        <div className="relative w-full h-dvh flex flex-col items-center justify-between py-4 px-4 overflow-y-auto overflow-x-hidden game-bg-gradient">
            
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={`star-${i}`}
                        className="star"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            scale: Math.random() * 0.7 + 0.3
                        }}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
                    />
                ))}
            </div>

            {/* 1. Logo Section - Scaled for height safety */}
            <motion.div 
                className="z-10 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[450px] shrink-0 pt-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
            >
                <img 
                    src={logoImg} 
                    alt="Scrambled Word Financial Quest" 
                    className="w-full h-auto drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)]" 
                />
            </motion.div>

            {/* 2. Middle Content Group (Instructions + Tiles) */}
            <div className="z-10 flex flex-col items-center -space-y-4 md:-space-y-10 shrink-0">
                <motion.div 
                    className="w-[85%] max-w-[340px] md:max-w-[500px]"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <img 
                        src={instructionRow1Img} 
                        alt="Instructions and Row 1" 
                        className="w-full h-auto" 
                    />
                </motion.div>

                <motion.div 
                    className="w-[65%] max-w-[240px] md:max-w-[350px]"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <img 
                        src={row2TilesImg} 
                        alt="Row 2 Tiles" 
                        className="w-full h-auto" 
                    />
                </motion.div>
            </div>

            {/* 3. Character Section - Flex-1 with max height to prevent pushing button off */}
            <motion.div 
                className="z-10 w-full max-w-[350px] md:max-w-[550px] flex justify-center items-end"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
            >
                <img 
                    src={characterImg} 
                    alt="Character with treasure" 
                    className="w-full h-auto max-h-[35vh] md:max-h-none object-contain drop-shadow-2xl" 
                />
            </motion.div>

            {/* 4. Bottom Button - Always visible at bottom */}
            <div className="z-20 w-full max-w-[280px] sm:max-w-xs md:max-w-md pb-4 shrink-0">
                <motion.button
                    onClick={onStart}
                    className="game-button-blue w-full py-4 md:py-6 rounded-[2rem] md:rounded-[3rem] font-game text-xl sm:text-2xl md:text-4xl tracking-widest uppercase border-[4px] border-white shadow-[0_6px_0_#0056b3]"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Start Quest
                </motion.button>
            </div>
        </div>
    );
}





