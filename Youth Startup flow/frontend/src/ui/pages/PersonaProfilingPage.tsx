import React from 'react';
import { motion } from 'framer-motion';
import advisorImg from '../../assets/marcus_will.png';
import { TopNavBar } from '../components/TopNavBar';

import { useAppDispatch, useAppSelector } from '../../store';
import { setView } from '../../store/slices/navigationSlice';
import { updateFormData, analyzePersona } from '../../store/slices/analysisSlice';

interface PersonaProfilingPageProps {
    onBack: () => void;
    onNext: () => void;
}

export const PersonaProfilingPage: React.FC<PersonaProfilingPageProps> = ({ onBack, onNext }) => {
    const dispatch = useAppDispatch();
    const { age, gender, experience, capital, industry } = useAppSelector(state => state.analysis.formData);
    const selectedPersona = useAppSelector(state => state.analysis.selectedPersona);

    // Remove full-page loader that causes stuck screen if no persona is selected
    /* 
    if (currentView === 'persona' && !selectedPersona) {
        ...
    }
    */

    // Map gender/experience to labels used in UI if necessary, 
    // but better to keep them consistent.
    // UI gender: 'male', 'female'
    // Backend gender: '남성', '여성'

    const handleGenderChange = (val: '남성' | '여성') => {
        dispatch(updateFormData({ gender: val }));
    };

    const handleExperienceChange = (val: number) => {
        dispatch(updateFormData({ experience: val }));
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
    };

    return (
        <div className="bg-stitch-background text-stitch-on-surface min-h-screen flex selection:bg-stitch-primary/10 font-body relative overflow-hidden">
            {/* 3D Interactive Avatar Background - Temporarily disabled for debugging */}
            {/* <Background3DAvatar /> */}

            {/* Overlays to make text readable */}
            <div className="absolute inset-0 bg-white shadow-inner pointer-events-none z-[1]"></div>

            {/* Sidebar Navigation */}
            <aside className="fixed top-0 left-0 h-full w-64 bg-white/80 backdrop-blur-xl border-r border-stitch-outline-variant/30 z-[60] hidden lg:flex flex-col">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-stitch-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-stitch-primary/20">
                        <span className="material-symbols-outlined text-2xl">insights</span>
                    </div>
                    <div>
                        <h2 className="font-st-headline font-extrabold text-stitch-primary text-sm leading-tight">전략 스위트</h2>
                        <p className="text-[10px] font-bold text-stitch-on-surface-variant/60 uppercase tracking-widest leading-none mt-1">프리미엄 에디션</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    <button
                        onClick={() => dispatch(setView('persona'))}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-stitch-surface-container-lowest shadow-sm text-stitch-primary font-bold transition-all border border-stitch-outline-variant/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">edit_note</span>
                        <span className="text-[13px]">개인 창업자 프로파일링</span>
                    </button>
                    <button
                        onClick={() => dispatch(setView('business_plan'))}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-stitch-on-surface-variant hover:bg-stitch-surface-container-low hover:text-stitch-primary transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">query_stats</span>
                        <span className="text-[13px]">비즈니스 플랜 설정</span>
                    </button>
                    <button
                        onClick={() => dispatch(setView('district_leaderboard'))}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-stitch-on-surface-variant hover:bg-stitch-surface-container-low hover:text-stitch-primary transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">security</span>
                        <span className="text-[13px]">상권 분석 리더보드</span>
                    </button>
                    <button
                        onClick={() => dispatch(setView('district_report'))}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-stitch-on-surface-variant hover:bg-stitch-surface-container-low hover:text-stitch-primary transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">trending_up</span>
                        <span className="text-[13px]">상권 정밀 분석 리포트</span>
                    </button>
                </nav>

                <div className="p-6 border-t border-stitch-outline-variant/20 space-y-2">
                    <button
                        onClick={onBack}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-stitch-on-surface-variant hover:text-stitch-primary transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        <span className="text-[12px] font-medium">대시보드로 돌아가기</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-stitch-on-surface-variant hover:text-stitch-primary transition-all">
                        <span className="material-symbols-outlined text-[20px]">description</span>
                        <span className="text-[12px] font-medium">사용 가이드</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 transition-all w-full relative z-10">
                {/* TopNavBar */}
                <TopNavBar onLogoClick={onBack} offsetSidebar={true} />

                <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
                    {/* Editorial Header */}
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 text-center"
                    >
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-stitch-primary/60 mb-2 block">전략적 기반</span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-stitch-primary tracking-tight mb-4 font-st-headline">창업자 프로파일링</h1>
                        <p className="text-sm md:text-base text-stitch-on-surface-variant max-w-xl mx-auto font-body leading-relaxed opacity-80">
                            성공적인 사업 전략 수립을 위해 창업자의 고유한 배경과 자본 환경을 분석합니다.
                        </p>
                    </motion.header>

                    <section className="space-y-6">
                        {/* Age Module */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-stitch-surface-container-lowest p-8 rounded-2xl border border-stitch-outline-variant/30 shadow-sm"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold font-st-headline text-stitch-primary">당신의 연령대</h2>
                                <span className="text-3xl font-black text-stitch-primary/30 font-st-headline">{selectedPersona?.name || '맞춤형'} {age}</span>
                            </div>
                            <div className="relative py-4">
                                <input
                                    className="w-full h-1.5 bg-stitch-surface-container-highest rounded-full appearance-none cursor-pointer accent-stitch-primary"
                                    max="70"
                                    min="20"
                                    type="range"
                                    value={age}
                                    onChange={(e) => dispatch(updateFormData({ age: parseInt(e.target.value) }))}
                                />
                                <div className="flex justify-between mt-4 text-[10px] font-bold text-stitch-on-surface-variant/60 uppercase tracking-widest">
                                    <span>20대</span>
                                    <span>30대</span>
                                    <span>40대</span>
                                    <span>50대</span>
                                    <span>60대 이상</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Gender & Experience Cluster */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-stitch-surface-container-low p-8 rounded-2xl border border-stitch-outline-variant/10"
                            >
                                <h2 className="text-sm font-bold font-st-headline text-stitch-primary mb-6">성별</h2>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleGenderChange('남성')}
                                        className={`flex-1 py-4 px-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${gender === '남성' ? 'bg-stitch-primary text-white border-stitch-primary shadow-lg' : 'bg-stitch-surface-container-lowest border-stitch-outline-variant/20 hover:border-stitch-primary/20'}`}
                                    >
                                        <span className={`material-symbols-outlined text-2xl ${gender === '남성' ? 'text-white' : 'text-stitch-primary'}`}>male</span>
                                        <span className="font-bold text-xs">남성</span>
                                    </button>
                                    <button
                                        onClick={() => handleGenderChange('여성')}
                                        className={`flex-1 py-4 px-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${gender === '여성' ? 'bg-stitch-primary text-white border-stitch-primary shadow-lg' : 'bg-stitch-surface-container-lowest border-stitch-outline-variant/20 hover:border-stitch-primary/20'}`}
                                    >
                                        <span className={`material-symbols-outlined text-2xl ${gender === '여성' ? 'text-white' : 'text-stitch-primary'}`}>female</span>
                                        <span className="font-bold text-xs">여성</span>
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-stitch-surface-container-low p-8 rounded-2xl border border-stitch-outline-variant/10"
                            >
                                <h2 className="text-sm font-bold font-st-headline text-stitch-primary mb-6">직무 및 비즈니스 경력</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 0, label: '신입 / 무경험', icon: 'school' },
                                        { id: 5, label: '실무 전문가 (5년+)', icon: 'work' },
                                        { id: 10, label: '시니어 리더 (10년+)', icon: 'leaderboard' },
                                        { id: 15, label: '마스터 (15년+)', icon: 'military_tech' }
                                    ].map((exp) => (
                                        <button
                                            key={exp.id}
                                            onClick={() => handleExperienceChange(exp.id)}
                                            className={`py-3 px-2 rounded-xl border transition-all flex flex-col items-center gap-1.5 ${experience === exp.id ? 'bg-stitch-primary text-white border-stitch-primary shadow-md' : 'bg-stitch-surface-container-lowest border-stitch-outline-variant/20 hover:border-stitch-primary/20'}`}
                                        >
                                            <span className={`material-symbols-outlined text-lg ${experience === exp.id ? 'text-white' : 'text-stitch-primary'}`}>{exp.icon}</span>
                                            <span className="font-bold text-[10px] whitespace-nowrap">{exp.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Capital Analysis with Industry Benchmarks */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white p-10 rounded-[2.5rem] text-stitch-primary relative overflow-hidden shadow-2xl border-2 border-slate-50"
                        >
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-stitch-secondary">account_balance_wallet</span>
                                            <h2 className="text-xl font-extrabold font-st-headline text-stitch-primary">초기 창업 자본 설정</h2>
                                        </div>
                                        <p className="text-stitch-on-surface-variant text-xs max-w-xs font-bold opacity-60">업종별 평균 창업 비용을 기준으로 예산을 설정하세요.</p>
                                    </div>
                                    <div className="flex items-baseline gap-2 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                                        <span className="text-3xl font-black tracking-tight font-st-headline text-stitch-primary">{formatCurrency(capital)}</span>
                                        <span className="text-[11px] font-bold opacity-40 uppercase tracking-widest">KRW</span>
                                    </div>
                                </div>

                                {/* Industry Quick Selector for Benchmarks */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                                    {[
                                        { id: 'F&B', label: 'F&B (식음료)', benchmark: 120000000, icon: 'restaurant' },
                                        { id: 'Retail', label: '패션/리테일', benchmark: 80000000, icon: 'shopping_bag' },
                                        { id: 'Culture', label: '문화/예술', benchmark: 60000000, icon: 'palette' },
                                        { id: 'Tech', label: '서비스/테크', benchmark: 50000000, icon: 'devices' }
                                    ].map(ind => (
                                        <button 
                                            key={ind.id}
                                            onClick={() => dispatch(updateFormData({ industry: ind.label, capital: ind.benchmark }))}
                                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${industry === ind.label ? 'border-stitch-secondary bg-stitch-secondary/5 shadow-inner' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                                        >
                                            <span className="material-symbols-outlined text-xl opacity-60">{ind.icon}</span>
                                            <span className="text-[10px] font-black">{ind.label}</span>
                                            <span className="text-[9px] font-bold text-stitch-secondary">약 {(ind.benchmark/100000000).toFixed(1)}억</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="relative py-8">
                                    {/* Benchmark Indicator */}
                                    <div className="absolute top-0 left-0 w-full flex justify-between px-2 mb-2">
                                        <span className="text-[9px] font-black text-slate-300 uppercase">Seed</span>
                                        <span className="text-[9px] font-black text-stitch-secondary uppercase">Industry Avg</span>
                                        <span className="text-[9px] font-black text-slate-300 uppercase">Growth</span>
                                    </div>
                                    
                                    <input
                                        className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-stitch-secondary"
                                        max={1000000000}
                                        min={10000000}
                                        step={5000000}
                                        type="range"
                                        value={capital}
                                        onChange={(e) => dispatch(updateFormData({ capital: parseInt(e.target.value) }))}
                                    />
                                    
                                    <div className="flex justify-between mt-4">
                                        <div className="text-center">
                                            <div className="text-[10px] font-black text-slate-400">1,000만</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-[10px] font-black text-slate-400">5억</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-[10px] font-black text-slate-400">10억</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-stitch-secondary/5 rounded-2xl border border-stitch-secondary/10 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-stitch-secondary rounded-full flex items-center justify-center text-stitch-primary shadow-sm">
                                        <span className="material-symbols-outlined text-lg">lightbulb</span>
                                    </div>
                                    <p className="text-xs font-bold text-stitch-primary/80 leading-relaxed">
                                        {capital < 80000000 
                                            ? "소자본 특화 전략: 임대료가 저렴한 골목 상권 내 '목적형 매장' 구성을 추천합니다."
                                            : "스케일업 전략: 유동인구가 검증된 메인 스트리트 내 '플래그십 스토어' 분석을 활성화합니다."}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Button - Re-run AI Analysis */}
                        <div className="flex justify-center py-4">
                            <button 
                                onClick={() => dispatch(analyzePersona({ 
                                    name: selectedPersona?.name || '사용자 정의', 
                                    description: selectedPersona?.description || `${industry} 창업을 준비하는 예비 창업자` 
                                }))}
                                disabled={selectedPersona?.isLoading}
                                className="w-full md:w-auto min-w-[320px] py-4 px-10 bg-stitch-surface-container-high hover:bg-stitch-surface-container-highest text-stitch-primary border border-stitch-primary/10 rounded-2xl font-bold text-base tracking-tight transition-all flex items-center justify-center gap-3 group shadow-sm active:scale-95 disabled:opacity-50"
                            >
                                <span className={`material-symbols-outlined text-xl ${selectedPersona?.isLoading ? 'animate-spin' : ''}`}>
                                    {selectedPersona?.isLoading ? 'sync' : 'person_search'}
                                </span>
                                {selectedPersona?.isLoading ? 'AI가 페르소나 분석 중...' : '개인 창업자 AI 프로파일링 분석'}
                            </button>
                        </div>

                        {/* Insight AI Analysis Results */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-stitch-surface-container p-8 rounded-3xl border border-stitch-primary/5"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-stitch-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                <h2 className="text-xl font-extrabold font-st-headline text-stitch-primary uppercase tracking-tight">Insight AI 분석 결과</h2>
                            </div>

                            <div className="bg-stitch-surface-container-lowest p-6 rounded-2xl border border-stitch-outline-variant/20 mb-8 shadow-sm min-h-[120px] flex items-center">
                                {selectedPersona?.insight ? (
                                    <p className="text-base font-medium text-stitch-primary leading-relaxed whitespace-pre-wrap italic">
                                        "{selectedPersona.insight}"
                                    </p>
                                ) : selectedPersona?.isLoading ? (
                                    <div className="w-full flex flex-col items-center gap-2 py-4">
                                        <div className="w-6 h-6 border-2 border-stitch-primary/20 border-t-stitch-primary rounded-full animate-spin"></div>
                                        <p className="text-xs font-bold text-stitch-primary/40 uppercase tracking-widest">AI 심층 분석 생성 중...</p>
                                    </div>
                                ) : (
                                    <p className="text-base font-medium text-stitch-on-surface-variant/40 leading-relaxed italic">
                                        메인 화면에서 페르소나를 선택하거나 분석 버튼을 눌러 AI 맞춤형 창업 리포트를 확인하세요.
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-stitch-on-surface/5">
                                <div className="flex items-center gap-4">
                                    <img
                                        alt="Advisor"
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                        src={advisorImg}
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-stitch-primary leading-none mb-1">마커스 윌</p>
                                        <p className="text-[10px] text-stitch-on-surface-variant font-medium uppercase tracking-widest opacity-60">수석 전략 리드</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onNext}
                                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-stitch-primary to-stitch-primary-container text-white text-sm font-bold rounded-xl shadow-xl shadow-stitch-primary/20 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                                >
                                    <span>다음 단계: 비즈니스 플랜 설정</span>
                                    <span className="material-symbols-outlined text-lg group-hover:translate-x-2 transition-transform">arrow_forward</span>
                                </button>
                            </div>
                        </motion.div>
                    </section>
                </main>

                {/* Footer Decoration */}
                <footer className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6 text-stitch-on-surface-variant/40 text-[10px] font-bold uppercase tracking-[0.2em] border-t border-stitch-outline-variant/10">
                    <span>The Sovereign Insight © 2024</span>
                    <div className="flex gap-10">
                        <a className="hover:text-stitch-primary transition-colors text-stitch-on-surface-variant/40" href="#">개인정보 처리방침</a>
                        <a className="hover:text-stitch-primary transition-colors text-stitch-on-surface-variant/40" href="#">이용약관</a>
                        <a className="hover:text-stitch-primary transition-colors text-stitch-on-surface-variant/40" href="#">보안 정책</a>
                    </div>
                </footer>
            </div>
        </div>
    );
};
