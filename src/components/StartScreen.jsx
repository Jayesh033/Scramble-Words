import { motion } from "framer-motion";
import bgImg from "../assets/front-page/NewSartScreen.png";

export default function StartScreen({ onStart }) {
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
                {/* Start Button */}
                <div className="z-20 w-[45%] max-w-[170px] sm:w-[55%] sm:max-w-[220px] mb-1 sm:mb-3">
                    <motion.button
                        onClick={onStart}
                        className="game-button-blue w-full py-2 sm:py-3 rounded-[1.2rem] sm:rounded-[1.5rem] font-game text-sm sm:text-lg md:text-xl tracking-widest uppercase"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Start Quest
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
