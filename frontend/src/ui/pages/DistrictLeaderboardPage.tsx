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
    const results = useAppSelector(state => state.analysis.results);

    const sortedResults = Object.entries(results ?? {})
        .map(([name, score]) => ({
            name,
            score: parseFloat(score.toFixed(1)),
            prob: Math.round(score + 5),
            id: name
        }))
        .sort((a, b) => b.score - a.score);

    const rank1 = sortedResults[0] || { name: '샤로수길', score: 85.9, prob: 92, id: 'sharo' };
    const rank2 = sortedResults[1] || { name: '성수동', score: 78.4, prob: 76, id: 'seongsu' };
    const rank3 = sortedResults[2] || { name: '망원동', score: 72.1, prob: 64, id: 'mangwon' };

    const displayResults = sortedResults.length > 0 ? sortedResults : [rank1, rank2, rank3];

    return (
        <div className="bg-stitch-background text-stitch-on-surface min-h-screen flex selection:bg-stitch-primary/10 font-body">
            {/* Sidebar Navigation */}
            <aside className="fixed top-0 left-0 h-full w-64 bg-stitch-surface border-r border-stitch-outline-variant/30 z-[60] hidden lg:flex flex-col">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-stitch-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-stitch-primary/20">
                        <span className="material-symbols-outlined text-2xl">insights</span>
                    </div>
                    <div>
                        <h2 className="font-st-headline font-extrabold text-stitch-primary text-sm leading-tight">인사이트 엔진</h2>
                        <p className="text-[10px] font-bold text-stitch-on-surface-variant/60 uppercase tracking-widest leading-none mt-1">전략 레이어</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    <button
                        onClick={() => dispatch(setView('persona'))}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-stitch-on-surface-variant/60 hover:bg-white hover:text-stitch-primary transition-all group"
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">person_search</span>
                        <span className="text-[13px] font-bold">개인 창업자 프로파일링</span>
                    </button>
                    <button
                        onClick={() => dispatch(setView('business_plan'))}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-stitch-on-surface-variant/60 hover:bg-white hover:text-stitch-primary transition-all group"
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">edit_document</span>
                        <span className="text-[13px] font-bold">비즈니스 플랜 설정</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white shadow-sm border border-stitch-outline-variant/5 text-stitch-primary font-black">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                        <span className="text-[13px]">상권 분석 리더보드</span>
                    </button>
                    <button
                        onClick={() => dispatch(setView('district_report'))}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-stitch-on-surface-variant/60 hover:bg-white hover:text-stitch-primary transition-all group"
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">analytics</span>
                        <span className="text-[13px] font-bold">상권 정밀 분석 리포트</span>
                    </button>
                </nav>

                <div className="p-6 border-t border-stitch-outline-variant/20 space-y-2">
                    <button
                        onClick={onBack}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-stitch-on-surface-variant hover:text-stitch-primary transition-all font-bold text-xs uppercase tracking-widest"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        대시보드
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 transition-all w-full flex flex-col">
                <TopNavBar onLogoClick={onBack} offsetSidebar={true} />

                <main className="flex-1 pt-28 pb-20 px-10 max-w-[1440px] mx-auto w-full">
                    {/* Header */}
                    <header className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                        <div className="max-w-2xl">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-stitch-primary font-st-headline font-extrabold uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center gap-2"
                            >
                                <span className="w-2 h-2 rounded-full bg-stitch-primary animate-pulse"></span>
                                District_Analysis_Leaderboard
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl font-st-headline font-black text-stitch-primary tracking-tight leading-[1.1]"
                            >
                                상권별 성적표<br />
                                <span className="text-stitch-primary/40">Entrepreneurship Index</span>
                            </motion.h1>
                        </div>

                        {/* Conclusion Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-stitch-primary text-white p-10 rounded-[2.5rem] border-l-[12px] border-stitch-secondary flex items-start gap-8 shadow-2xl max-w-xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                                <span className="material-symbols-outlined text-[120px]">auto_awesome</span>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-stitch-secondary-fixed/20 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-stitch-secondary-fixed text-4xl">verified</span>
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-st-headline font-extrabold text-xl mb-3 flex items-center gap-3">
                                    최종 분석 결론
                                    <span className="text-[10px] bg-stitch-secondary-fixed text-stitch-primary px-3 py-1 rounded-full font-black tracking-widest">PREMIUM INSIGHT</span>
                                </h3>
                                <p className="text-base text-white/70 leading-relaxed font-medium">
                                    현재 데이터 기준, <strong className="text-stitch-secondary-fixed font-black">샤로수길</strong>이 투자 대비 효용 가치와 유동 인구 증가세에서 압도적인 수치를 기록하며 가장 유망한 상권으로 도출되었습니다.
                                </p>
                            </div>
                        </motion.div>
                    </header>

                    {/* Rank Cards Section */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
                        {/* Rank #1 */}
                        <motion.div
                            whileHover={{ y: -10, scale: 1.02 }}
                            onClick={onShowReport}
                            className="bg-gradient-to-br from-stitch-primary via-stitch-primary-container to-[#001641] text-white rounded-[2.5rem] p-12 flex flex-col relative overflow-hidden shadow-2xl shadow-stitch-primary/40 group transition-all duration-500 cursor-pointer"
                        >
                            <div className="absolute -top-16 -right-16 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                                <span className="material-symbols-outlined text-[300px] font-black">looks_one</span>
                            </div>
                            <div className="flex justify-between items-start mb-16 z-10">
                                <span className="bg-stitch-secondary text-stitch-primary px-6 py-2 rounded-full text-[12px] font-black tracking-[0.2em] uppercase shadow-lg">순위 #1</span>
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center animate-bounce">
                                    <span className="material-symbols-outlined text-stitch-secondary font-black">trending_up</span>
                                </div>
                            </div>
                            <h2 className="text-5xl font-st-headline font-black mb-2 z-10 tracking-tight">{rank1.name}</h2>
                            <p className="text-white/40 text-[10px] mb-12 z-10 font-black uppercase tracking-widest">관악구 관악로 14길</p>
                            <div className="mb-12 z-10">
                                <div className="text-9xl font-st-headline font-black mb-2 tracking-tighter drop-shadow-[0_0_20px_rgba(78,222,163,0.3)]">
                                    {rank1.score}
                                </div>
                                <p className="text-stitch-secondary text-sm font-black flex items-center gap-3 uppercase tracking-widest">
                                    AI 성공 가능성 지수
                                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-stitch-secondary animate-pulse shadow-[0_0_10px_#4edea3]"></span>
                                </p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-6 rounded-2xl mb-10 z-10">
                                <p className="text-sm italic leading-relaxed text-white/70 font-medium">"인터넷 화제성 폭발! 2030 유동 인구 밀집도가 전월 대비 18% 증가하며 가장 강력한 상승세를 보입니다."</p>
                            </div>
                            <div className="mt-auto flex justify-between items-end z-10">
                                <div>
                                    <span className="text-[10px] text-white/30 block mb-2 font-black uppercase tracking-widest">성공 확률</span>
                                    <span className="text-5xl font-st-headline font-black text-stitch-secondary tracking-tighter">{rank1.prob}%</span>
                                </div>
                                <span className="material-symbols-outlined text-stitch-secondary/40 text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                            </div>
                        </motion.div>

                        {/* Rank #2 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            onClick={onShowReport}
                            className="bg-white/40 backdrop-blur-3xl rounded-[2.5rem] p-12 flex flex-col relative group transition-all duration-300 hover:bg-white border border-white shadow-xl cursor-pointer"
                        >
                            <div className="absolute -top-16 -right-16 opacity-5">
                                <span className="material-symbols-outlined text-[300px] font-black text-stitch-primary">looks_two</span>
                            </div>
                            <div className="flex justify-between items-start mb-4 z-10">
                                <span className="bg-stitch-surface-container-low text-stitch-primary px-6 py-2 rounded-full text-[12px] font-black tracking-[0.2em] uppercase">순위 #2</span>
                            </div>
                            <h2 className="text-5xl font-st-headline font-black text-stitch-primary mb-2 z-10 tracking-tight">{rank2.name}</h2>
                            <p className="text-stitch-on-surface-variant/40 text-[10px] mb-12 z-10 font-black uppercase tracking-widest">분석 대상 지역 #2</p>
                            <div className="mb-12 z-10">
                                <div className="text-9xl font-st-headline font-black text-stitch-primary mb-2 tracking-tighter">{rank2.score}</div>
                                <p className="text-stitch-on-surface-variant font-black text-sm uppercase tracking-widest">AI Feasibility Score</p>
                            </div>
                            <div className="bg-stitch-surface-container-low/60 p-6 rounded-2xl mb-10 z-10 border border-stitch-outline-variant/10">
                                <p className="text-sm italic leading-relaxed text-stitch-on-surface-variant font-medium">"고가 소비층의 유입이 지속적으로 유지되는 중입니다."</p>
                            </div>
                            <div className="mt-auto z-10">
                                <span className="text-[10px] text-stitch-on-surface-variant/30 block mb-2 font-black uppercase tracking-widest">성공 확률</span>
                                <span className="text-5xl font-st-headline font-black text-stitch-primary tracking-tighter">{rank2.prob}%</span>
                            </div>
                        </motion.div>

                        {/* Rank #3 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            onClick={onShowReport}
                            className="bg-white/40 backdrop-blur-3xl rounded-[2.5rem] p-12 flex flex-col relative group transition-all duration-300 hover:bg-white border border-white shadow-xl cursor-pointer"
                        >
                            <div className="absolute -top-16 -right-16 opacity-5">
                                <span className="material-symbols-outlined text-[300px] font-black text-stitch-primary">looks_3</span>
                            </div>
                            <div className="flex justify-between items-start mb-4 z-10">
                                <span className="bg-stitch-surface-container-low text-stitch-primary px-6 py-2 rounded-full text-[12px] font-black tracking-[0.2em] uppercase">순위 #3</span>
                            </div>
                            <h2 className="text-5xl font-st-headline font-black text-stitch-primary mb-2 z-10 tracking-tight">{rank3.name}</h2>
                            <p className="text-stitch-on-surface-variant/40 text-[10px] mb-12 z-10 font-black uppercase tracking-widest">분석 대상 지역 #3</p>
                            <div className="mb-12 z-10">
                                <div className="text-9xl font-st-headline font-black text-stitch-primary mb-2 tracking-tighter">{rank3.score}</div>
                                <p className="text-stitch-on-surface-variant font-black text-sm uppercase tracking-widest">AI Feasibility Score</p>
                            </div>
                            <div className="bg-stitch-surface-container-low/60 p-6 rounded-2xl mb-10 z-10 border border-stitch-outline-variant/10">
                                <p className="text-sm italic leading-relaxed text-stitch-on-surface-variant font-medium">"로컬 커뮤니티 기반의 안정적 수요. 경쟁 강도가 높아지고 있으나 독창적인 컨셉의 매장은 여전히 강세."</p>
                            </div>
                            <div className="mt-auto z-10">
                                <span className="text-[10px] text-stitch-on-surface-variant/30 block mb-2 font-black uppercase tracking-widest">성공 확률</span>
                                <span className="text-5xl font-st-headline font-black text-stitch-primary tracking-tighter">{rank3.prob}%</span>
                            </div>
                        </motion.div>
                    </section>

                    {/* Analytics Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        {/* Probability Bar Chart */}
                        <div className="lg:col-span-3 bg-stitch-surface-container-low/40 backdrop-blur-3xl rounded-[3rem] p-12 border border-white shadow-xl">
                            <div className="mb-12">
                                <h3 className="font-st-headline font-black text-3xl text-stitch-primary flex items-center gap-4">
                                    전 지역 성공 확률 비교 분석
                                    <span className="material-symbols-outlined text-stitch-primary text-2xl animate-pulse">equalizer</span>
                                </h3>
                                <p className="text-xs font-black text-stitch-on-surface-variant/40 uppercase tracking-[0.2em] mt-2">Comparative Success Probability Dashboard</p>
                            </div>
                            <div className="space-y-6">
                                {displayResults.slice(0, 5).map((item, idx) => (
                                    <div key={item.id} className="group cursor-pointer">
                                        <div className="flex justify-between items-end mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-black text-stitch-primary font-st-headline">{item.name}</span>
                                                <span className={`material-symbols-outlined text-sm ${idx === 0 ? 'text-stitch-secondary animate-bounce' : 'text-stitch-outline-variant'}`}>north</span>
                                            </div>
                                            <span className="text-2xl font-st-headline font-black text-stitch-primary tracking-tighter">{item.prob}%</span>
                                        </div>
                                        <div className="h-5 bg-stitch-surface-container-high/40 rounded-full overflow-hidden p-0.5 border border-stitch-outline-variant/10 shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.score}%` }}
                                                transition={{ duration: 1, delay: 0.3 + (idx * 0.15) }}
                                                className={`h-full rounded-full relative overflow-hidden ${idx === 0 ? 'bg-gradient-to-r from-stitch-primary to-stitch-secondary' : 'bg-stitch-primary'}`}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                                            </motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Metrics Table */}
                        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-stitch-outline-variant/10 shadow-2xl shadow-stitch-primary/5 p-12 flex flex-col">
                            <div className="mb-12">
                                <h3 className="font-st-headline font-black text-3xl text-stitch-primary">상세 지표 비교 데이터</h3>
                                <p className="text-[10px] font-black text-stitch-on-surface-variant/40 uppercase tracking-[0.2em] mt-2">실시간 원천 데이터</p>
                            </div>
                            <div className="overflow-hidden rounded-[2rem] border border-stitch-outline-variant/10 mb-10">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-stitch-primary text-white font-black uppercase tracking-widest text-[10px]">
                                        <tr>
                                            <th className="py-6 px-8">상권명</th>
                                            <th className="py-6 px-4 text-center">인구</th>
                                            <th className="py-6 px-4 text-center">수요</th>
                                            <th className="py-6 px-4 text-center">트렌드</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stitch-outline-variant/10">
                                        {[
                                            { name: '샤로수길', pop: 9.2, dem: 8.8, trend: '↑ 18%', color: 'text-emerald-500' },
                                            { name: '성수동', pop: 8.5, dem: 9.1, trend: '→ 2%', color: 'text-stitch-primary' },
                                            { name: '망원동', pop: 7.9, dem: 7.4, trend: '↓ 4%', color: 'text-red-500' },
                                        ].map((row, idx) => (
                                            <tr
                                                key={idx}
                                                onClick={onShowReport}
                                                className="hover:bg-stitch-primary/5 transition-colors cursor-pointer"
                                            >
                                                <td className="py-6 px-8 font-black text-stitch-primary">{row.name}</td>
                                                <td className="py-6 px-4 text-center font-bold text-stitch-on-surface-variant/60">{row.pop}</td>
                                                <td className="py-6 px-4 text-center font-bold text-stitch-on-surface-variant/60">{row.dem}</td>
                                                <td className={`py-6 px-4 text-center ${row.color} font-black`}>{row.trend}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-auto">
                                <button className="w-full bg-stitch-primary text-white py-6 rounded-[1.5rem] font-st-headline font-black text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-all shadow-2xl shadow-stitch-primary/20 active:scale-[0.98] flex items-center justify-center gap-4 group">
                                    <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-y-1">download</span>
                                    전체 리포트 다운로드 (PDF)
                                </button>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="w-full py-10 px-10 mt-auto border-t border-stitch-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-stitch-on-surface-variant/30">
                    <div>© 2024 더 소버린 인사이트. 전략적 지능 프레임워크</div>
                    <div className="flex gap-12">
                        <a className="hover:text-stitch-primary transition-all" href="#">데이터 방법론</a>
                        <a className="hover:text-stitch-primary transition-all" href="#">AI 투명성</a>
                        <a className="hover:text-stitch-primary transition-all" href="#">법적 정보</a>
                    </div>
                </footer>
            </div>
        </div>
    );
};
