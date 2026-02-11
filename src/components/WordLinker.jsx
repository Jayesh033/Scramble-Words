import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WordLinker({ letters, onWordFinalize }) {
    const [path, setPath] = useState([]);
    const [isConnecting, setIsConnecting] = useState(false);
    const [circleLetters, setCircleLetters] = useState([]);
    const containerRef = useRef(null);

    // Calculate positions for letters in a circle
    useEffect(() => {
        const radius = 100;
        const centerX = 150;
        const centerY = 150;
        const newCircleLetters = (letters || []).map((char, i) => {
            const angle = (i / letters.length) * 2 * Math.PI - Math.PI / 2;
            return {
                char,
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
                id: i
            };
        });
        setCircleLetters(newCircleLetters);
    }, [letters]);

    const handleStart = (idx) => {
        setIsConnecting(true);
        setPath([idx]);
    };

    const handleHover = (idx) => {
        if (isConnecting && !path.includes(idx)) {
            setPath(prev => [...prev, idx]);
        }
    };

    const handleEnd = () => {
        if (path.length > 1) {
            const word = path.map(idx => circleLetters[idx].char).join("");
            onWordFinalize(word);
        }
        setPath([]);
        setIsConnecting(false);
    };

    // Global listeners for mouse/touch up
    useEffect(() => {
        const onUp = () => handleEnd();
        window.addEventListener("mouseup", onUp);
        window.addEventListener("touchend", onUp);
        return () => {
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("touchend", onUp);
        };
    }, [path]);

    const handleTouchMove = (e) => {
        if (!isConnecting) return;
        const touch = e.touches[0];
        if (!touch) return;
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const letterId = element?.getAttribute("data-letter-id");
        if (letterId !== null && letterId !== undefined) {
            handleHover(parseInt(letterId));
        }
    };

    return (
        <div 
            ref={containerRef}
            className="relative w-[300px] h-[300px] select-none touch-none"
            onTouchMove={handleTouchMove}
        >
            {/* Background Disk */}
            <div className="absolute inset-4 bg-white/10 rounded-full backdrop-blur-sm border-2 border-white/5 shadow-inner" />

            {/* SVG Layer for Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                {path.length > 1 && path.map((point, i) => {
                    if (i === 0) return null;
                    const prev = circleLetters[path[i - 1]];
                    const curr = circleLetters[point];
                    if (!prev || !curr) return null;
                    return (
                        <motion.line
                            key={`line-${i}`}
                            x1={prev.x} y1={prev.y}
                            x2={curr.x} y2={curr.y}
                            stroke="#3b82f6"
                            strokeWidth="12"
                            strokeLinecap="round"
                            filter="url(#glow)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        />
                    );
                })}
            </svg>

            {/* Current Path Preview */}
            <AnimatePresence>
                {path.length > 0 && (
                    <motion.div
                        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-game text-xl shadow-2xl z-30 border-2 border-white/20"
                        initial={{ scale: 0, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: 10 }}
                    >
                        {path.map(idx => circleLetters[idx].char).join("")}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Letter Circles */}
            {circleLetters.map((l, i) => {
                const isActive = path.includes(i);
                return (
                    <div
                        key={i}
                        data-letter-id={i}
                        className={`absolute w-14 h-14 rounded-full flex items-center justify-center font-game text-3xl transition-all duration-200 cursor-pointer z-20
                            ${isActive 
                                ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,1)] scale-110' 
                                : 'bg-white text-blue-900 border-4 border-white shadow-lg hover:scale-105'}`}
                        style={{
                            left: l.x - 28,
                            top: l.y - 28,
                        }}
                        onMouseDown={() => handleStart(i)}
                        onMouseEnter={() => handleHover(i)}
                        onTouchStart={() => handleStart(i)}
                    >
                        {l.char}
                    </div>
                );
            })}
        </div>
    );
}
