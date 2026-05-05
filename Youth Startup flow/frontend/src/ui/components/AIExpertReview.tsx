import React from 'react';
import { motion } from 'framer-motion';

export const AIExpertReview: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full mt-20 mb-32"
        >
            <div className="bg-gradient-to-br from-[#0F172A]/80 to-[#1E293B]/80 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/10 shadow-2xl relative overflow-hidden group">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-yellow-500/10 transition-all duration-1000"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    {/* Left Icon Area */}
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl shadow-yellow-500/20 shrink-0">
                        <span className="material-symbols-outlined text-white text-5xl">psychology</span>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
                            <h2 className="text-4xl font-st-headline font-black text-white tracking-tight">AI 전문가 총평</h2>
                            <span className="text-yellow-500/60 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Sovereign Insight Engine v2.0</span>
                        </div>
                        
                        <p className="text-white/60 text-lg leading-relaxed font-medium mb-8 max-w-3xl">
                            저희는 페르소나를 분석해서 맞춤형 상권을 분석하고 권해드립니다. <br/><br/>
                            <span className="text-white font-bold">A.I 분석결과</span>, 이들은 공통적으로 <span className="text-white font-bold">'경험적 가치'</span>와 <span className="text-white font-bold">'공간적 심미성'</span>에 강력하게 반응하는 특성을 보입니다. 
                            지속 가능한 성장을 위해, 단순히 트렌드를 쫓는 것이 아닌 브랜드만의 독창적인 '주권(Sovereignty)'을 확보하는 전략이 필수적입니다.
                        </p>

                        {/* Pricing Badge */}
                        <div className="inline-flex flex-col md:flex-row items-center gap-6 bg-black/30 border border-white/5 p-6 rounded-2xl">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Premium Subscription</span>
                                <div className="text-2xl font-st-headline font-black text-white">
                                    월 29,000원 <span className="text-sm text-white/40 font-medium ml-2">/ VAT 별도</span>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-yellow-500 text-xl">verified_user</span>
                                </div>
                                <div className="text-left">
                                    <div className="text-white font-bold text-sm">전문가 1:1 컨설팅 (월 1회)</div>
                                    <div className="text-white/40 text-xs">심층 GIS 상권 리포트 및 브랜딩 전략 포함</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Action Area */}
                    <div className="shrink-0">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-black px-10 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-white/10 hover:bg-yellow-500 hover:text-black transition-all"
                        >
                            컨설팅 신청하기
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
