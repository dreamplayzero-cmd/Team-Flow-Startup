import React from 'react';
import { motion } from 'framer-motion';
import { TopNavBar } from '../components/TopNavBar';
import executiveImg from '../../assets/executive.png';

import { useAppDispatch } from '../../store';
import { setView } from '../../store/slices/navigationSlice';

interface DistrictReportPageProps {
    onBack: () => void;
}

export const DistrictReportPage: React.FC<DistrictReportPageProps> = ({ onBack }) => {
    const dispatch = useAppDispatch();
    return (
        <div className="bg-stitch-background text-stitch-on-surface min-h-screen flex selection:bg-stitch-primary/10 font-body">
            {/* Sidebar Navigation */}
            <aside className="fixed top-0 left-0 h-full w-64 bg-stitch-surface border-r border-stitch-outline-variant/30 z-[60] flex flex-col">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-stitch-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-stitch-primary/20">
                        <span className="material-symbols-outlined text-2xl">insights</span>
                    </div>
                    <div>
                        <h2 className="font-st-headline font-extrabold text-stitch-primary text-sm leading-tight">인사이트 엔진</h2>
                        <p className="text-[10px] font-bold text-stitch-on-surface-variant/60 uppercase tracking-widest leading-none mt-1 font-black">전략 레이어</p>
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
                    <button
                        onClick={() => dispatch(setView('district_leaderboard'))}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-stitch-on-surface-variant/60 hover:bg-white hover:text-stitch-primary transition-all group"
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">dashboard</span>
                        <span className="text-[13px] font-bold">상권 분석 리더보드</span>
                    </button>
                    <button
                        onClick={() => dispatch(setView('district_report'))}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white shadow-sm border border-stitch-outline-variant/5 text-stitch-primary font-black"
                    >
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                        <span className="text-[13px]">상권 정밀 분석 리포트</span>
                    </button>
                </nav>

                <div className="p-6 border-t border-stitch-outline-variant/20 space-y-2">
                    <button
                        onClick={onBack}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-stitch-on-surface-variant hover:text-stitch-primary transition-all font-bold text-xs uppercase tracking-widest"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        대시보드로 돌아가기
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 transition-all w-full">
                {/* TopNavBar */}
                <TopNavBar onLogoClick={onBack} offsetSidebar={true} />

                <main className="pt-28 pb-24 px-10 md:px-16 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
                        >
                            <div>
                                <h1 className="text-5xl font-st-headline font-black text-stitch-primary tracking-tight mb-4">성수동 정밀 분석 결과</h1>
                                <p className="text-stitch-on-surface-variant/60 font-medium max-w-xl leading-relaxed">
                                    성수동 상권의 유동 인구, 소비 패턴 및 업종 포화도를 기반으로 한 AI 심층 분석 보고서입니다. 실시간 데이터를 활용하여 업종별 경쟁력과 리스크를 정밀 진단했습니다.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button className="px-6 py-3 bg-white border border-stitch-outline-variant/30 rounded-xl text-xs font-black text-stitch-primary hover:bg-stitch-surface-container-low transition-all uppercase tracking-widest flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">share</span> 리포트 공유
                                </button>
                                <button className="px-6 py-3 bg-stitch-primary text-white rounded-xl text-xs font-black hover:brightness-110 transition-all uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-stitch-primary/20">
                                    <span className="material-symbols-outlined text-lg">download</span> PDF 다운로드
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                            { label: '예상 월 임대료', value: '4억 2천만원', sub: '지역 평균', icon: 'payments', color: 'text-stitch-primary' },
                            { label: '예상 손익분기점', value: '14.7개월', sub: '최적화 목표', icon: 'schedule', color: 'text-stitch-secondary' },
                            { label: '분석 신뢰도', value: '94.2%', sub: '120만 데이터 포인트 기반', icon: 'verified', color: 'text-stitch-primary-container' }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-10 rounded-[2.5rem] border border-stitch-outline-variant/10 shadow-xl shadow-stitch-primary/5 flex flex-col items-center text-center group hover:border-stitch-primary/10 transition-all"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-stitch-surface-container-low flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
                                    <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-stitch-on-surface-variant/40 mb-3">{stat.label}</div>
                                <div className="text-4xl font-st-headline font-black text-stitch-primary mb-2 tracking-tighter">{stat.value}</div>
                                <div className="text-xs font-bold text-stitch-on-surface-variant/60">{stat.sub}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* AI Insights Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                        <div className="lg:col-span-12">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-stitch-primary to-stitch-primary-container p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row gap-12 items-center"
                            >
                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                    <span className="material-symbols-outlined text-[400px]">hub</span>
                                </div>
                                <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-4 border-white/20 shrink-0 relative group">
                                    <img src={executiveImg} alt="AI Advisor" className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-stitch-secondary/40 mix-blend-color opacity-40"></div>
                                </div>
                                <div className="relative z-10 flex-1">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="px-4 py-1.5 bg-stitch-secondary/20 rounded-full border border-stitch-secondary/40 text-stitch-secondary text-[10px] font-black tracking-widest uppercase">AI 전략 리드</div>
                                        <div className="text-white/40 text-[10px] font-medium tracking-[0.3em] font-black">마켓 인텔리전스 V.4</div>
                                    </div>
                                    <h3 className="text-3xl font-st-headline font-black mb-6 leading-tight">"성수동 상권은 현재 <span className="text-stitch-secondary">완숙기(Maturity)</span>에 진입하고 있는 고밀도 상권입니다."</h3>
                                    <p className="text-lg text-white/70 leading-relaxed font-medium mb-8">
                                        과거 공업 지역의 거친 질감과 현대적인 팝업 스토어 문화가 결합되어 유니크한 가치를 창출하고 있습니다. AI 분석 결과, 카페 창업 시 가장 중요한 변수는 <strong className="text-white">‘경험적 차별화’</strong>입니다.
                                        이미 시장은 포화 상태(Saturation)이나, 브랜드 스토리텔링이 명확한 매장의 경우 상위 20%의 매출 집중도가 매우 높게 나타납니다.
                                    </p>
                                    <div className="flex flex-wrap gap-10 pt-8 border-t border-white/10">
                                        <div>
                                            <div className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-2">시장 단계</div>
                                            <div className="text-2xl font-black text-stitch-secondary">완숙기 (Maturity)</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-2">주요 타겟</div>
                                            <div className="text-2xl font-black">MZ 세대 (45%)</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-2">전략 집중</div>
                                            <div className="text-2xl font-black text-stitch-secondary">스토리텔링</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Positive & Risks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-12 rounded-[3.5rem] border border-stitch-outline-variant/10 shadow-xl"
                        >
                            <h4 className="flex items-center gap-3 text-2xl font-st-headline font-black text-stitch-primary mb-10">
                                <span className="material-symbols-outlined text-stitch-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                긍정적 지표
                            </h4>
                            <div className="space-y-8">
                                <div className="group">
                                    <div className="font-st-headline font-bold text-xl text-stitch-primary mb-2 group-hover:text-stitch-secondary transition-colors">강력한 2030 타겟팅</div>
                                    <p className="text-sm leading-relaxed text-stitch-on-surface-variant/70 font-medium">전체 유동 인구의 45%가 MZ세대로 구성되어 트렌드 민감도가 높고 지속적인 유입이 보장되는 강력한 성장 엔진입니다.</p>
                                </div>
                                <div className="group border-t border-stitch-outline-variant/10 pt-8">
                                    <div className="font-st-headline font-bold text-xl text-stitch-primary mb-2 group-hover:text-stitch-secondary transition-colors">팝업 스토어 연계 효과</div>
                                    <p className="text-sm leading-relaxed text-stitch-on-surface-variant/70 font-medium">글로벌 브랜드들의 테스트베드로 활용되어 상시적인 대규모 이벤트가 열리며, 비목적성 방문객의 유입률이 타 상권 대비 2.4배 높습니다.</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-12 rounded-[3.5rem] border border-stitch-outline-variant/10 shadow-xl"
                        >
                            <h4 className="flex items-center gap-3 text-2xl font-st-headline font-black text-stitch-primary mb-10">
                                <span className="material-symbols-outlined text-stitch-error text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                                리스크 요인
                            </h4>
                            <div className="space-y-8">
                                <div className="group">
                                    <div className="font-st-headline font-bold text-xl text-stitch-primary mb-2 group-hover:text-stitch-error transition-colors">급격한 젠트리피케이션</div>
                                    <p className="text-sm leading-relaxed text-stitch-on-surface-variant/70 font-medium">최근 1년 내 평균 임대료가 18.4% 상승을 기록하며 초기 자본금 확보 및 임대차 갱신 시의 비용 리스크가 매우 높은 편입니다.</p>
                                </div>
                                <div className="group border-t border-stitch-outline-variant/10 pt-8">
                                    <div className="font-st-headline font-bold text-xl text-stitch-primary mb-2 group-hover:text-stitch-error transition-colors">업종 과밀화 우려</div>
                                    <p className="text-sm leading-relaxed text-stitch-on-surface-variant/70 font-medium">카페 및 복합문화공간 업종의 생존 난이도가 서울 타 상권 평균 대비 1.5배 높게 측정되어 있어 강력한 초기 차별화가 필수적입니다.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </main>

                {/* Footer Toolbar */}
                <footer className="w-full py-12 px-10 mt-auto border-t border-stitch-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-stitch-on-surface-variant/30">
                    <div>The Sovereign Insight 전략 분석 프레임워크 v.4.2</div>
                    <div className="flex gap-12">
                        <a className="hover:text-stitch-primary" href="#">시스템 상태</a>
                        <a className="hover:text-stitch-primary" href="#">데이터 공개</a>
                        <a className="hover:text-stitch-primary" href="#">분석가 문의</a>
                    </div>
                </footer>
            </div>
        </div>
    );
};
