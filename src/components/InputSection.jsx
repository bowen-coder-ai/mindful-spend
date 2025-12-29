import React, { useState, useEffect } from 'react';
import { Mic, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InputSection({ onSubmit, isProcessing }) {
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const rec = new SpeechRecognition();
            rec.continuous = false;
            rec.interimResults = false;
            rec.lang = 'zh-CN'; // Default to Chinese as per prompt examples

            rec.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setText(transcript);
                setIsListening(false);
            };

            rec.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            rec.onend = () => {
                setIsListening(false);
            };

            setRecognition(rec);
        }
    }, []);

    const toggleListening = () => {
        if (!recognition) {
            alert("Speech recognition not supported in this browser.");
            return;
        }
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit(text);
        setText('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto"
        >
            <form onSubmit={handleSubmit} className="relative group">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or say: 'Lunch noodles 25 yuan'..."
                    className="w-full p-6 pr-24 text-2xl font-light bg-white rounded-3xl shadow-sm border border-transparent focus:border-morandi-1 focus:ring-0 focus:shadow-lg transition-all resize-none outline-none text-morandi-text placeholder-morandi-muted/50 h-32"
                    disabled={isProcessing}
                />

                <div className="absolute bottom-4 right-4 flex space-x-2">
                    <button
                        type="button"
                        onClick={toggleListening}
                        className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-400 text-white animate-pulse' : 'bg-morandi-bg text-morandi-text hover:bg-morandi-2/20'}`}
                        disabled={isProcessing}
                    >
                        <Mic size={20} />
                    </button>

                    <button
                        type="submit"
                        disabled={!text.trim() || isProcessing}
                        className="p-3 bg-morandi-text text-white rounded-full hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
