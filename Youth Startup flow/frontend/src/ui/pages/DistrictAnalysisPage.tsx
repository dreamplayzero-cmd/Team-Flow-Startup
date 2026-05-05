import React from 'react';
import { motion } from 'framer-motion';
import seoulMap from '../../assets/seoul_map.png';
import { TopNavBar } from '../components/TopNavBar';
import { useAppDispatch, useAppSelector } from '../../store';
import { setView } from '../../store/slices/navigationSlice';
import { updateFormData, startAnalysis } from '../../store/slices/analysisSlice';

interface DistrictAnalysisPageProps {
    onBack: () => void;
    onNext: () => void;
}

interface District {
    id: string;
    name: string;
    top: string;
    left: string;
    isHot?: boolean;
    selected?: boolean;
}

const initialDistricts: District[] = [
    { id: 'hannam', name: '한남동', top: '35%', left: '45%' },
    { id: 'itaewon', name: '이태원', top: '38%', left: '42%' },
    { id: 'seongsu', name: '성수동', top: '32%', left: '55%', isHot: true },
    { id: 'yeonnam', name: '연남동', top: '28%', left: '30%' },
    { id: 'mangwon', name: '망원동', top: '31%', left: '26%' },
    { id: 'garosu', name: '가로수길', top: '52%', left: '48%', isHot: true },
    { id: 'sharo', name: '샤로수길', top: '68%', left: '40%' }
];

