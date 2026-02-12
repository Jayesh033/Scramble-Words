import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ArrowRight } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, onSubmit }) {
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Exact 10 digits validation
        if (!/^\d{10}$/.test(mobile)) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }

        // Success
        if (onSubmit) onSubmit({ mobile });
        onClose();
        setMobile('');
        setError('');
    };

    const handleInput = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
        setMobile(val);
        if (error) setError('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-sm bg-[#0f172a] border border-white/20 p-8 shadow-2xl z-10"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/50 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center space-y-4 mb-8">
                            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                                Book a Slot
                            </h2>
                            <p className="text-blue-200 text-sm">
                                Enter your mobile number to get a call back.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={handleInput}
                                    placeholder="Enter 10-digit number"
                                    className="w-full bg-white/5 border border-white/20 text-white pl-12 pr-4 py-4 focus:outline-none focus:border-amber-500 transition-colors placeholder:text-gray-500 text-lg tracking-wider font-mono rounded-none"
                                />
                            </div>

                            {error && (
                                <p className="text-red-400 text-xs font-semibold text-center">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-4 uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg rounded-none"
                            >
                                Submit <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
