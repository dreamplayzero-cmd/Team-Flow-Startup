import React from 'react';
import { motion } from 'framer-motion';

export const TrendArticle: React.FC = () => {
    return (
        <motion.div
            className="bg-[#1c1c1e] rounded-3xl overflow-hidden border border-white/5 flex flex-col md:flex-row"
        >
            <div className="w-full md:w-1/2 h-48 md:h-auto overflow-hidden">
                <img
                    src="/assets/images/trend_article.png"
                    alt="Trend"
                    className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                />
            </div>

            <div className="p-8 flex-1 space-y-6">
                <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-white/5 text-[#74a2ff] text-[10px] font-bold uppercase tracking-[0.2em] rounded-md">
                        새로운 트렌드
                    </span>
                    <span className="text-white/20 text-[10px] font-medium uppercase tracking-widest">
                        포스트 #429 • 2시간 전
                    </span>
                </div>

                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-white tracking-tight">상권 최근 트렌드 리포트</h2>
                    <p className="text-[13px] text-white/40 leading-relaxed font-medium">
                        최근 2030 세대의 소비 패턴 변화와 상권 내 유동 인구 분석을 통한 전략적 통찰력을 제공합니다...
                    </p>
                </div>

                <button className="bg-[#74a2ff] text-[#1c1c1e] px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#8ab1ff] shadow-lg shadow-blue-500/10 transition-all">
                    기사 읽기
                </button>
            </div>
        </motion.div>
    );
};
