import React from 'react';
import { motion } from 'framer-motion';
import { TopNavBar } from '../components/TopNavBar';
import luxuryMarbleBg from '../../assets/luxury_marble_bg.png';
import argyleBg from '../../assets/argyle_pattern.png';
import { useAppDispatch } from '../../store';
import { setView } from '../../store/slices/navigationSlice';

interface DistrictReportPageProps {
    onBack: () => void;
}

export const DistrictReportPage: React.FC<DistrictReportPageProps> = ({ onBack }) => {
    const dispatch = useAppDispatch();

    const accent = '#64d2ff';
    const accentGreen = '#4ade80';
    const accentGold = '#fbbf24';

    return (
        <div className="bg-[#0f1115] text-white/90 min-h-screen flex selection:bg-white/10 font-body relative overflow-x-hidden">

            {/* Split Background */}
            <div className="fixed inset-0 z-0 pointer-events-none flex flex-col">
                <div className="h-[40vh] w-full relative">
                    <img className="w-full h-full object-cover opacity-30 grayscale" alt="Hero background" src={luxuryMarbleBg} />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f1115]"></div>
                </div>
                <div className="h-[60vh] w-full relative overflow-hidden bg-[#0f1115]">
                    <div
                        className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%] opacity-[0.07] rotate-45"
                        style={{ backgroundImage: `url(${argyleBg})`, backgroundSize: '300px 300px', backgroundRepeat: 'repeat' }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/70 to-transparent"></div>
                </div>
            </div>

            {/* Sidebar */}
            <aside className="fixed top-0 left-0 h-full w-64 bg-[#13161b]/90 backdrop-blur-xl border-r border-white/5 z-[60] hidden lg:flex flex-col">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: accent + '22', border: `1px solid ${accent}44` }}>
                        <span className="material-symbols-outlined text-2xl" style={{ color: accent }}>insights</span>
                    </div>
                    <div>
                        <h2 className="font-st-headline font-extrabold text-sm leading-tight" style={{ color: accent }}>인사이트 엔진</h2>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none mt-1">전략 레이어</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
                    {[
                        { label: '개인 창업자 프로파일링', icon: 'person_search', view: 'persona' },
                        { label: '비즈니스 플랜 설정', icon: 'edit_document', view: 'business_plan' },
                        { label: '상권 분석 리더보드', icon: 'dashboard', view: 'district_leaderboard' },
                    ].map(item => (
                        <button
                            key={item.view}
                            onClick={() => dispatch(setView(item.view as any))}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/40 hover:text-white/90 hover:bg-white/5 transition-all group"
                        >
                            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">{item.icon}</span>
                            <span className="text-[13px] font-bold">{item.label}</span>
                        </button>
                    ))}
                    <button
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-black"
                        style={{ background: accent + '18', border: `1px solid ${accent}33`, color: accent }}
                    >
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                        <span className="text-[13px]">상권 정밀 분석 리포트</span>
                    </button>
                </nav>

                <div className="p-6 border-t border-white/5">
                    <button
                        onClick={onBack}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:text-white/80 transition-all font-bold text-xs uppercase tracking-widest"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        대시보드로 돌아가기
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:pl-64 w-full relative z-10">
                <TopNavBar onLogoClick={onBack} offsetSidebar={true} />

                <main className="pt-28 pb-24 px-8 md:px-14 max-w-7xl mx-auto">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
                    >
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.25em] mb-3 flex items-center gap-2" style={{ color: accent }}>
                                <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: accent }}></span>
                                DISTRICT_ANALYSIS · REPORT
                            </p>
                            <h1 className="text-5xl font-st-headline font-black text-white tracking-tight mb-4">성수동 정밀 분석 결과</h1>
                            <p className="text-white/50 font-medium max-w-xl leading-relaxed">
                                성수동 상권의 유동 인구, 소비 패턴 및 업종 포화도를 기반으로 한 AI 심층 분석 보고서입니다.
                            </p>
                        </div>
                        <div className="flex gap-4 shrink-0">
                            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white/70 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">share</span>리포트 공유
                            </button>
                            <button
                                className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all"
                                style={{ background: accent, color: '#0f1115' }}
                            >
                                <span className="material-symbols-outlined text-lg">download</span>PDF 다운로드
                            </button>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {[
                            { label: '예상 월 임대료', value: '4억 2천만원', sub: '지역 평균', icon: 'payments', color: accent },
                            { label: '예상 손익분기점', value: '14.7개월', sub: '최적화 목표', icon: 'schedule', color: accentGold },
                            { label: '분석 신뢰도', value: '94.2%', sub: '120만 데이터포인트', icon: 'verified', color: accentGreen },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-[#16191e]/90 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/8 shadow-2xl flex flex-col items-center text-center group hover:border-white/20 transition-all relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none" style={{ background: stat.color + '1a' }}></div>
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: stat.color + '1a', border: `1px solid ${stat.color}33` }}>
                                    <span className="material-symbols-outlined text-3xl" style={{ color: stat.color }}>{stat.icon}</span>
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">{stat.label}</div>
                                <div className="text-4xl font-st-headline font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                                <div className="text-xs font-bold" style={{ color: stat.color }}>{stat.sub}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* AI Insights Banner */}
                    <div className="mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-12 rounded-[3.5rem] relative overflow-hidden shadow-2xl flex flex-col md:flex-row gap-12 items-center border border-white/10"
                            style={{ background: 'linear-gradient(135deg, #1a2035 0%, #0f1820 100%)' }}
                        >
                            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 10% 50%, ${accent}10, transparent 70%)` }}></div>
                            <div className="w-40 h-40 rounded-[3rem] border-2 border-white/10 shrink-0 flex items-center justify-center text-5xl" style={{ background: '#1e2533' }}>
                                🤖
                            </div>
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest" style={{ background: accent + '22', color: accent, border: `1px solid ${accent}44` }}>AI 전략 리드</div>
                                    <div className="text-white/30 text-[10px] font-black tracking-[0.3em]">마켓 인텔리전스 V.4</div>
                                </div>
                                <h3 className="text-3xl font-st-headline font-black mb-6 leading-tight text-white">
                                    "성수동 상권은 현재{' '}
                                    <span className="px-2 rounded-lg" style={{ background: accent + '30', color: accent }}>완숙기(Maturity)</span>
                                    {' '}에 진입하고 있는 고밀도 상권입니다."
                                </h3>
                                <p className="text-lg text-white/60 leading-relaxed font-medium mb-8">
                                    과거 공업 지역의 거친 질감과 현대적인 팝업 스토어 문화가 결합되어 유니크한 가치를 창출하고 있습니다.
                                    AI 분석 결과, 카페 창업 시 가장 중요한 변수는{' '}
                                    <strong className="text-white underline decoration-wavy" style={{ textDecorationColor: accentGold }}>'경험적 차별화'</strong>입니다.
                                </p>
                                <div className="flex flex-wrap gap-10 pt-8 border-t border-white/10">
                                    {[
                                        { label: '시장 단계', value: '완숙기 (Maturity)' },
                                        { label: '주요 타겟', value: 'MZ 세대 (45%)' },
                                        { label: '전략 집중', value: '스토리텔링' },
                                    ].map(item => (
                                        <div key={item.label}>
                                            <div className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-2">{item.label}</div>
                                            <div className="text-2xl font-black text-white">{item.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Positives & Risks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#16191e]/80 backdrop-blur-md p-12 rounded-[3.5rem] border border-white/8 shadow-2xl"
                        >
                            <h4 className="flex items-center gap-3 text-2xl font-st-headline font-black text-white mb-10">
                                <span className="material-symbols-outlined text-3xl" style={{ color: accentGreen, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                긍정적 지표
                            </h4>
                            <div className="space-y-8">
                                <div>
                                    <div className="font-st-headline font-bold text-xl text-white mb-2">강력한 2030 타겟팅</div>
                                    <p className="text-sm leading-relaxed text-white/50">전체 유동 인구의 45%가 MZ세대로 구성되어 트렌드 민감도가 높고 지속적인 유입이 보장되는 강력한 성장 엔진입니다.</p>
                                </div>
                                <div className="border-t border-white/8 pt-8">
                                    <div className="font-st-headline font-bold text-xl text-white mb-2">팝업 스토어 연계 효과</div>
                                    <p className="text-sm leading-relaxed text-white/50">글로벌 브랜드들의 테스트베드로 활용되어 상시적인 대규모 이벤트가 열리며, 비목적성 방문객의 유입률이 타 상권 대비 2.4배 높습니다.</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#16191e]/80 backdrop-blur-md p-12 rounded-[3.5rem] border border-white/8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-bl from-red-500/5 to-transparent pointer-events-none"></div>
                            <h4 className="flex items-center gap-3 text-2xl font-st-headline font-black text-white mb-10">
                                <span className="material-symbols-outlined text-red-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                                리스크 요인
                            </h4>
                            <div className="space-y-8">
                                <div>
                                    <div className="font-st-headline font-bold text-xl text-white mb-2">급격한 젠트리피케이션</div>
                                    <p className="text-sm leading-relaxed text-white/50">최근 1년 내 평균 임대료가 18.4% 상승을 기록하며 초기 자본금 확보 및 임대차 갱신 시의 비용 리스크가 매우 높은 편입니다.</p>
                                </div>
                                <div className="border-t border-white/8 pt-8">
                                    <div className="font-st-headline font-bold text-xl text-white mb-2">업종 과밀화 우려</div>
                                    <p className="text-sm leading-relaxed text-white/50">카페 및 복합문화공간 업종의 생존 난이도가 서울 타 상권 평균 대비 1.5배 높게 측정되어 있어 강력한 초기 차별화가 필수적입니다.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </main>

                <footer className="w-full py-10 px-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                    <div>The Sovereign Insight 전략 분석 프레임워크 v.4.2</div>
                    <div className="flex gap-12">
                        <a className="hover:text-white/60 transition-all" href="#">시스템 상태</a>
                        <a className="hover:text-white/60 transition-all" href="#">데이터 공개</a>
                        <a className="hover:text-white/60 transition-all" href="#">분석가 문의</a>
                    </div>
                </footer>
            </div>
        </div>
    );
};
