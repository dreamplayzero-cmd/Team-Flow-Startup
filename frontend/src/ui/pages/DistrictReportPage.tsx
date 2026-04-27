import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TopNavBar } from '../components/TopNavBar';
import { useAppDispatch, useAppSelector } from '../../store';
import { setView } from '../../store/slices/navigationSlice';

// Import local assets
import seoulMapImg from '../../assets/seoul_map.png';

interface DistrictReportPageProps {
    onBack: () => void;
}

export const DistrictReportPage: React.FC<DistrictReportPageProps> = ({ onBack }) => {
    const dispatch = useAppDispatch();
    const { results, status } = useAppSelector((state) => state.analysis);
    const [selectedTerm, setSelectedTerm] = useState<'current' | '1yr' | '3yr' | '6yr'>('current');
    const [mapTerm, setMapTerm] = useState<'current' | '1yr' | '3yr' | '6yr'>('current');
    const [showStrategyPanel, setShowStrategyPanel] = useState(false);
    const [activeStrategyTab, setActiveStrategyTab] = useState<'asset' | 'risk'>('asset');
    
    // Pick the first report or show placeholder
    const report = results && results.length > 0 ? results[0] : null;
    const areaName = report?.area_name || "상권 미선택";

    // Team-updated Image Mapping Logic (Visual DNA) - Refined for exact filename match
    const getLocalDnaImage = () => {
        if (!report) return null;
        const areaKey = areaName.includes('성수') ? 'SS' : (areaName.includes('한남') ? 'HN' : 'SS');
        const toneKey = report.dna_result?.tone === 'Industrial Vintage' ? 'ID' : 
                        (report.dna_result?.tone === 'Modern Chic' ? 'MC' : 
                        (report.dna_result?.tone === 'Minimal Basic' ? 'MN' : 'WW'));
        
        const mapping: Record<string, string> = {
            'SS_ID': 'SS_ID_01_Seongsu_Dining_IndustrialVintage.jpg',
            'SS_MC': 'SS_MC_01_Seongsu_EditShop_ModernChic.jpg',
            'SS_MN': 'SS_MN_01_Seongsu_Cafe_MinimalBasic.jpg',
            'SS_WW': 'SS_WW_01_Seongsu_Cafe_WarmWood.jpg',
            'HN_ID': 'HN_ID_01_Hannam_Dining_IndustrialVintage.jpg',
            'HN_MC': 'HN_MC_01_Hannam_Dining_ModernChic.jpg',
            'HN_MN': 'HN_MN_01_Hannam_EditShop_MinimalBasic.jpg',
            'HN_WW': 'HN_WW_01_Hannam_Cafe_WarmWood.jpg'
        };

        const key = `${areaKey}_${toneKey}`;
        const fileName = mapping[key] || mapping['SS_MN'];
        return `/src/assets/visual_dna/${fileName}`;
    };

    const backendUrl = "http://localhost:8000";
    
    // Static Clustering View (Fixed: Seoul Map with Static Dots)
    const StaticClusteringMap = () => {
        const getClusterData = () => {
            switch(mapTerm) {
                case '1yr': return [
                    { x: '35%', y: '40%', color: '#FF7043', label: 'F&B' },
                    { x: '55%', y: '30%', color: '#4DB6AC', label: 'Fashion' },
                    { x: '45%', y: '60%', color: '#7E57C2', label: 'Culture' }
                ];
                case '3yr': return [
                    { x: '32%', y: '38%', color: '#FF7043', label: 'F&B' },
                    { x: '38%', y: '42%', color: '#FF7043', label: 'F&B' },
                    { x: '58%', y: '28%', color: '#4DB6AC', label: 'Fashion' },
                    { x: '52%', y: '32%', color: '#4DB6AC', label: 'Fashion' },
                    { x: '48%', y: '65%', color: '#7E57C2', label: 'Culture' },
                    { x: '65%', y: '50%', color: '#42A5F5', label: 'Service' }
                ];
                case '6yr': return [
                    { x: '30%', y: '35%', color: '#FF7043', label: 'F&B' },
                    { x: '34%', y: '40%', color: '#FF7043', label: 'F&B' },
                    { x: '60%', y: '25%', color: '#4DB6AC', label: 'Fashion' },
                    { x: '65%', y: '30%', color: '#4DB6AC', label: 'Fashion' },
                    { x: '45%', y: '70%', color: '#7E57C2', label: 'Culture' },
                    { x: '70%', y: '55%', color: '#42A5F5', label: 'Service' },
                    { x: '75%', y: '45%', color: '#42A5F5', label: 'Service' }
                ];
                default: return [
                    { x: '40%', y: '45%', color: '#FF7043', label: 'F&B' },
                    { x: '50%', y: '35%', color: '#4DB6AC', label: 'Fashion' }
                ];
            }
        };

        return (
            <div className="absolute inset-0 z-40 pointer-events-none">
                <img src="https://images.unsplash.com/photo-1540959733332-e94e270b2d42?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover opacity-30 grayscale" alt="Seoul Map Base" />
                {getClusterData().map((dot, i) => (
                    <motion.div 
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg"
                        style={{ left: dot.x, top: dot.y, backgroundColor: dot.color }}
                    />
                ))}
                
                {/* Data Source & Purpose Overlays */}
                <div className="absolute bottom-6 right-8 text-[9px] font-black text-white/30 uppercase tracking-widest text-right">
                    Source: 서울시 공공데이터 광장<br/>
                    위치 정보 분석 엔진 v1.0
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center max-w-[60%]">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Location: {areaName} 중심 상권</p>
                    <p className="text-[9px] font-medium text-white/20 leading-tight">업종 간 시너지 및 경쟁 밀도 분석을 통한 최적 진입 시점 도출</p>
                </div>
            </div>
        );
    };

    const getPredictionImageUrl = () => {
        // Handle terms for API or static fallbacks
        const termMap = { 'current': '3yr', '1yr': '5yr', '3yr': '10yr', '6yr': '15yr' };
        const apiTerm = termMap[selectedTerm];
        return `${backendUrl}/assets/predictions/${encodeURIComponent(areaName)}_${apiTerm}.png`;
    };

    const handleImgError = (e: any) => {
        const fallbacks: Record<string, string> = {
            'current': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800',
            '1yr': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
            '3yr': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
            '6yr': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800'
        };
        e.target.src = fallbacks[selectedTerm];
    };

    // Dynamic Content for Prediction Results
    const getPredictionContent = () => {
        const content = {
            'current': { 
                comment: `"${areaName} 상권은 현재 감성 폭발형 성장 단계의 초입에 위치해 있습니다."`,
                index: 72,
                state: '진입 적기'
            },
            '1yr': {
                comment: "브랜드 간의 경쟁이 심화되며, 차별화된 디자인 DNA를 가진 매장들 위주로 상권이 재편됩니다.",
                index: 84,
                state: '성숙기 진입'
            },
            '3yr': {
                comment: "감성 소비가 한 차례 휩쓸고 간 뒤, 실질적인 맛과 서비스라는 본질이 더 중요해집니다.",
                index: 92,
                state: '뉴 패러다임 전환기'
            },
            '6yr': {
                comment: "상권의 주도권이 새로운 비즈니스 모델로 이동하며, 하이엔드 오피스와의 융합이 가속화됩니다.",
                index: 98,
                state: '미래 상업 지구'
            }
        };
        return content[selectedTerm];
    };
    
    const termDetails = getPredictionContent();
    const termLabelMapping = { 'current': '현재', '1yr': '1년 뒤', '3yr': '3년 뒤', '6yr': '6년 후' };
    
    if (status === 'loading') {
        return (
            <div className="flex h-screen items-center justify-center bg-stitch-dark-bg">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-16 h-16 border-4 border-stitch-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!report) return <div className="text-white p-20">데이터가 없습니다.</div>;

    return (
        <div className="bg-[#0A0C10] text-stitch-on-surface min-h-screen flex selection:bg-stitch-primary/10 font-body relative overflow-x-hidden">
            
            {/* [CRITICAL] 45-Degree Tilted Argyle Pattern Background Layer */}
            <div 
                className="fixed inset-0 pointer-events-none z-0 opacity-[0.12]"
                style={{
                    backgroundImage: `
                        linear-gradient(45deg, #1D2333 25%, transparent 25%, transparent 75%, #1D2333 75%, #1D2333),
                        linear-gradient(45deg, #1D2333 25%, transparent 25%, transparent 75%, #1D2333 75%, #1D2333)
                    `,
                    backgroundSize: '120px 120px',
                    backgroundPosition: '0 0, 60px 60px',
                    transform: 'rotate(45deg) scale(1.5)'
                }}
            ></div>

            {/* Sidebar Navigation - Updated to Toned-down Gray (#1A1C23) */}
            <aside className="fixed top-0 left-0 h-full w-64 bg-[#1A1C23] border-r border-white/5 z-[60] flex flex-col shadow-2xl">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-stitch-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-stitch-primary/20">
                        <span className="material-symbols-outlined text-2xl">insights</span>
                    </div>
                    <div>
                        <h2 className="font-st-headline font-extrabold text-white text-lg leading-tight">Insight Engine</h2>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none mt-1 font-black">전략 레이어</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {[
                        { id: 'persona', label: '개인 창업자 프로파일링', icon: 'person_search' },
                        { id: 'business_plan', label: '비즈니스 플랜 설정', icon: 'edit_document' },
                        { id: 'district_leaderboard', label: '상권 분석 리더보드', icon: 'dashboard' },
                        { id: 'district_report', label: '상권 정밀 분석 리포트', icon: 'analytics', active: true }
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

                <div className="p-6 border-t border-white/5 space-y-2">
                    <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/30 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        대시보드로 돌아가기
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 transition-all w-full relative z-10">
                <TopNavBar onLogoClick={onBack} offsetSidebar={true} />

                <main className="pt-28 pb-24 px-8 md:px-12 max-w-7xl mx-auto">
                    {/* [STEP 1] AI Score Section with Marble Frame */}
                    <div className="mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border-8 border-[#F5F5F0] rounded-[4rem] p-1 shadow-2xl relative overflow-hidden"
                        >
                            <div className="h-48 bg-[url('https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=1000')] bg-cover bg-center flex items-center px-16 relative">
                                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-12 h-12 bg-stitch-secondary rounded-xl flex items-center justify-center text-stitch-primary shadow-lg">
                                            <span className="material-symbols-outlined text-2xl font-black">verified</span>
                                        </div>
                                        <h1 className="text-4xl font-st-headline font-black text-white tracking-tight leading-none">{areaName} 상권 분석 결과 리포트</h1>
                                    </div>
                                    <p className="text-white/60 font-black text-[10px] uppercase tracking-[0.4em] ml-16">미래 상권 시뮬레이션 모델 v.1.0 (Location Intelligence)</p>
                                </div>
                            </div>

                            <div className="p-12 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                                <div className="bg-[#1A1A1A] rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 font-symbols">analytics</div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-stitch-secondary mb-8">Step 01. AI Score</div>
                                    <div className="text-7xl font-st-headline font-black mb-4 tracking-tighter">
                                        {report.final_score?.toFixed(1) ?? "0.0"}<span className="text-2xl text-stitch-secondary ml-1">pts</span>
                                    </div>
                                    <p className="text-sm font-medium text-white/50 leading-relaxed mb-8">매치 스코어 로직에 따른 최종 분석 점수입니다.</p>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${report.final_score ?? 0}%` }} className="h-full bg-stitch-secondary" />
                                    </div>
                                </div>
                                
                                <div className="space-y-8">
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-stitch-primary/40">Step 02. 상권 성장 경로 분석</div>
                                    <div className="relative pl-10 border-l-2 border-slate-200/50 space-y-12">
                                        <div className="relative">
                                            <div className="absolute -left-[51px] top-0 w-5 h-5 bg-stitch-secondary rounded-full border-4 border-white shadow-sm"></div>
                                            <h4 className="text-sm font-black text-stitch-primary mb-1">SNS 밀도 전이 분석</h4>
                                            <p className="text-xs font-medium text-stitch-on-surface-variant/60">지역 내 Viral 확산 임계점 도달 중</p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-[51px] top-0 w-5 h-5 bg-stitch-primary rounded-full border-4 border-white shadow-sm"></div>
                                            <h4 className="text-sm font-black text-stitch-primary mb-1">상권 이동 예측 지수</h4>
                                            <div className="text-lg font-black text-stitch-primary">{termDetails?.index ?? 72}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-[320px] group border-4 border-white bg-slate-900">
                                    <img 
                                        src={`https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800`} // Luxury cafe interior table perspective
                                        alt="Prototype" 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]" 
                                        style={{ objectPosition: 'center 45%' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                                        <div className="text-[9px] font-black text-stitch-secondary uppercase tracking-[0.2em] mb-2">Step 03. Design DNA</div>
                                        <h4 className="text-white font-st-headline font-black text-xl">{report.dna_result?.tone}</h4>
                                    </div>
                                    <div className="absolute bottom-4 right-4 text-[7px] font-black text-white/20 uppercase tracking-widest pointer-events-none">Source: 디자인 DNA 합성 알고리즘</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* AI Insights & Strategic Advice */}
                    <div className="mb-16">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-[#121212] p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-8">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="px-4 py-1 bg-stitch-secondary text-stitch-primary text-[10px] font-black uppercase tracking-widest rounded-full">AI Strategy Core</div>
                                    </div>
                                    <h3 className="text-4xl font-st-headline font-black mb-10 leading-tight">
                                        "{areaName} 상권은 현재 <span className="text-stitch-secondary">감성 폭발형</span> <br/>성장 단계의 초입에 위치해 있습니다."
                                    </h3>
                                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                                        <div className="text-[10px] font-black text-stitch-secondary uppercase tracking-widest mb-4">Strategic Advice</div>
                                        <p className="text-sm text-white/70 leading-relaxed font-bold italic">
                                            “{report.dna_result?.tone} 스타일의 브랜드 런칭 시 초기 6개월 내 Viral 도달 확률 {(report.success_prob * 100).toFixed(0)}%”
                                        </p>
                                    </div>
                                </div>
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="bg-[#1A1A1A] rounded-[2.5rem] p-8 border border-white/10">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-[11px] font-bold text-white/40 border-b border-white/5 pb-2"><span>임대료 급등 리스크</span><span className="text-green-400">낮음</span></div>
                                            <div className="flex justify-between items-center text-[11px] font-bold text-white/40 border-b border-white/5 pb-2"><span>임대료 가늠 지수</span><span className="text-white">{report.rent_10k}만</span></div>
                                            <div className="flex justify-between items-center text-[11px] font-bold text-white/40"><span>BEP 예상 소요시간</span><span className="text-stitch-secondary">{report.bep_period}</span></div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setShowStrategyPanel(!showStrategyPanel)}
                                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${showStrategyPanel ? 'bg-white/10 text-white border border-white/20' : 'bg-stitch-secondary text-stitch-primary shadow-stitch-secondary/10 hover:brightness-110'}`}
                                    >
                                        {showStrategyPanel ? '엔진 가동 중지' : '전략 엔진 실행'}
                                    </button>
                                </div>
                            </div>

                            {/* [NEW] Strategic Asset & Risk Modeling Section (Expandable) */}
                            {showStrategyPanel && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }} 
                                    animate={{ height: 'auto', opacity: 1 }} 
                                    className="mt-12 pt-12 border-t border-white/10 overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="flex gap-4">
                                            {[
                                                { id: 'asset', label: '전략 자산 분석' },
                                                { id: 'risk', label: '리스크 모델링' }
                                            ].map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveStrategyTab(tab.id as any)}
                                                    className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeStrategyTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-white/30 hover:text-white'}`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">DB Connection: Active (v2.1)</div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                        <div className="lg:col-span-4">
                                            <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                                                <h4 className="text-stitch-secondary font-black text-xs uppercase tracking-widest mb-6">
                                                    {activeStrategyTab === 'asset' ? 'Asset Scorecard' : 'Risk Assessment'}
                                                </h4>
                                                <div className="space-y-6">
                                                    {activeStrategyTab === 'asset' ? (
                                                        <>
                                                            <div className="flex justify-between items-end"><span className="text-[10px] text-white/40 font-bold">상권 종합 순위</span><span className="text-2xl font-black text-white">Top 2.4%</span></div>
                                                            <div className="flex justify-between items-end"><span className="text-[10px] text-white/40 font-bold">월간 성장률</span><span className="text-2xl font-black text-white">+14.2%</span></div>
                                                            <div className="flex justify-between items-end"><span className="text-[10px] text-white/40 font-bold">업종 시너지 지수</span><span className="text-2xl font-black text-stitch-secondary">92/100</span></div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="flex justify-between items-end"><span className="text-[10px] text-white/40 font-bold">시장 포화도</span><span className="text-2xl font-black text-white">Moderate</span></div>
                                                            <div className="flex justify-between items-end"><span className="text-[10px] text-white/40 font-bold">경쟁 압착 지수</span><span className="text-2xl font-black text-white">Low</span></div>
                                                            <div className="flex justify-between items-end"><span className="text-[10px] text-white/40 font-bold">매출 변동성</span><span className="text-2xl font-black text-red-400">Stable</span></div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="lg:col-span-8 bg-black/40 rounded-[2.5rem] p-10 border border-white/5 relative">
                                            <div className="absolute top-6 right-8 flex gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                                <span className="text-[8px] font-black text-green-400/50 uppercase tracking-widest">Live Data Stream</span>
                                            </div>
                                            <h4 className="text-white font-st-headline font-black text-xl mb-6">
                                                {activeStrategyTab === 'asset' ? 'Core Strategic Assets Summary' : 'Advanced Risk Modeling Insights'}
                                            </h4>
                                            <p className="text-sm text-white/50 leading-relaxed font-medium mb-8">
                                                {activeStrategyTab === 'asset' 
                                                    ? `DB 분석 결과, ${areaName} 상권은 2030 여성층의 목적성 방문이 68%를 차지하는 '전략적 우위 자산'을 보유하고 있습니다. 이는 배후 주거지의 높은 가처분 소득과 결합되어 강력한 객단가 형성 동력으로 작용합니다.`
                                                    : `현재 임대료 상승률 대비 유동인구 증가 속도가 1.2배 상회하고 있어, 단기 젠트리피케이션 리스크는 낮으나 경쟁 업체의 공격적 마케팅 비용 증가에 대한 모델링 결과 주의가 필요합니다.`
                                                }
                                            </p>
                                            <div className="flex gap-4">
                                                <div className="px-5 py-2 bg-white/5 rounded-full text-[9px] font-black text-white/40 border border-white/10 uppercase tracking-widest">Real-time DB Sync</div>
                                                <div className="px-5 py-2 bg-white/5 rounded-full text-[9px] font-black text-white/40 border border-white/10 uppercase tracking-widest">Algorithm V3.1</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>

                    {/* Future Prediction Section */}
                    <div className="mb-16">
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl p-12 overflow-hidden">
                            <div className="flex justify-between items-center mb-12">
                                <h3 className="text-3xl font-st-headline font-black text-stitch-primary">미래 상권 가치 예측</h3>
                                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                                    {(['current', '1yr', '3yr', '6yr'] as const).map(term => (
                                        <button key={term} onClick={() => setSelectedTerm(term)} className={`px-6 py-2.5 rounded-xl text-xs transition-all ${selectedTerm === term ? 'bg-white shadow-sm text-stitch-primary font-black' : 'text-slate-400 font-bold hover:text-stitch-primary'}`}>{termLabelMapping[term]}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="relative rounded-[2.5rem] overflow-hidden h-[360px] border-8 border-slate-50 shadow-inner group bg-slate-900">
                                    <img 
                                        src={getPredictionImageUrl()} 
                                        onError={handleImgError} 
                                        className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" 
                                        alt="Prediction" 
                                        style={{ objectPosition: 'center 40%' }}
                                    />
                                    <div className="absolute bottom-4 right-4 text-[7px] font-black text-white/20 uppercase tracking-widest pointer-events-none">Source: 미래 시나리오 시뮬레이션 알고리즘</div>
                                </div>
                                <div className="space-y-6">
                                    <p className="text-2xl font-black text-stitch-primary font-st-headline leading-tight">{termDetails.comment}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-slate-50 rounded-3xl">
                                            <div className="text-[9px] font-black text-slate-400 uppercase mb-2">상권 이동 활성도</div>
                                            <div className="text-3xl font-black text-stitch-primary">{termDetails.index}/100</div>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-3xl">
                                            <div className="text-[9px] font-black text-slate-400 uppercase mb-2">예상 상태</div>
                                            <div className="text-xl font-black text-stitch-secondary">{termDetails.state}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* AI Clustering Map Section (Updated to Static) */}
                    <div className="mb-16">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0F1115] rounded-[3.5rem] border border-white/5 shadow-3xl p-12 relative overflow-hidden">
                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-4">
                                    <h3 className="text-2xl font-st-headline font-black text-white mb-6">AI 업종 밀집도 (어디에 모여있나?)</h3>
                                    <p className="text-sm text-white/50 leading-relaxed font-medium mb-10">서울 전역의 업종별 모임(클러스터)이 시간에 따라 어떻게 이동하는지 AI가 분석한 지도입니다.</p>
                                    <div className="space-y-4">
                                        { [
                                            { label: 'F&B (식음료/카페)', color: 'bg-[#FF7043]' },
                                            { label: '패션/리테일', color: 'bg-[#4DB6AC]' },
                                            { label: '문화/예술', color: 'bg-[#7E57C2]' },
                                            { label: '서비스/테크', color: 'bg-[#42A5F5]' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3"><div className={`w-3 h-3 rounded-full ${item.color}`}></div><span className="text-[11px] font-black text-white/60">{item.label}</span></div>
                                        )) }
                                    </div>

                                    {/* [NEW] Clustering Brief Report */}
                                    <div className="mt-12 p-7 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                                        <h4 className="text-[10px] font-black text-stitch-secondary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-stitch-secondary animate-pulse"></span>
                                            지리 정보 분석 요약
                                        </h4>
                                        <div className="space-y-4">
                                            <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                                                현재 <span className="text-white font-bold">{areaName}</span> 상권은 음식점과 카페가 한곳에 집중적으로 모인 <strong className="text-white">‘상권 성숙기’</strong> 단계입니다.
                                            </p>
                                            <div className="pt-4 border-t border-white/10">
                                                <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                                                    AI 예측 결과, 앞으로 3년 내에 패션/쇼핑 업종이 <span className="text-stitch-secondary font-black">1.5배 더 많이</span> 들어오게 되며, 6년 뒤에는 회사와 상점이 섞인 <strong className="text-stitch-secondary">‘대형 복합 상권’</strong>으로 변할 것으로 보입니다.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* [NEW] Intuitive Clustering Guide (Legend Bottom) */}
                                    <div className="mt-6 p-6 bg-stitch-secondary/5 rounded-2xl border border-stitch-secondary/20">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-stitch-secondary text-sm">lightbulb</span>
                                            <span className="text-[11px] font-black text-stitch-secondary uppercase tracking-widest">데이터 인사이트</span>
                                        </div>
                                        <p className="text-[11px] text-white/70 leading-relaxed font-bold mb-3">
                                            💡 점의 의미: 지도 위의 점은 특정 업종이 모인 구역(클러스터)입니다. 
                                        </p>
                                        <div className="p-4 bg-black/30 rounded-xl space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-white/40 font-medium">현재 {areaName} 비중</span>
                                                <span className="text-[10px] text-white font-black">복합 상권 (Top 5%)</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-white/40 font-medium">음식점(주황) : 패션(민트)</span>
                                                <span className="text-[10px] text-stitch-secondary font-black">6.4 : 3.6</span>
                                            </div>
                                            <p className="text-[9px] text-white/30 pt-1 leading-tight font-medium">
                                                * {areaName}은 현재 가장 활발한 복합 상권으로, 업종 간 시너지가 발생하는 지점에 위치해 있습니다.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-8 aspect-video bg-black/40 rounded-[3rem] relative overflow-hidden border border-white/5">
                                    <img src={seoulMapImg} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Map" />
                                    
                                    {/* Map-specific Year Tabs (Top-Right) */}
                                    <div className="absolute top-6 right-6 z-50 flex bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-2xl">
                                        {(['current', '1yr', '3yr', '6yr'] as const).map(term => (
                                            <button 
                                                key={term} 
                                                onClick={() => setMapTerm(term)} 
                                                className={`px-4 py-1.5 rounded-lg text-[10px] transition-all font-black uppercase tracking-widest ${mapTerm === term ? 'bg-stitch-secondary text-stitch-primary shadow-lg shadow-stitch-secondary/20' : 'text-white/40 hover:text-white'}`}
                                            >
                                                {termLabelMapping[term]}
                                            </button>
                                        ))}
                                    </div>

                                    <StaticClusteringMap />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-stitch-secondary rounded-full animate-pulse shadow-2xl border-2 border-white"></div>
                                    <div className="absolute bottom-4 right-4 text-[7px] font-black text-white/10 uppercase tracking-widest pointer-events-none z-50">Source: 서울 상권 분석 / 업종 군집 분석 엔진</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-xl">
                            <h4 className="text-2xl font-st-headline font-black text-stitch-primary mb-8 flex items-center gap-3"><span className="material-symbols-outlined text-stitch-secondary">verified</span>긍정적 지표</h4>
                            <div className="space-y-6">
                                <p className="text-sm font-medium text-slate-600 border-l-4 border-stitch-secondary pl-6 py-1">MZ세대 유동인구가 전년 동기 대비 24% 증가하여 상권의 활력이 매우 높음</p>
                                <p className="text-sm font-medium text-slate-600 border-l-4 border-stitch-secondary pl-6 py-1">인접한 하이엔드 오피스 클러스터 형성으로 평일/주말 평균 매출 격차가 감소</p>
                                <p className="text-sm font-medium text-slate-600 border-l-4 border-stitch-secondary pl-6 py-1">SNS 기반 '핫플레이스' 인증 빈도가 기하급수적으로 늘며 브랜드 바이럴 효율 극대화</p>
                            </div>
                        </div>
                        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-xl">
                            <h4 className="text-2xl font-st-headline font-black text-stitch-primary mb-8 flex items-center gap-3"><span className="material-symbols-outlined text-red-500">warning</span>리스크 요인</h4>
                            <div className="space-y-6">
                                <p className="text-sm font-medium text-slate-600 border-l-4 border-red-400 pl-6 py-1">상권 인기에 따른 임대료 급상승(젠트리피케이션)으로 인해 초기 수익 확보에 어려움이 있을 수 있음</p>
                                <p className="text-sm font-medium text-slate-600 border-l-4 border-red-400 pl-6 py-1">유사 컨셉의 경쟁 업체 밀집도가 높아지며 '테마의 희소성' 유지가 과제</p>
                                <p className="text-sm font-medium text-slate-600 border-l-4 border-red-400 pl-6 py-1">주말 특정 시간대 주차 및 보행 접근성 저하로 인한 고객 불만 가능성 존재</p>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="w-full py-12 px-10 border-t border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-white/20 relative z-10">
                    <div>The Sovereign Insight 전략 분석 프레임워크</div>
                    <button onClick={onBack} className="hover:text-white transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">logout</span> 대시보드로 돌아가기
                    </button>
                </footer>
            </div>
        </div>
    );
};
