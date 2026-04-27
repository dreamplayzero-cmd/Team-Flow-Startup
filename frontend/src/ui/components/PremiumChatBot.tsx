import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PremiumChatBot: React.FC = () => {
    const [isOpened, setIsOpened] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            content: "안녕하세요, 창업자의 주권을 지키는 Flow AI입니다. 모바일(9,900원)로 가볍게 보셨나요? 이곳 웹(29,000원)에서는 전문가의 깊이 있는 GIS 분석 리포트와 월 1회 1:1 컨설팅까지 밀착 케어해 드립니다. 무엇이든 물어보세요."
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });
            const data = await response.json();
            
            if (data.success) {
                setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: "죄송합니다. 요청을 처리하는 중 오류가 발생했습니다." }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', content: "서버와의 통신에 실패했습니다. 백엔드가 실행 중인지 확인해 주세요." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-10 right-10 z-[9999] font-body">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpened && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-20 right-0 w-[400px] h-[550px] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden bg-[#0F172A]/90 backdrop-blur-3xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                <span className="material-symbols-outlined text-white text-2xl">auto_awesome</span>
                            </div>
                            <div>
                                <h3 className="text-white font-st-headline font-black text-lg leading-tight">Flow AI Consultant</h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Senior Class Specialist</span>
                                </div>
                            </div>
                            <div className="ml-auto opacity-20 font-black text-[8px] uppercase tracking-[0.3em] text-white">The Sovereign</div>
                        </div>

                        {/* Chat Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`p-5 rounded-2xl text-sm leading-relaxed font-medium ${
                                        msg.role === 'ai' 
                                        ? 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none' 
                                        : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-tr-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                                        {msg.role === 'ai' ? 'Sovereign Engine' : 'Founder DNA'}
                                    </span>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-8 pt-0">
                            <div className="bg-black/20 border border-white/5 rounded-2xl p-2 flex items-center gap-2 focus-within:border-yellow-500/30 transition-all">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="궁금한 내용을 입력하세요..." 
                                    className="flex-1 bg-transparent border-none outline-none text-white px-4 py-2 text-sm placeholder:text-white/20"
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={isLoading}
                                    className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined">send</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Subtle Button */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpened(!isOpened)}
                className="relative cursor-pointer group opacity-40 hover:opacity-100 transition-opacity duration-500"
            >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${isOpened ? 'bg-white/10 rotate-90' : 'bg-[#1E293B] border border-white/10'}`}>
                    <span className={`material-symbols-outlined text-xl text-white/50 group-hover:text-yellow-500 transition-all duration-500 ${isOpened ? 'scale-75' : 'scale-100'}`}>
                        {isOpened ? 'close' : 'chat_bubble'}
                    </span>
                </div>
            </motion.div>
        </div>
    );
};