export const DistrictAnalysisPage: React.FC<DistrictAnalysisPageProps> = ({ onBack, onNext }) => {
    const dispatch = useAppDispatch();
    const { formData, status } = useAppSelector(state => state.analysis);
    const selectedAreas = formData.areas;

    const toggleDistrict = (name: string) => {
        if (selectedAreas.includes(name)) {
            dispatch(updateFormData({ areas: selectedAreas.filter(a => a !== name) }));
        } else {
            if (selectedAreas.length >= 4) {
                alert('최대 4개의 상권만 선택할 수 있습니다.');
                return;
            }
            dispatch(updateFormData({ areas: [...selectedAreas, name] }));
        }
    };

    const handleStartAnalysis = async () => {
        if (selectedAreas.length === 0) {
            alert('최소 1개 이상의 상권을 선택해주세요.');
            return;
        }
        await dispatch(startAnalysis(formData));
        onNext();
    };

    const selectedCount = selectedAreas.length;
    const districts = initialDistricts.map(d => ({
        ...d,
        selected: selectedAreas.includes(d.name)
    }));

    return (
        <div className="bg-stitch-background text-stitch-on-surface h-screen flex flex-col font-body overflow-hidden">
            {/* TopNavBar */}
            <TopNavBar onLogoClick={onBack} offsetSidebar={true} />

            <div className="flex flex-1 pt-16 relative overflow-hidden">
                {/* Sidebar Navigation */}
                <aside className="bg-stitch-surface-container-low h-full w-64 fixed left-0 top-16 z-40 flex flex-col p-4 gap-2 border-r border-stitch-outline-variant/10">
                    <div className="px-2 py-6 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-stitch-primary flex items-center justify-center text-white shadow-lg shadow-stitch-primary/20">
                                <span className="material-symbols-outlined text-xl">insights</span>
                            </div>
                            <div>
                                <h2 className="font-st-headline font-extrabold text-stitch-primary text-sm leading-tight">인사이트 엔진</h2>
                                <p className="text-[10px] font-bold text-stitch-on-surface-variant/60 uppercase tracking-widest leading-none mt-1 font-black">전략 레이어</p>
                            </div>
                        </div>
                    </div>
                    <nav className="space-y-1">
                        <button
                            onClick={() => dispatch(setView('persona'))}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-stitch-on-surface-variant/70 hover:bg-white/60 rounded-xl transition-all hover:translate-x-1 group"
                        >
                            <span className="material-symbols-outlined text-xl group-hover:text-stitch-primary">person_search</span>
                            <span className="text-[13px] font-bold">개인 창업자 프로파일링</span>
                        </button>
                        <button
                            onClick={() => dispatch(setView('business_plan'))}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-stitch-on-surface-variant/70 hover:bg-white/60 rounded-xl transition-all hover:translate-x-1 group"
                        >
                            <span className="material-symbols-outlined text-xl group-hover:text-stitch-primary">description</span>
                            <span className="text-[13px] font-bold">비즈니스 플랜 설정</span>
                        </button>
                        <button
                            onClick={() => dispatch(setView('district_leaderboard'))}
                            className="w-full flex items-center gap-3 px-3 py-2.5 bg-white text-stitch-primary font-black rounded-xl shadow-sm border border-stitch-outline-variant/5"
                        >
                            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                            <span className="text-[13px]">상권 분석 리더보드</span>
                        </button>
                        <button
                            onClick={() => dispatch(setView('district_report'))}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-stitch-on-surface-variant/70 hover:bg-white/60 rounded-xl transition-all hover:translate-x-1 group"
                        >
                            <span className="material-symbols-outlined text-xl group-hover:text-stitch-primary">analytics</span>
                            <span className="text-[13px] font-bold">상권 정밀 분석 리포트</span>
                        </button>
                    </nav>
                    <div className="mt-auto p-2 space-y-2">
                        <button
                            onClick={onBack}
                            className="w-full py-2.5 px-3 flex items-center justify-center gap-2 text-stitch-on-surface-variant hover:text-stitch-primary font-bold text-xs transition-all"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            대시보드로 돌아가기
                        </button>
                        <button className="w-full py-4 bg-stitch-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-stitch-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                            분석 내보내기
                            <span className="material-symbols-outlined text-lg">download</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area: Map */}
                <main className="ml-64 flex-1 relative bg-stitch-surface-container overflow-hidden">
                    {/* Full Screen Simulated Map */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={seoulMap}
                            alt="Map of Seoul"
                            className="w-full h-full object-cover opacity-70 grayscale-[0.3]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-stitch-primary/10 to-transparent pointer-events-none"></div>

                        {/* Custom Map Markers */}
                        {districts.map((d) => (
                            <div
                                key={d.id}
                                className="absolute transition-all duration-500 cursor-pointer group"
                                style={{ top: d.top, left: d.left }}
                                onClick={() => toggleDistrict(d.name)}
                            >
                                <div className="relative flex flex-col items-center">
                                    <div className={`relative w-4 h-4 rounded-full border-2 border-white shadow-xl transition-all duration-300 ${d.selected ? (d.isHot ? 'bg-stitch-secondary' : 'bg-stitch-primary') : 'bg-stitch-outline-variant/60 group-hover:bg-stitch-primary/60'}`}>
                                        {d.isHot && (
                                            <div className="absolute inset-0 rounded-full animate-ping bg-stitch-secondary opacity-40"></div>
                                        )}
                                        {d.selected && (
                                            <div className="absolute -inset-2 rounded-full border-2 border-white/40 animate-pulse"></div>
                                        )}
                                    </div>
                                    <div className={`mt-2 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-2xl text-[10px] font-black border transition-all ${d.selected ? 'bg-stitch-primary text-white border-stitch-primary' : 'bg-white/90 text-stitch-on-surface border-stitch-outline-variant/30'}`}>
                                        {d.name}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selection Panel (Right) */}
                    <div className="absolute top-8 right-8 w-80 max-h-[calc(100%-64px)] z-10 flex flex-col gap-6">
                        {/* Main Controls Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/90 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-2xl border border-white/60 flex flex-col"
                        >
                            <div className="mb-8">
                                <h1 className="text-2xl font-black text-stitch-primary tracking-tight font-st-headline">목표 상권 선택</h1>
                                <p className="text-[11px] text-stitch-on-surface-variant mt-2 font-bold leading-relaxed opacity-60 uppercase tracking-tight">최대 4개의 상권을 선택하여 분석하세요</p>
                            </div>

                            {/* District Selection List */}
                            <div className="space-y-2 overflow-y-auto max-h-[300px] pr-2 mb-8 no-scrollbar">
                                {districts.map((d) => (
                                    <label
                                        key={d.id}
                                        className={`group flex items-center justify-between p-4 rounded-[1.25rem] transition-all cursor-pointer border-2 ${d.selected ? (d.isHot ? 'bg-stitch-secondary/5 border-stitch-secondary/20' : 'bg-stitch-primary/5 border-stitch-primary/20') : 'bg-stitch-surface-container-low hover:bg-stitch-surface-container border-transparent'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`material-symbols-outlined text-xl ${d.selected ? (d.isHot ? 'text-stitch-secondary' : 'text-stitch-primary') : 'text-stitch-outline-variant'}`}>
                                                {d.isHot ? 'bolt' : 'location_on'}
                                            </span>
                                            <span className={`font-black text-sm ${d.selected ? 'text-stitch-primary' : 'text-stitch-on-surface-variant'}`}>{d.name}</span>
                                        </div>
                                        <div className="relative w-6 h-6 flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={d.selected}
                                                onChange={() => toggleDistrict(d.name)}
                                                className="hidden peer"
                                            />
                                            <div className={`w-5 h-5 border-2 rounded-lg transition-all ${d.selected ? (d.isHot ? 'bg-stitch-secondary border-stitch-secondary shadow-md shadow-stitch-secondary/30' : 'bg-stitch-primary border-stitch-primary shadow-md shadow-stitch-primary/30') : 'border-stitch-outline-variant/40'}`}></div>
                                            <span className="material-symbols-outlined text-[14px] text-white absolute opacity-0 peer-checked:opacity-100 font-black">check</span>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {/* Footer Action */}
                            <div className="space-y-6 pt-4 border-t border-stitch-outline-variant/10">
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-stitch-primary">선택된 상권</span>
                                    <span className="text-stitch-primary/40">시장 GIS 인텔리전스</span>
                                    <span className="bg-stitch-primary text-white text-[10px] font-black px-2.5 py-1 rounded-full">{selectedCount}/4</span>
                                </div>
                                <button
                                    onClick={handleStartAnalysis}
                                    disabled={status === 'loading'}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-br from-stitch-primary to-stitch-primary-container text-white font-black text-sm tracking-wide shadow-2xl shadow-stitch-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    <span>{status === 'loading' ? '분석 중...' : '상권 정밀 분석 시작'}</span>
                                    <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">analytics</span>
                                </button>
                                <button
                                    onClick={() => dispatch(updateFormData({ areas: [] }))}
                                    className="w-full text-[10px] uppercase font-black text-stitch-on-surface-variant/40 hover:text-stitch-primary transition-colors tracking-[0.2em]"
                                >
                                    전체 선택 해제
                                </button>
                            </div>
                        </motion.div>

                        {/* Floating Summary Cards (Bento Style) */}
                        <div className="grid grid-cols-2 gap-3">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-stitch-secondary-container/40 backdrop-blur-xl p-6 rounded-[2rem] border border-stitch-secondary/10 col-span-2 shadow-xl"
                            >
                                <h3 className="font-st-headline font-black text-3xl text-stitch-primary">데이터 필터링</h3>
                                <p className="text-[10px] font-black text-stitch-on-surface-variant/40 uppercase tracking-[0.2em] mt-2">정밀 제어 인터페이스</p>
                                <div className="flex items-center justify-between mt-4">
                                    <div>
                                        <div className="text-[9px] font-black text-stitch-secondary uppercase tracking-[0.2em] mb-1">Trending Now</div>
                                        <div className="text-lg font-black text-stitch-primary leading-tight font-st-headline">성수동 핫플레이스</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-stitch-secondary/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-stitch-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-stitch-outline-variant/20 shadow-lg"
                            >
                                <div className="text-[9px] font-black text-stitch-primary/40 uppercase tracking-widest mb-2">분석 엔진 활성 상태</div>
                                <span className="text-[10px] bg-white text-stitch-primary px-3 py-1 rounded-full font-black tracking-widest">LIVE DATA</span>
                                <div className="text-xl font-black text-stitch-primary font-st-headline mt-2">₩4.2M</div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-stitch-outline-variant/20 shadow-lg"
                            >
                                <div className="text-[9px] font-black text-stitch-secondary uppercase tracking-widest mb-2">Growth</div>
                                <div className="text-xl font-black text-stitch-secondary font-st-headline">+12.4%</div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Map UI Elements */}
                    <div className="absolute bottom-8 left-8 flex gap-4 z-10 scale-110">
                        <div className="flex flex-col bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-white/60 overflow-hidden">
                            <button className="p-3 border-b border-stitch-outline-variant/10 hover:bg-stitch-surface-container transition-all">
                                <span className="material-symbols-outlined">add</span>
                            </button>
                            <button className="p-3 hover:bg-stitch-surface-container transition-all">
                                <span className="material-symbols-outlined">remove</span>
                            </button>
                        </div>
                        <button className="bg-white/90 backdrop-blur-xl p-3.5 rounded-full shadow-2xl border border-white/60 hover:bg-stitch-surface-container transition-all flex items-center justify-center">
                            <span className="material-symbols-outlined text-stitch-primary" style={{ fontVariationSettings: "'FILL' 1" }}>my_location</span>
                        </button>
                    </div>

                    {/* Legend & Map Info Overlay */}
                    <div className="absolute bottom-10 right-[370px] flex flex-col items-end gap-4 z-10">
                        {/* Map Explanation */}
                        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 max-w-xs">
                            <p className="text-[10px] text-white/70 font-medium leading-relaxed">
                                <span className="text-stitch-secondary font-black">AI GIS 인텔리전스:</span> 서울 전역의 실시간 유동인구 및 SNS 트렌드를 분석하여 고성장 가능성이 높은 상권을 추출한 지도입니다.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Map Scale */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-1">
                                    <div className="w-10 h-[2px] bg-white"></div>
                                    <span className="text-[8px] font-black text-white uppercase tracking-tighter">1KM</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="bg-stitch-primary/95 backdrop-blur-2xl px-6 py-3 rounded-full text-white text-[10px] font-black flex items-center gap-6 shadow-2xl border border-white/10 uppercase tracking-widest">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-stitch-secondary shadow-[0_0_8px_rgba(78,222,163,0.6)]"></div>
                                    <span>고성장 지역</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2.5 h-2.5 rounded-full border border-white/40"></div>
                                    <span>일반 상권</span>
                                </div>
                                <div className="w-[1px] h-4 bg-white/20"></div>
                                <div className="flex items-center gap-2 cursor-pointer hover:text-stitch-secondary transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">layers</span>
                                    <span>2D 뷰</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
