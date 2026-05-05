import React from 'react';
import { Bot, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export const SignalAssistant: React.FC = () => {
    return (
        <motion.div
            className="bg-[#1c1c1e] p-8 rounded-3xl border border-white/5 space-y-6"
        >
            <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#74a2ff]/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#74a2ff]" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">시그널 어시스턴트</h3>
            </div>

            <div className="relative group">
                <input
                    type="text"
                    placeholder="시장 진입에 대해 물어보세요..."
                    className="w-full bg-[#2c2c2e] py-5 px-6 rounded-2xl text-white text-sm placeholder:text-white/20 outline-none border border-transparent focus:border-[#74a2ff]/20 transition-all"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#74a2ff]/10 hover:bg-[#74a2ff]/20 text-[#74a2ff] rounded-xl flex items-center justify-center transition-all">
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};
