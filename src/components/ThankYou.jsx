import { motion } from "framer-motion";

export default function ThankYou({ onHome, firstName }) {
    const name = firstName || "BAJAJ";

    return (
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-12 game-bg-gradient">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <h1 className="text-5xl font-extrabold text-white tracking-widest leading-tight">THANK<br/>YOU!</h1>
                <h2 className="text-3xl font-bold text-amber-500 uppercase tracking-wider">{name}</h2>
                <div className="h-px w-24 bg-white/30 mx-auto"></div>
                <p className="text-white/80 font-medium tracking-wide uppercase text-sm">
                    YOUR DETAILS HAVE BEEN RECORDED.
                </p>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 border border-white/10 p-8 w-full max-w-xs shadow-xl text-left space-y-3"
            >
                <h3 className="text-amber-400 font-bold text-xl uppercase tracking-widest border-l-4 border-amber-400 pl-4">EXPERT<br/>INCOMING</h3>
                <p className="text-blue-100 text-sm leading-relaxed pl-5 opacity-80">
                    Experts will reach out to you within 24 hours.
                </p>
            </motion.div>

            <motion.button
                onClick={onHome}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-xs py-5 bg-blue-600 border border-white/20 text-white font-bold text-xl uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg rounded-none"
            >
                START NEW QUEST
            </motion.button>
        </div>
    );
}
