import React from 'react';
import { motion } from 'framer-motion';
import { TopNavBar } from '../components/TopNavBar';
import { useAppDispatch, useAppSelector } from '../../store';
import { setView } from '../../store/slices/navigationSlice';

interface DistrictLeaderboardPageProps {
    onBack: () => void;
    onShowReport: () => void;
}

export const DistrictLeaderboardPage: React.FC<DistrictLeaderboardPageProps> = ({ onBack, onShowReport }) => {
    const dispatch = useAppDispatch();
    const { results, status } = useAppSelector(state => state.analysis);
    const sortedResults = (results || []).map((report: any) => ({
        name: report.area_name,
        score: parseFloat(report.final_score.toFixed(1)),
        prob: Math.round((report.success_prob !== undefined ? report.success_prob : report.probability || 0) * 100),
        id: report.area_name
    })).sort((a, b) => b.score - a.score);

    if (status === 'loading') {
        return (
            <div className="bg-stitch-background min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-stitch-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-stitch-primary font-black tracking-widest uppercase text-xs">AI 지역 대조 분석 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-stitch-background text-stitch-on-surface min-h-screen flex selection:bg-stitch-primary/10 font-body">
            {/* Sidebar Navigation */}
            <aside className="fixed top-0 left-0 h-full w-64 bg-stitch-surface border-r border-stitch-outline-variant/30 z-[60] hidden lg:flex flex-col">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-stitch-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-stitch-primary/20">
                        <span className="material-symbols-outlined text-2xl">insights</span>
                    </div>
                    <div>
                        <h2 className="font-st-headline font-extrabold text-stitch-primary text-sm leading-tight">Insight Engine</h2>
                        <p className="text-[10px] font-bold text-stitch-on-surface-variant/60 uppercase tracking-widest leading-none mt-1 font-black">Strategy Layer</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    <button
                        onClick={() => dispatch(setView('persona'))}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-stitch-on-surface-variant/60 hover:bg-white hover:text-stitch-primary transition-all group"
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">person_search</span>
                        <span className="text-[13px] font-bold">Founder Profiling</span>
                    </button>
                    <button
                        onClick={() => dispatch(setView('business_plan'))}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-stitch-on-surface-variant/60 hover:bg-white hover:text-stitch-primary transition-all group"
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">edit_document</span>
                        <span className="text-[13px] font-bold">Business Plan</span>
                    </button>
                    <button
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white shadow-sm border border-stitch-outline-variant/5 text-stitch-primary font-black"
                    >
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                        <span className="text-[13px]">District Leaderboard</span>
                    </button>
                    <button
                        onClick={() => dispatch(setView('district_report'))}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-stitch-on-surface-variant/60 hover:bg-white hover:text-stitch-primary transition-all group"
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">analytics</span>
                        <span className="text-[13px] font-bold">District Report</span>
                    </button>
                </nav>

                <div className="p-6 border-t border-stitch-outline-variant/20 space-y-2">
                    <button
                        onClick={onBack}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-stitch-on-surface-variant hover:text-stitch-primary transition-all font-bold text-xs uppercase tracking-widest"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Dashboard
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 transition-all w-full">
                <TopNavBar onLogoClick={onBack} offsetSidebar={true} />

                <main className="pt-28 pb-24 px-10 md:px-16 max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-20">
                        <div className="max-w-2xl">
                            <h1 className="text-6xl font-st-headline font-black text-stitch-primary tracking-tighter mb-6 leading-[1.1]">
                                상권 분석 리더보드
                            </h1>
                            <p className="text-stitch-on-surface-variant/60 font-medium text-lg leading-relaxed">
                                선택하신 후보 상권들에 대해 AI가 종합적인 입지 타당성을 평가한 실시간 순위입니다.
                            </p>
                        </div>
                        {sortedResults.length > 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-stitch-primary text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group flex items-center gap-8 w-full lg:w-auto"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                                    <span className="material-symbols-outlined text-[120px]">auto_awesome</span>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-stitch-secondary-fixed/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-stitch-secondary-fixed text-4xl">verified</span>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="font-st-headline font-extrabold text-xl mb-3 flex items-center gap-3">
                                        AI 분석 완료
                                        <span className="text-[10px] bg-stitch-secondary-fixed text-stitch-primary px-3 py-1 rounded-full font-black tracking-widest">PREMIUM INSIGHT</span>
                                    </h3>
                                    <p className="text-base text-white/70 leading-relaxed font-medium">
                                        현재 분석 데이터 기준 <strong className="text-stitch-secondary-fixed font-black">{sortedResults[0].name}</strong> 지역이 가장 높은 사업 타당성을 보이고 있습니다.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-stitch-on-surface-variant/40 font-bold italic">분석 결과가 없습니다.</div>
                        )}
                    </header>

                    {/* Rank Cards Section */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
                        {sortedResults.length > 0 && (
                            <motion.div
                                whileHover={{ y: -10, scale: 1.02 }}
                                onClick={onShowReport}
                                className="bg-gradient-to-br from-stitch-primary via-stitch-primary-container to-[#001641] text-white rounded-[2.5rem] p-12 flex flex-col relative overflow-hidden shadow-2xl shadow-stitch-primary/40 group transition-all duration-500 cursor-pointer"
                            >
                                <div className="absolute -top-16 -right-16 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                                    <span className="material-symbols-outlined text-[300px] font-black">looks_one</span>
                                </div>
                                <div className="flex justify-between items-start mb-16 z-10">
                                    <span className="bg-stitch-secondary text-stitch-primary px-6 py-2 rounded-full text-[12px] font-black tracking-[0.2em] uppercase shadow-lg shadow-stitch-secondary/10">BEST #1</span>
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center animate-bounce">
                                        <span className="material-symbols-outlined text-stitch-secondary font-black">trending_up</span>
                                    </div>
                                </div>
                                <h2 className="text-5xl font-st-headline font-black mb-2 z-10 tracking-tight">{sortedResults[0].name}</h2>
                                <p className="text-white/40 text-[10px] mb-12 z-10 font-black uppercase tracking-widest">실시간 분석 지수 1위</p>
                                <div className="mb-12 z-10">
                                    <div className="text-9xl font-st-headline font-black mb-2 tracking-tighter flex items-end gap-2 drop-shadow-[0_0_20px_rgba(78,222,163,0.3)]">
                                        {sortedResults[0].score}
                                    </div>
                                    <p className="text-stitch-secondary text-sm font-black flex items-center gap-3 uppercase tracking-widest">
                                        AI 종합 적합도 점수
                                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-stitch-secondary animate-pulse shadow-[0_0_10px_#4edea3]"></span>
                                    </p>
                                </div>
                                <div className="mt-auto flex justify-between items-end z-10">
                                    <div>
                                        <span className="text-[10px] text-white/30 block mb-2 font-black uppercase tracking-widest">성공 확률</span>
                                        <span className="text-5xl font-st-headline font-black text-stitch-secondary tracking-tighter">{sortedResults[0].prob}%</span>
                                    </div>
                                    <span className="material-symbols-outlined text-stitch-secondary/40 text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                                </div>
                            </motion.div>
                        )}

                        {sortedResults.slice(1, 3).map((item, idx) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ y: -10 }}
                                onClick={onShowReport}
                                className="bg-white/40 backdrop-blur-3xl rounded-[2.5rem] p-12 flex flex-col relative group transition-all duration-300 hover:bg-white border border-white shadow-xl cursor-pointer"
                            >
                                <div className="absolute -top-16 -right-16 opacity-5">
                                    <span className="material-symbols-outlined text-[300px] font-black text-stitch-primary">
                                        {idx === 0 ? 'looks_two' : 'looks_3'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start mb-16 z-10">
                                    <span className="bg-stitch-primary text-white px-6 py-2 rounded-full text-[12px] font-black tracking-[0.2em] uppercase">
                                        RANK #{idx + 2}
                                    </span>
                                </div>
                                <h2 className="text-5xl font-st-headline font-black text-stitch-primary mb-2 z-10 tracking-tight">{item.name}</h2>
                                <p className="text-stitch-on-surface-variant/40 text-[10px] mb-12 z-10 font-black uppercase tracking-widest">분석 점수 기반 순위</p>
                                <div className="mb-12 z-10">
                                    <div className="text-9xl font-st-headline font-black text-stitch-primary mb-2 tracking-tighter">{item.score}</div>
                                    <p className="text-stitch-on-surface-variant font-black text-sm uppercase tracking-widest">AI 적정성 점수</p>
                                </div>
                                <div className="mt-auto z-10">
                                    <span className="text-[10px] text-stitch-on-surface-variant/30 block mb-2 font-black uppercase tracking-widest">성공 확률</span>
                                    <span className="text-5xl font-st-headline font-black text-stitch-primary tracking-tighter">{item.prob}%</span>
                                </div>
                            </motion.div>
                        ))}
                    </section>

                    {/* Detailed Analysis Table */}
                    <section className="bg-white rounded-[3rem] border border-stitch-outline-variant/10 shadow-2xl p-12 overflow-hidden">
                        <div className="mb-12">
                            <h3 className="font-st-headline font-black text-3xl text-stitch-primary">상권별 상세 지표 비교</h3>
                            <p className="text-[10px] font-bold text-stitch-on-surface-variant/40 tracking-widest uppercase mt-2">Matrix Analysis</p>
                        </div>
                        
                        <div className="space-y-12">
                            {sortedResults.map((item, idx) => (
                                <div key={idx} className="group cursor-pointer" onClick={onShowReport}>
                                    <div className="flex justify-between items-end mb-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xl font-black text-stitch-primary font-st-headline">{item.name}</span>
                                            <span className={`material-symbols-outlined ${idx === 0 ? 'text-stitch-secondary' : 'text-stitch-outline-variant'} text-sm ${idx === 0 ? 'animate-bounce' : ''}`}>north</span>
                                        </div>
                                        <span className="text-3xl font-st-headline font-black text-stitch-primary tracking-tighter">{item.prob}% (성공 확률)</span>
                                    </div>
                                    <div className="h-6 bg-stitch-surface-container-high/40 rounded-full overflow-hidden flex p-1 border border-stitch-outline-variant/10 shadow-inner group-hover:scale-y-110 transition-transform origin-left duration-500">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.score}%` }}
                                            transition={{ duration: 1, delay: 0.5 + (idx * 0.2) }}
                                            className="h-full bg-stitch-primary rounded-full relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                                        </motion.div>
                                    </div>
                                </div>
                            ))}
                            {sortedResults.length === 0 && (
                                <div className="text-center py-20 bg-stitch-surface-container-low rounded-3xl border-2 border-dashed border-stitch-outline-variant/20 italic text-stitch-on-surface-variant/40">
                                    데이터 분석 전입니다. 대시보드에서 분석을 제안해 보세요.
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                <footer className="w-full py-10 px-10 mt-auto border-t border-stitch-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-stitch-on-surface-variant/30">
                    <div>© 2024 Team Flow. Strategy Layer v.2.0</div>
                    <div className="flex gap-12">
                        <a className="hover:text-stitch-primary transition-all" href="#">Support</a>
                        <a className="hover:text-stitch-primary transition-all" href="#">AI Model</a>
                        <a className="hover:text-stitch-primary transition-all" href="#">Terms</a>
                    </div>
                </footer>
            </div>
        </div>
    );
};
