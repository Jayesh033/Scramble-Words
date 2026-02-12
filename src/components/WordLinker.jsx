import { motion } from "framer-motion";

export default function WordLinker({ letters, usedIndices, onLetterSelect }) {
    return (
        <div className="relative w-full max-w-[320px] min-h-[120px] flex flex-wrap justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10 shadow-inner select-none">
            {letters.map((char, i) => {
                const isUsed = usedIndices.includes(i);

                return (
                    <div key={`bank-${i}`} className="relative w-11 h-11 sm:w-14 sm:h-14">
                        {!isUsed && (
                            <motion.div
                                layout
                                layoutId={`letter-${i}`}
                                drag
                                dragConstraints={{ top: -500, bottom: 100, left: -200, right: 200 }}
                                dragElastic={0.1}
                                dragMomentum={false}
                                dragSnapToOrigin
                                onDragEnd={(e, info) => {
                                    // Robust detection: get all elements at point and find the box
                                    const elements = document.elementsFromPoint(info.point.x, info.point.y);
                                    const boxElement = elements.find(el => el.hasAttribute("data-box-index"));
                                    const boxIndex = boxElement ? parseInt(boxElement.getAttribute("data-box-index")) : null;

                                    if (boxIndex !== null) {
                                        onLetterSelect(i, boxIndex);
                                    } else if (info.offset.y < -40) {
                                        // Fallback to next empty if dragged up but not on a specific box
                                        onLetterSelect(i);
                                    }
                                }}
                                onTap={() => onLetterSelect(i)}
                                whileHover={{ scale: 1.05, zIndex: 30 }}
                                whileTap={{ scale: 0.95, zIndex: 30 }}
                                whileDrag={{ scale: 1.1, zIndex: 50 }}
                                className="w-11 h-11 sm:w-14 sm:h-14 bg-white rounded-xl flex items-center justify-center font-game text-2xl sm:text-3xl text-blue-900 shadow-lg cursor-pointer z-20 transition-colors"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                            >
                                {char}
                            </motion.div>
                        )}
                        {/* Placeholder for the letter to keep layout stable */}
                        <div className="absolute inset-0 bg-black/20 rounded-xl border-2 border-dashed border-white/10 -z-10" />
                    </div>
                );
            })}
        </div>
    );
}
