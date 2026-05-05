import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TopNavBar } from '../components/TopNavBar';
import { useAppDispatch, useAppSelector } from '../../store';
import { setView } from '../../store/slices/navigationSlice';

interface DistrictReportPageProps {
    onBack: () => void;
}

export const DistrictReportPage: React.FC<DistrictReportPageProps> = ({ onBack }) => {
    const dispatch = useAppDispatch();
    const { results, status } = useAppSelector((state) => state.analysis);
    const [selectedTerm, setSelectedTerm] = useState<'current' | '1yr' | '3yr' | '6yr'>('current');
    const [activeTab, setActiveTab] = useState<'asset' | 'risk'>('asset');
    
    const report = results && results.length > 0 ? results[0] : null;
    const areaName = report?.area_name || "상권 미선택";

    if (status === 'loading') {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0A0C10]">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-16 h-16 border-4 border-stitch-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!report) return <div className="text-white p-20">데이터가 없습니다.</div>;

    const termLabelMapping = { 'current': '현재', '1yr': '1년 뒤', '3yr': '3년 뒤', '6yr': '6년 후' };

    return (
        <div className="bg-[#0A0C10] text-white min-h-screen flex font-body relative overflow-x-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="fixed top-0 left-0 h-full w-64 bg-[#1A1C23] border-r border-white/5 z-[60] flex flex-col shadow-2xl">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-stitch-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                        <span className="material-symbols-outlined text-2xl">insights</span>
                    </div>
                    <div>
                        <h2 className="font-st-headline font-extrabold text-white text-lg leading-tight">Youth Startup Flow</h2>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none mt-1">전략 레이어</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {[
                        { id: 'persona', label: 'Founder Profiling', icon: 'person_search' },
                        { id: 'business_plan', label: 'Business Plan', icon: 'edit_document' },
                        { id: 'district_leaderboard', label: 'District Leaderboard', icon: 'dashboard' },
                        { id: 'district_report', label: 'District Report', icon: 'analytics', active: true }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => dispatch(setView(item.id as any))}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${item.active ? 'bg-white/5 text-stitch-secondary border border-white/5 font-black' : 'text-white/40 hover:text-white hover:bg-white/5 font-bold'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]" style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                            <span className="text-[12px]">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5">
                    <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/30 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Dashboard
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 transition-all w-full relative z-10">
                <TopNavBar onLogoClick={onBack} offsetSidebar={true} />

                <div className="pt-28 pb-24 px-8 md:px-12 max-w-7xl mx-auto space-y-16">
                    
                    {/* Header Banner - Restored from Screenshot 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border-8 border-[#F5F5F0] rounded-[3.5rem] overflow-hidden shadow-2xl relative"
                    >
                        <div className="h-48 bg-[url('https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=1000')] bg-cover bg-center flex items-center px-12 relative">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="w-12 h-12 bg-stitch-primary rounded-2xl flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined font-black">verified_user</span>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-st-headline font-black text-white tracking-tight uppercase">
                                        {areaName} 상권 분석 결과 리포트
                                    </h1>
                                    <p className="text-[10px] font-black text-white/50 tracking-[0.3em] mt-1 uppercase">미래 상권 시뮬레이션 모델 V.1.0 (LOCATION INTELLIGENCE)</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-12 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center bg-white text-black">
                            {/* Step 01. AI SCORE */}
                            <div className="bg-[#1A1A1A] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-4 right-8 text-[10px] font-black text-white/20 uppercase tracking-widest font-mono italic">analytics</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-stitch-secondary mb-8">Step 01. AI Score</div>
                                <div className="text-7xl font-st-headline font-black mb-4 tracking-tighter">
                                    {report.final_score?.toFixed(1) ?? "75.5"}<span className="text-2xl text-stitch-secondary ml-1">pts</span>
                                </div>
                                <p className="text-[11px] text-white/40 leading-relaxed mb-8">매치 스코어 로직에 따른 최종 분석 점수입니다.</p>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${report.final_score ?? 75.5}%` }}
                                        className="h-full bg-stitch-secondary" 
                                    />
                                </div>
                            </div>
                            
                            {/* Step 02. GROWTH PATH */}
                            <div className="space-y-10 py-4">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">Step 02. 상권 성장 경로 분석</div>
                                <div className="relative pl-10 border-l-2 border-slate-200 space-y-10">
                                    <div className="relative">
                                        <div className="absolute -left-[45px] top-0 w-3 h-3 rounded-full bg-[#008A5E] border-2 border-white" />
                                        <h4 className="text-[13px] font-black text-black mb-1">SNS 밀도 전이 분석</h4>
                                        <p className="text-[11px] font-medium text-black/40 tracking-tight">지역 내 Viral 확산 임계점 도달 중</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[45px] top-0 w-3 h-3 rounded-full bg-black/20 border-2 border-white" />
                                        <h4 className="text-[13px] font-black text-black mb-1">상권 이동 예측 지수</h4>
                                        <p className="text-2xl font-black text-black">72</p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 03. DESIGN DNA */}
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-[300px] border-4 border-white group">
                                <img 
                                    src={`https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800`}
                                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                                    alt="Design DNA" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                                    <div className="text-[9px] font-black text-stitch-secondary uppercase tracking-widest mb-2">Step 03. Design DNA</div>
                                    <h4 className="text-white font-st-headline font-black text-2xl mb-1">{report.dna_result?.tone || "모던 럭셔리"}</h4>
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Source: 디자인 DNA 합성 알고리즘</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* AI Strategy Core - Restored from Screenshot 3 */}
                    <section className="space-y-10">
                        <div className="flex flex-col lg:flex-row gap-12 items-start">
                            <div className="flex-1 space-y-12">
                                <div className="inline-block px-4 py-1.5 bg-[#008A5E]/20 border border-[#008A5E]/30 rounded-full text-[10px] font-black text-[#008A5E] uppercase tracking-widest mb-4">AI STRATEGY CORE</div>
                                <h2 className="text-5xl font-st-headline font-black text-white leading-tight">
                                    "{areaName} 상권은 현재 <span className="text-[#00C48C]">감성 폭발형</span> <br/>성장 단계의 초입에 위치해 있습니다."
                                </h2>
                                
                                <div className="bg-[#1A1C23] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
                                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-6">Strategic Advice</div>
                                    <p className="text-lg text-white/80 leading-relaxed font-bold italic">
                                        "모던 럭셔리 스타일의 브랜드 런칭 시 초기 6개월 내 Viral 도달 확률 75%"
                                    </p>
                                </div>
                            </div>

                            <div className="w-full lg:w-96 space-y-6">
                                <div className="bg-[#121212] p-8 rounded-[2.5rem] border border-white/5 space-y-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">임대료 급등 리스크</span>
                                        <span className="text-[11px] font-black text-[#00C48C] uppercase tracking-widest">낮음</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">임대료 가늠 지수</span>
                                        <span className="text-xl font-black text-white">320만</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">BEP 예상 소요시간</span>
                                        <span className="text-[11px] font-black text-[#00C48C] uppercase tracking-widest">약 14개월</span>
                                    </div>
                                </div>
                                <button className="w-full py-6 bg-white/5 border border-white/10 rounded-2xl text-[12px] font-black text-white/50 uppercase tracking-widest hover:bg-white/10 transition-all">
                                    엔진 가동 중지
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Analysis Tabs - Restored from Screenshot 4 */}
                    <section className="space-y-12">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="flex gap-12">
                                <button 
                                    onClick={() => setActiveTab('asset')}
                                    className={`text-[12px] font-black uppercase tracking-[0.2em] transition-all pb-4 relative ${activeTab === 'asset' ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
                                >
                                    전략 자산 분석
                                    {activeTab === 'asset' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
                                </button>
                                <button 
                                    onClick={() => setActiveTab('risk')}
                                    className={`text-[12px] font-black uppercase tracking-[0.2em] transition-all pb-4 relative ${activeTab === 'risk' ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
                                >
                                    리스크 모델링
                                    {activeTab === 'risk' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
                                </button>
                            </div>
                            <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">DB CONNECTION: ACTIVE (V2.1)</div>
                        </div>

                        {activeTab === 'asset' ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1 bg-[#1A1C23] p-10 rounded-[3rem] border border-white/5">
                                    <div className="text-[10px] font-black text-[#00C48C] uppercase tracking-widest mb-10">Asset Scorecard</div>
                                    <div className="space-y-10">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">상권 종합 순위</span>
                                            <span className="text-3xl font-black text-white tracking-tighter">Top 2.4%</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">월간 성장률</span>
                                            <span className="text-3xl font-black text-white tracking-tighter">+14.2%</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">업종 시너지 지수</span>
                                            <span className="text-3xl font-black text-[#00C48C] tracking-tighter">92/100</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-2 bg-[#121212] p-12 rounded-[3rem] border border-white/5 relative overflow-hidden">
                                    <div className="absolute top-8 right-8 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#00C48C] animate-pulse" />
                                        <span className="text-[8px] font-black text-[#00C48C] uppercase tracking-widest">Live Data Stream</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-8">Core Strategic Assets Summary</h3>
                                    <p className="text-lg text-white/60 leading-relaxed font-medium">
                                        DB 분석 결과, {areaName} 상권은 <strong>2030 여성층의 목적성 방문이 68%</strong>를 차지하는 '전략적 우위 자산'을 보유하고 있습니다. 이는 배후 주거지의 높은 가처분 소득과 결합되어 강력한 객단가 형성 동력으로 작용합니다.
                                    </p>
                                    <div className="flex gap-4 mt-12">
                                        <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-white/30 uppercase tracking-widest">Real-time DB Sync</div>
                                        <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-white/30 uppercase tracking-widest">Algorithm V3.1</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#1A1C23] p-20 rounded-[3rem] border border-white/5 text-center italic text-white/20">리스크 모델링 데이터를 시뮬레이션 중입니다...</div>
                        )}
                    </section>

                    {/* Future Prediction - Restored from Screenshot 5 */}
                    <section className="bg-white rounded-[4rem] p-16 text-black shadow-2xl space-y-12">
                        <div className="flex items-center justify-between">
                            <h2 className="text-4xl font-st-headline font-black tracking-tight">미래 상권 가치 예측</h2>
                            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                                {(Object.keys(termLabelMapping) as Array<keyof typeof termLabelMapping>).map(term => (
                                    <button
                                        key={term}
                                        onClick={() => setSelectedTerm(term)}
                                        className={`px-6 py-2.5 rounded-xl text-[11px] font-black transition-all ${selectedTerm === term ? 'bg-white shadow-lg text-black scale-105' : 'text-black/30 hover:text-black/50'}`}
                                    >
                                        {termLabelMapping[term]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="flex-1 w-full relative rounded-[3rem] overflow-hidden shadow-2xl h-[450px] border-8 border-slate-50">
                                <motion.img 
                                    key={selectedTerm}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    src={
                                        selectedTerm === 'current' ? "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" :
                                        selectedTerm === '1yr' ? "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200" :
                                        selectedTerm === '3yr' ? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" :
                                        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200"
                                    }
                                    className="w-full h-full object-cover"
                                    alt="Future Prediction"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>

                            <div className="flex-1 space-y-10">
                                <h3 className="text-3xl font-black leading-tight">
                                    "{areaName} 상권은 {termLabelMapping[selectedTerm]} <span className="text-[#008A5E]">감성 폭발형</span> <br/>성장 단계의 초입에 위치해 있습니다."
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center">
                                        <div className="text-[10px] font-black text-black/20 uppercase tracking-widest mb-4">상권 이동 활성도</div>
                                        <div className="text-4xl font-black text-black tracking-tighter">72/100</div>
                                    </div>
                                    <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center">
                                        <div className="text-[10px] font-black text-black/20 uppercase tracking-widest mb-4">예상 상태</div>
                                        <div className="text-2xl font-black text-[#008A5E]">진입 적기</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="w-full py-12 px-10 border-t border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-white/20 relative z-10">
                    <div>© 2024 Team Flow. Strategy Layer v.2.0</div>
                    <button onClick={onBack} className="hover:text-white transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">logout</span> Back to Dashboard
                    </button>
                </footer>
            </div>
        </div>
    );
};
