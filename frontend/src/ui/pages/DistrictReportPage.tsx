import React from 'react';
import { motion } from 'framer-motion';
import { TopNavBar } from '../components/TopNavBar';
import executiveImg from '../../assets/executive.png';

import { useAppDispatch, useAppSelector } from '../../store';
import { setView } from '../../store/slices/navigationSlice';

interface DistrictReportPageProps {
    onBack: () => void;
}

export const DistrictReportPage: React.FC<DistrictReportPageProps> = ({ onBack }) => {
    const dispatch = useAppDispatch();
    const { results, status } = useAppSelector((state) => state.analysis);
    
    // Pick the first report or show placeholder
    const report = results && results.length > 0 ? results[0] : null;
    const areaName = report?.area_name || "상권 미선택";
    
    // Backend base URL for static assets (images)
    const backendUrl = "http://localhost:8000";
    
    if (status === 'loading') {
        return (
            <div className="bg-stitch-background min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-stitch-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-stitch-primary font-black tracking-widest uppercase text-xs">AI 심층 상권 분석 중...</p>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="bg-stitch-background min-h-screen flex items-center justify-center p-10">
                <div className="bg-white p-16 rounded-[4rem] border border-stitch-outline-variant/10 shadow-2xl text-center max-w-lg">
                    <span className="material-symbols-outlined text-6xl text-stitch-outline-variant/40 mb-6">inventory_2</span>
                    <h2 className="text-3xl font-st-headline font-black text-stitch-primary mb-4">분석 데이터가 없습니다</h2>
                    <p className="text-stitch-on-surface-variant/60 mb-8 font-medium">상권 분석을 먼저 진행해 주세요. AI 엔진이 비즈니스 플랜을 기다리고 있습니다.</p>
                    <button onClick={onBack} className="px-10 py-4 bg-stitch-primary text-white rounded-2xl font-black hover:brightness-110 transition-all shadow-xl shadow-stitch-primary/20">대시보드로 돌아가기</button>
                </div>
            </div>
        );
    }

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
                                <h1 className="text-5xl font-st-headline font-black text-stitch-primary tracking-tight mb-4">{areaName} 정밀 분석 결과</h1>
                                <p className="text-stitch-on-surface-variant/60 font-medium max-w-xl leading-relaxed">
                                    {areaName} 상권의 유동 인구, 소비 패턴 및 업종 포화도를 기반으로 한 AI 심층 분석 보고서입니다. 실시간 데이터를 활용하여 업종별 경쟁력과 리스크를 정밀 진단했습니다.
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
                            { label: '종합 성공 확률', value: `${(report.success_prob * 100).toFixed(1)}%`, sub: '분석 모델 예측값', icon: 'trending_up', color: 'text-stitch-primary' },
                            { label: '상권 종합 점수', value: `${report.final_score.toFixed(1)}점`, sub: '100점 만점 기준', icon: 'workspace_premium', color: 'text-stitch-secondary' },
                            { label: '데이터 분석량', value: '1,248,502', sub: '실시간 데이터 기반', icon: 'database', color: 'text-stitch-primary-container' }
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

                    {/* AI Insights & Visual DNA Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                        <div className="lg:col-span-12">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-stitch-primary to-stitch-primary-container p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row gap-12 items-stretch"
                            >
                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                    <span className="material-symbols-outlined text-[400px]">hub</span>
                                </div>
                                
                                {/* Visual DNA Card */}
                                <div className="w-full lg:w-[450px] bg-white/10 backdrop-blur-md rounded-[3rem] p-6 border border-white/20 flex flex-col gap-6 relative group overflow-hidden">
                                    <div className="flex items-center justify-between px-2">
                                        <div className="text-[10px] font-black tracking-[0.3em] uppercase text-white/60">Recommended Visual DNA</div>
                                        <div className="px-3 py-1 bg-stitch-secondary text-stitch-primary rounded-full text-[9px] font-black uppercase">{report.dna_result?.tone || "Standard"}</div>
                                    </div>
                                    <div className="flex-1 rounded-[2rem] overflow-hidden shadow-inner border border-white/5 relative">
                                        {report.dna_result?.image_path ? (
                                            <img 
                                                src={`${backendUrl}/${report.dna_result.image_path}`} 
                                                alt="Visual DNA Recommendation" 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-stitch-primary/40 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-4xl opacity-20">image</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                            <div className="text-white">
                                                <p className="text-[10px] font-bold opacity-60 mb-1">인테리어 추천 스타일</p>
                                                <h4 className="text-xl font-st-headline font-black tracking-tight">{report.dna_result?.tone || "분석 완료"}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Strategy Lead Text */}
                                <div className="relative z-10 flex-1 flex flex-col py-4">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="px-4 py-1.5 bg-stitch-secondary/20 rounded-full border border-stitch-secondary/40 text-stitch-secondary text-[10px] font-black tracking-widest uppercase">AI 브랜드 전략 클러스터</div>
                                        <div className="text-white/40 text-[10px] font-medium tracking-[0.3em] font-black">ST-LOGIC V.2.0</div>
                                    </div>
                                    <h3 className="text-3xl font-st-headline font-black mb-6 leading-tight">"{areaName} 상권의 고객 페르소나는 <span className="text-stitch-secondary">특정 디자인 톤</span>에 강력하게 반응합니다."</h3>
                                    <p className="text-lg text-white/70 leading-relaxed font-medium mb-8">
                                        분석 결과, 현재 {areaName} 상권에서 가장 높은 전환율을 보이는 디자인 DNA는 <strong>‘{report.dna_result?.tone}’</strong> 계열입니다. 
                                        {report.positives && report.positives.length > 0 ? (
                                            <>이 지역은 {report.positives[0]} 등의 긍정적 요인이 뚜렷하며, 이를 극대화하기 위한 전략적 접근이 필요합니다.</>
                                        ) : (
                                            <>상권의 특성을 고려한 전술적 배치가 요구되는 시점입니다.</>
                                        )}
                                    </p>
                                    <div className="flex flex-wrap gap-10 pt-8 border-t border-white/10 mt-auto">
                                        <div>
                                            <div className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-2">핵심 DNA</div>
                                            <div className="text-2xl font-black text-stitch-secondary">{report.dna_result?.tone || "분석 중"}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-2">성공 확률</div>
                                            <div className="text-2xl font-black">{(report.success_prob * 100).toFixed(0)}%</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-2">주요 리스크</div>
                                            <div className="text-2xl font-black text-stitch-secondary">{report.risks[0]?.split(' ').slice(0, 2).join(' ') || "경쟁 과열"}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Positive & Risks List */}
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
                                {report.positives.map((pos, i) => (
                                    <div key={i} className="group border-t first:border-0 border-stitch-outline-variant/10 pt-8 first:pt-0">
                                        <div className="font-st-headline font-bold text-xl text-stitch-primary mb-2 group-hover:text-stitch-secondary transition-colors">
                                            {pos.split(':')[0]}
                                        </div>
                                        <p className="text-sm leading-relaxed text-stitch-on-surface-variant/70 font-medium">
                                            {pos.includes(':') ? pos.split(':')[1] : pos}
                                        </p>
                                    </div>
                                ))}
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
                                {report.risks.map((risk, i) => (
                                    <div key={i} className="group border-t first:border-0 border-stitch-outline-variant/10 pt-8 first:pt-0">
                                        <div className="font-st-headline font-bold text-xl text-stitch-primary mb-2 group-hover:text-stitch-error transition-colors">
                                            {risk.split(':')[0]}
                                        </div>
                                        <p className="text-sm leading-relaxed text-stitch-on-surface-variant/70 font-medium">
                                            {risk.includes(':') ? risk.split(':')[1] : risk}
                                        </p>
                                    </div>
                                ))}
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
