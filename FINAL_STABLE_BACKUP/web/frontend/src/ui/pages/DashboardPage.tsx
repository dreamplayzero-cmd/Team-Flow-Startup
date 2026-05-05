import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { TopNavBar } from '../components/TopNavBar';
import { PersonaShowcase } from '../components/PersonaShowcase';
import { AIExpertReview } from '../components/AIExpertReview';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

interface DashboardPageProps {
    onStartProfiling?: () => void;
    onStartBusinessPlan?: () => void;
    onStartDistrictAnalysis?: () => void;
    onStartLeaderboard?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
    onStartProfiling,
    onStartBusinessPlan,
    onStartDistrictAnalysis
}) => {
    return (
        <div className="min-h-screen bg-stitch-background text-stitch-on-surface pb-32 overflow-hidden relative selection:bg-stitch-primary/10 font-body">
            {/* Ambient Background Effects & Argyle Pattern */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Base Argyle Pattern Layer */}
                <div 
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: `
                            repeating-linear-gradient(45deg, #1D2333 0px, #1D2333 1px, transparent 1px, transparent 100px),
                            repeating-linear-gradient(-45deg, #1D2333 0px, #1D2333 1px, transparent 1px, transparent 100px),
                            linear-gradient(45deg, rgba(74, 222, 128, 0.05) 25%, transparent 25%, transparent 75%, rgba(74, 222, 128, 0.05) 75%, rgba(74, 222, 128, 0.05)),
                            linear-gradient(-45deg, rgba(74, 222, 128, 0.05) 25%, transparent 25%, transparent 75%, rgba(74, 222, 128, 0.05) 75%, rgba(74, 222, 128, 0.05))
                        `,
                        backgroundSize: '100px 100px, 100px 100px, 200px 200px, 200px 200px',
                        backgroundPosition: '0 0, 0 0, 0 0, 100px 0'
                    }}
                ></div>

                {/* Subtle Moving Highlight */}
                <motion.div 
                    animate={{ 
                        opacity: [0.1, 0.2, 0.1],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-stitch-surface-container-high/30 blur-[120px] rounded-full"
                ></motion.div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-stitch-surface-container-highest/20 blur-[100px] rounded-full"></div>
            </div>

            {/* Top Navigation Bar */}
            <TopNavBar onLogoClick={() => { }} />

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-[1440px] mx-auto px-10 relative z-10 pt-24"
            >
                {/* Compact Hero Section */}
                <section className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-stitch-outline-variant/10 pb-10">
                    <div className="flex-1">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-stitch-primary font-st-headline font-black uppercase tracking-[0.3em] text-[10px] mb-4 block flex items-center gap-3"
                        >
                            <span className="w-2 h-2 rounded-full bg-stitch-secondary animate-pulse"></span>
                            Visual_DNA_인식_스트림
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-st-headline font-black text-stitch-primary leading-[1] tracking-tighter"
                        >
                            CORE <span className="text-stitch-primary/10">OPERATIONS</span>
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/60 backdrop-blur-xl px-6 py-4 rounded-3xl border border-stitch-outline-variant/10 shadow-lg shadow-stitch-primary/5 flex items-center gap-4 shrink-0"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-stitch-surface-container-low flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-stitch-primary text-2xl">hub</span>
                        </div>
                        <div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-stitch-on-surface-variant/40 mb-0.5">활성 상태</div>
                            <h3 className="font-st-headline font-black text-sm text-stitch-primary leading-tight">유스 스타트업 엔진 온라인</h3>
                        </div>
                    </motion.div>
                </section>

                {/* The Three Core Pillars - More compact */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {/* Persona Card */}
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="bg-white/50 backdrop-blur-3xl rounded-[2.5rem] p-10 flex flex-col relative overflow-hidden border border-white shadow-lg group transition-all duration-500"
                    >
                        <span className="bg-stitch-surface-container-high text-stitch-primary px-4 py-1 rounded-full text-[9px] font-black tracking-widest uppercase mb-8 self-start">모듈 01</span>
                        <h2 className="text-3xl font-st-headline font-black text-stitch-primary mb-2">개인 창업자 프로파일링</h2>
                        <p className="text-stitch-on-surface-variant/60 font-medium text-xs leading-relaxed mb-8">정신적 및 재무적 DNA 매핑</p>
                        <div className="mt-auto">
                            <button
                                onClick={onStartProfiling}
                                className="w-full py-4 rounded-xl bg-stitch-surface-container-low text-stitch-primary font-black text-xs uppercase tracking-[0.2em] hover:bg-stitch-primary hover:text-white transition-all transform active:scale-95"
                            >
                                프로파일링 시작
                            </button>
                        </div>
                    </motion.div>

                    {/* District Card (Priority) */}
                    <motion.div
                        whileHover={{ y: -12, scale: 1.01 }}
                        className="bg-gradient-to-br from-stitch-primary via-stitch-primary-container to-[#001641] text-white rounded-[2.5rem] p-10 flex flex-col relative overflow-hidden shadow-2xl shadow-stitch-primary/30 group transition-all duration-700"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                            <span className="material-symbols-outlined text-[100px]">explore</span>
                        </div>
                        <span className="bg-stitch-secondary text-stitch-primary px-4 py-1 rounded-full text-[9px] font-black tracking-widest uppercase mb-8 self-start animate-bounce">최우선 순위</span>
                        <h2 className="text-3xl font-st-headline font-black mb-2">상권 분석</h2>
                        <p className="text-white/40 font-medium text-xs leading-relaxed mb-8">지리 공간적 SNS 인텔리전스</p>
                        <div className="mt-auto">
                            <button
                                onClick={onStartDistrictAnalysis}
                                className="w-full py-4 rounded-xl bg-stitch-secondary text-stitch-primary font-black text-xs uppercase tracking-[0.2em] hover:brightness-110 shadow-lg shadow-stitch-secondary/20 transition-all transform active:scale-95"
                            >
                                분석 도구 실행
                            </button>
                        </div>
                    </motion.div>

                    {/* Success card */}
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="bg-white/50 backdrop-blur-3xl rounded-[2.5rem] p-10 flex flex-col relative overflow-hidden border border-white shadow-lg group transition-all duration-500"
                    >
                        <span className="bg-stitch-surface-container-high text-stitch-primary px-4 py-1 rounded-full text-[9px] font-black tracking-widest uppercase mb-8 self-start">모듈 02</span>
                        <h2 className="text-3xl font-st-headline font-black text-stitch-primary mb-2">창업 지수</h2>
                        <p className="text-stitch-on-surface-variant/60 font-medium text-xs leading-relaxed mb-8">예측 모델링 알고리즘 설계</p>
                        <div className="mt-auto">
                            <button
                                onClick={onStartBusinessPlan}
                                className="w-full py-4 rounded-xl bg-stitch-surface-container-low text-stitch-primary font-black text-xs uppercase tracking-[0.2em] hover:bg-stitch-primary hover:text-white transition-all transform active:scale-95"
                            >
                                청사진 설정
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* Organized Secondary Content */}
                <div className="border-t border-stitch-outline-variant/10 pt-20 space-y-24">


                    {/* Persona Showcase */}
                    <PersonaShowcase />

                    {/* AI Expert Review & Pricing */}
                    <AIExpertReview />
                </div>
            </motion.main>

            {/* Premium Footer */}
            <footer className="w-full py-16 px-10 mt-auto border-t border-stitch-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-stitch-on-surface-variant/30 max-w-[1440px] mx-auto">
                <div>© 2024 Youth Startup Flow. Startup Intelligence Suite.</div>
                <div className="flex gap-12">
                    <a className="hover:text-stitch-primary transition-all" href="#">데이터 방법론</a>
                    <a className="hover:text-stitch-primary transition-all" href="#">AI 윤리 강령</a>
                    <a className="hover:text-stitch-primary transition-all underline underline-offset-8" href="#">시스템 상태: 최적</a>
                </div>
            </footer>
        </div>
    );
};
