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
    const [selectedTerm, setSelectedTerm] = useState<'3yr' | '5yr' | '10yr'>('3yr');
    const [mapTerm, setMapTerm] = useState<'3yr' | '5yr' | '10yr'>('3yr');
    
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
        
        // Define common categories in the filenames to attempt a match
        const categories = ['Cafe', 'Dining', 'EditShop', 'Retail', 'PhotoStudio'];
        const areaNameEng = areaKey === 'SS' ? 'Seongsu' : 'Hannam';
        const toneNameNoSpace = report.dna_result?.tone?.replace(' ', '') || '';

        // Try to match standard "01" version first
        for (const cat of categories) {
            const fileName = `${areaKey}_${toneKey}_01_${areaNameEng}_${cat}_${toneNameNoSpace}.jpg`;
            // Note: Since we are in browser-side React, we often use string paths or imported assets.
            // For now, let's provide a more robust construction.
            // If the category logic is complex, we use the most common "Cafe" or "Dining" match.
        }
        
        // Fallback to a hardcoded mapping that matches the file list for Seongsu/Hannam
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

    const localDnaImg = getLocalDnaImage();
    const backendUrl = "http://localhost:8000";
    
    // AI Clustering Animation Logic
    const ClusterDots = () => {
        // Balanced expansion for natural movement within map bounds
        const exp = mapTerm === '10yr' ? 2.3 : (mapTerm === '5yr' ? 1.5 : 1.0);
        
        const industries = [
            { name: 'F&B (식음료/카페)', color: '#FF7E5F', start: { x: '45%', y: '55%' }, end: { x: `${45 + (5 * exp)}%`, y: `${55 - (4 * exp)}%` } },
            { name: '패션/리테일', color: '#10B981', start: { x: '52%', y: '48%' }, end: { x: `${52 + (6 * exp)}%`, y: `${48 + (2 * exp)}%` } },
            { name: '문화/예술', color: '#8B5CF6', start: { x: '42%', y: '45%' }, end: { x: `${42 - (7 * exp)}%`, y: `${45 - (5 * exp)}%` } },
            { name: '서비스/테크', color: '#3B82F6', start: { x: '48%', y: '42%' }, end: { x: `${48 - (3 * exp)}%`, y: `${42 - (6 * exp)}%` } },
        ];

        return (
            <div className="absolute inset-0 z-40 overflow-hidden pointer-events-none">
                {industries.map((ind, i) => (
                    <div key={i}>
                        {[...Array(6)].map((_, j) => (
                            <div
                                key={j}
                                className="absolute rounded-full border border-white/20 transition-all duration-700 ease-out"
                                style={{ 
                                    backgroundColor: ind.color, 
                                    width: 14, 
                                    height: 14,
                                    boxShadow: `0 0 20px ${ind.color}`,
                                    left: ind.end.x,
                                    top: ind.end.y,
                                    marginLeft: `${(j-2)*18}px`,
                                    marginTop: `${(j-3)*12}px`,
                                    opacity: 0.8
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    const getPredictionImageUrl = () => {
        // Primary: Local check logic
        const localPath = `${backendUrl}/assets/predictions/${encodeURIComponent(areaName)}_${selectedTerm}.png`;
        return localPath;
    };

    const handleImgError = (e: any) => {
        const fallbacks: Record<string, string> = {
            '3yr': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800',
            '5yr': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
            '10yr': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800'
        };
        e.target.src = fallbacks[selectedTerm] || fallbacks['3yr'];
    };
    
    const activePrediction = report?.future_prediction ? report.future_prediction[`prediction_${selectedTerm}`] : null;
    const termLabelMapping = { '3yr': '3년', '5yr': '5년', '10yr': '10년' };
    
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
                                    <p className="text-white/60 font-black text-[10px] uppercase tracking-[0.4em] ml-16">GIS Future Prediction Model v.1.0 (GIS 1st Gen)</p>
                                </div>
                            </div>

                            <div className="p-12 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                                <div className="bg-[#1A1A1A] rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 font-symbols">analytics</div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-stitch-secondary mb-8">Step 01. AI Score</div>
                                    <div className="text-7xl font-st-headline font-black mb-4 tracking-tighter">
                                        {report.final_score.toFixed(1)}<span className="text-2xl text-stitch-secondary ml-1">pts</span>
                                    </div>
                                    <p className="text-sm font-medium text-white/50 leading-relaxed mb-8">매치 스코어 로직에 따른 최종 분석 점수입니다.</p>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${report.final_score}%` }} className="h-full bg-stitch-secondary" />
                                    </div>
                                </div>
                                
                                <div className="space-y-8">
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-stitch-primary/40">Step 02. GIS Growth Path</div>
                                    <div className="relative pl-10 border-l-2 border-slate-200/50 space-y-12">
                                        <div className="relative">
                                            <div className="absolute -left-[51px] top-0 w-5 h-5 bg-stitch-secondary rounded-full border-4 border-white shadow-sm"></div>
                                            <h4 className="text-sm font-black text-stitch-primary mb-1">SNS 밀도 전이 분석</h4>
                                            <p className="text-xs font-medium text-stitch-on-surface-variant/60">지역 내 Viral 확산 임계점 도달 중</p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-[51px] top-0 w-5 h-5 bg-stitch-primary rounded-full border-4 border-white shadow-sm"></div>
                                            <h4 className="text-sm font-black text-stitch-primary mb-1">상권 이동 예측 지수</h4>
                                            <div className="text-lg font-black text-stitch-primary">{activePrediction?.gent_index ?? 72}</div>
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
                                            <div className="flex justify-between items-center text-[11px] font-bold text-white/40 border-b border-white/5 pb-2"><span>젠트리피케이션 리스크</span><span className="text-green-400">LOW</span></div>
                                            <div className="flex justify-between items-center text-[11px] font-bold text-white/40 border-b border-white/5 pb-2"><span>임대료 가늠 지수</span><span className="text-white">{report.rent_10k}만</span></div>
                                            <div className="flex justify-between items-center text-[11px] font-bold text-white/40"><span>BEP 예상 소요시간</span><span className="text-stitch-secondary">{report.bep_period}</span></div>
                                        </div>
                                    </div>
                                    <button className="w-full py-4 bg-stitch-secondary text-stitch-primary rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-stitch-secondary/10 hover:brightness-110 transition-all">전략 엔진 실행</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Future Prediction Section */}
                    <div className="mb-16">
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl p-12 overflow-hidden">
                            <div className="flex justify-between items-center mb-12">
                                <h3 className="text-3xl font-st-headline font-black text-stitch-primary">미래 상권 가치 예측</h3>
                                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                                    {(['3yr', '5yr', '10yr'] as const).map(term => (
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
                                </div>
                                <div className="space-y-6">
                                    <p className="text-2xl font-black text-stitch-primary font-st-headline leading-tight">{activePrediction?.comment}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-slate-50 rounded-3xl">
                                            <div className="text-[9px] font-black text-slate-400 uppercase mb-2">상권 이동 활성도</div>
                                            <div className="text-3xl font-black text-stitch-primary">{activePrediction?.gent_index}/100</div>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-3xl">
                                            <div className="text-[9px] font-black text-slate-400 uppercase mb-2">예상 상태</div>
                                            <div className="text-xl font-black text-stitch-secondary">{activePrediction?.state}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* AI Clustering Map Section (Restored) */}
                    <div className="mb-16">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0F1115] rounded-[3.5rem] border border-white/5 shadow-3xl p-12 relative overflow-hidden">
                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-4">
                                    <h3 className="text-2xl font-st-headline font-black text-white mb-6">AI 밀집도 분포도</h3>
                                    <p className="text-sm text-white/50 leading-relaxed font-medium mb-10">서울 전역 4대 업종 클러스터의 시계열 전이 방향을 AI 모델이 시뮬레이션합니다.</p>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'F&B (식음료/카페)', color: 'bg-[#FF7043]' },
                                            { label: '패션/리테일', color: 'bg-[#4DB6AC]' },
                                            { label: '문화/예술', color: 'bg-[#7E57C2]' },
                                            { label: '서비스/테크', color: 'bg-[#42A5F5]' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3"><div className={`w-3 h-3 rounded-full ${item.color}`}></div><span className="text-[11px] font-black text-white/60">{item.label}</span></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="lg:col-span-8 aspect-video bg-black/40 rounded-[3rem] relative overflow-hidden border border-white/5">
                                    <img src={seoulMapImg} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Map" />
                                    
                                    {/* Map-specific Year Tabs (Top-Right) */}
                                    <div className="absolute top-6 right-6 z-50 flex bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-2xl">
                                        {(['3yr', '5yr', '10yr'] as const).map(term => (
                                            <button 
                                                key={term} 
                                                onClick={() => setMapTerm(term)} 
                                                className={`px-4 py-1.5 rounded-lg text-[10px] transition-all font-black uppercase tracking-widest ${mapTerm === term ? 'bg-stitch-secondary text-stitch-primary shadow-lg shadow-stitch-secondary/20' : 'text-white/40 hover:text-white'}`}
                                            >
                                                {term === '3yr' ? '3Y' : (term === '5yr' ? '5Y' : '10Y')}
                                            </button>
                                        ))}
                                    </div>

                                    <ClusterDots />
                                    <motion.div animate={{ left: mapTerm === '3yr' ? '40%' : '50%', top: mapTerm === '3yr' ? '30%' : '40%' }} className="absolute w-24 h-24 bg-[#FF7043]/30 blur-3xl rounded-full" />
                                    <motion.div animate={{ left: mapTerm === '3yr' ? '60%' : '50%', top: mapTerm === '3yr' ? '50%' : '60%' }} className="absolute w-24 h-24 bg-[#4DB6AC]/30 blur-3xl rounded-full" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-stitch-secondary rounded-full animate-pulse shadow-2xl border-2 border-white"></div>
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
                                <p className="text-sm font-medium text-slate-600 border-l-4 border-red-400 pl-6 py-1">상권 유명세에 따른 임대료 상승률(Gentrification)이 가팔라 단기 순익성 위협</p>
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
