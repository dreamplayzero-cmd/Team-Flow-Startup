import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TopNavBar } from '../components/TopNavBar';

import { useAppDispatch, useAppSelector } from '../../store';
import { setView } from '../../store/slices/navigationSlice';
import { updateFormData } from '../../store/slices/analysisSlice';

interface BusinessPlanPageProps {
    onBack: () => void;
    onNext: () => void;
}

export const BusinessPlanPage: React.FC<BusinessPlanPageProps> = ({ onBack, onNext }) => {
    const dispatch = useAppDispatch();
    const { industry, target, op_type, op_time } = useAppSelector(state => state.analysis.formData);

    const handleIndustryChange = (val: string) => {
        dispatch(updateFormData({ industry: val }));
    };

    const handleTargetChange = (val: string) => {
        dispatch(updateFormData({ target: val }));
    };

    const handleOpTypeChange = (val: string) => {
        dispatch(updateFormData({ op_type: val }));
    };

    const handleOpTimeChange = (val: string) => {
        dispatch(updateFormData({ op_time: val }));
    };

    return (
        <div className="bg-stitch-background text-stitch-on-surface min-h-screen flex selection:bg-stitch-primary/10 font-body">
            {/* Sidebar Navigation */}
            <aside className="fixed top-0 left-0 h-full w-64 bg-stitch-surface border-r border-stitch-outline-variant/30 z-[60] hidden lg:flex flex-col">
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
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-stitch-on-surface-variant hover:bg-stitch-surface-container-low hover:text-stitch-primary transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">edit_note</span>
                        <span className="text-[13px]">개인 창업자 프로파일링</span>
                    </button>
                    <button
                        onClick={() => dispatch(setView('business_plan'))}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-stitch-surface-container-lowest shadow-sm text-stitch-primary font-bold transition-all border border-stitch-outline-variant/20"
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
            <div className="flex-1 lg:pl-64 transition-all w-full">
                {/* TopNavBar */}
                <TopNavBar onLogoClick={onBack} offsetSidebar={true} />

                <main className="pt-24 pb-24 px-8 md:px-12 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Configuration Form */}
                        <div className="lg:col-span-8 space-y-12">
                            <header>
                                <h1 className="text-4xl font-st-headline font-extrabold tracking-tight text-stitch-primary mb-2">창업 전략 설정</h1>
                                <p className="text-stitch-on-surface-variant font-body">원하는 방향을 선택하면 맞춤 전략을 만들어드려요</p>
                            </header>

                            {/* Section 1: Business Type */}
                            <section>
                                <div className="flex items-center justify-between mb-8 cursor-pointer">
                                    <h2 className="text-xl font-st-headline font-bold text-stitch-primary flex items-center">
                                        <span className="w-2 h-2 bg-stitch-secondary rounded-full mr-3"></span>
                                        업종 선택
                                    </h2>
                                    <span className="text-[10px] font-bold text-stitch-on-surface-variant bg-stitch-surface-container-high px-3 py-1 rounded-full uppercase tracking-widest">필수 선택</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {[
                                        { id: '카페', label: '카페', icon: 'local_cafe' },
                                        { id: '피자, 햄버거, 샌드위치 및 유사 음식점업', label: '디저트/패스트푸드', icon: 'cake' },
                                        { id: '서양식 음식점업', label: '브런치/파스타', icon: 'restaurant' },
                                        { id: '한식 음식점업', label: '한식/고기집', icon: 'outdoor_grill' },
                                        { id: '일식 음식점업', label: '일식', icon: 'set_meal' },
                                        { id: '중식 음식점업', label: '중식', icon: 'tapas' },
                                        { id: '기타 주점업', label: '술집', icon: 'local_bar' },
                                        { id: '제과점업', label: '베이커리', icon: 'bakery_dining' }
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => handleIndustryChange(type.id)}
                                            className={`p-6 rounded-2xl transition-all flex flex-col items-center text-center group ${industry === type.id ? 'bg-stitch-surface-container-highest ring-2 ring-stitch-primary shadow-xl shadow-stitch-primary/10' : 'bg-stitch-surface-container-lowest hover:bg-stitch-surface-bright hover:shadow-lg border border-stitch-outline-variant/10'}`}
                                        >
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${industry === type.id ? 'bg-stitch-primary' : 'bg-stitch-surface-container group-hover:bg-stitch-primary/10'}`}>
                                                <span className={`material-symbols-outlined text-2xl ${industry === type.id ? 'text-white' : 'text-stitch-primary'}`}>{type.icon}</span>
                                            </div>
                                            <span className={`font-bold text-sm ${industry === type.id ? 'text-stitch-primary' : 'text-stitch-on-surface-variant'}`}>{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Section 2: Target Customers */}
                            <section>
                                <h2 className="text-xl font-st-headline font-bold text-stitch-primary flex items-center mb-8">
                                    <span className="w-2 h-2 bg-stitch-secondary rounded-full mr-3"></span>
                                    타겟 고객층
                                </h2>
                                <div className="flex flex-wrap gap-4">
                                    {[
                                        '상관없음', '1020 학생', '2030 MZ', '3040 직장인', '가족단위'
                                    ].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => handleTargetChange(t)}
                                            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${target === t ? 'bg-stitch-primary text-white shadow-lg shadow-stitch-primary/20' : 'bg-stitch-surface-container text-stitch-on-surface-variant hover:bg-stitch-surface-container-high'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Section 3: Operating Time */}
                            <section>
                                <h2 className="text-xl font-st-headline font-bold text-stitch-primary flex items-center mb-8">
                                    <span className="w-2 h-2 bg-stitch-secondary rounded-full mr-3"></span>
                                    운영 시간
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { id: '런치 타임 (직장인)', label: '주간 집중형', time: '런치 타임 (직장인)', icon: 'light_mode' },
                                        { id: '상관없음', label: '올데이(All-Day)', time: '상관없음', icon: 'schedule' },
                                        { id: '심야 영업', label: '심야/24시', time: '심야 영업', icon: 'dark_mode' }
                                    ].map((time) => (
                                        <div
                                            key={time.id}
                                            onClick={() => handleOpTimeChange(time.id)}
                                            className={`relative p-8 rounded-2xl transition-all cursor-pointer overflow-hidden border ${op_time === time.id ? 'bg-stitch-surface-container-lowest border-stitch-primary ring-1 ring-stitch-primary' : 'bg-stitch-surface-container-lowest border-stitch-outline-variant/10 hover:border-stitch-outline-variant/40'}`}
                                        >
                                            {op_time === time.id && (
                                                <div className="absolute top-0 right-0 bg-stitch-primary text-white text-[9px] px-3 py-1 font-bold uppercase tracking-widest">선택됨</div>
                                            )}
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`material-symbols-outlined text-2xl ${op_time === time.id ? 'text-stitch-primary' : 'text-stitch-on-surface-variant'}`}>{time.icon}</span>
                                                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${op_time === time.id ? 'bg-stitch-primary border-stitch-primary' : 'border-stitch-outline'}`}>
                                                    {op_time === time.id && <span className="material-symbols-outlined text-white text-[16px]">check</span>}
                                                </span>
                                            </div>
                                            <div className="font-bold text-stitch-primary text-lg">{time.label}</div>
                                            <div className="text-xs text-stitch-on-surface-variant mt-1 font-medium opacity-60">{time.time}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Section 4: Operation Type */}
                            <section>
                                <h2 className="text-xl font-st-headline font-bold text-stitch-primary flex items-center mb-8">
                                    <span className="w-2 h-2 bg-stitch-secondary rounded-full mr-3"></span>
                                    운영 방식
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { id: '홀 중심', label: '홀 중심', desc: '고객이 매장에서 식사하는 환경과 서비스를 중점적으로 관리하는 방식입니다.', icon: 'person_check' },
                                        { id: '배달 중심', label: '배달 중심', desc: '배달 앱과 배달 시스템 최적화를 통해 매출을 극대화하는 방식입니다.', icon: 'groups' },
                                        { id: '테이크아웃 중점', label: '테이크아웃 중점', desc: '매장 대기 시스템과 포장 품질에 집중하여 회전율을 높이는 방식입니다.', icon: 'storefront' },
                                        { id: '홀+배달 복합', label: '홀+배달 복합', desc: '홀 서비스와 배달 수익을 동시에 추구하여 안정성을 높이는 방식입니다.', icon: 'diversity_3' }
                                    ].map((mode) => (
                                        <div
                                            key={mode.id}
                                            onClick={() => handleOpTypeChange(mode.id)}
                                            className={`p-8 rounded-3xl flex items-start gap-6 transition-all cursor-pointer border-2 ${op_type === mode.id ? 'bg-stitch-surface-container-highest border-stitch-primary' : 'bg-stitch-surface-container-lowest border-transparent hover:border-stitch-primary/10 shadow-sm hover:shadow-md'}`}
                                        >
                                            <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center transition-colors ${op_type === mode.id ? 'bg-stitch-primary text-white' : 'bg-stitch-surface-container text-stitch-primary'}`}>
                                                <span className="material-symbols-outlined text-3xl">{mode.icon}</span>
                                            </div>
                                            <div className="relative">
                                                {op_type === mode.id && <span className="absolute -top-1 -right-1 material-symbols-outlined text-stitch-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                                                <div className="font-bold text-xl text-stitch-primary mb-2 font-st-headline">{mode.label}</div>
                                                <p className="text-sm text-stitch-on-surface-variant leading-relaxed opacity-80">{mode.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="pt-8 flex justify-center">
                                <button
                                    onClick={onNext}
                                    className="px-20 py-5 bg-gradient-to-r from-stitch-primary to-stitch-primary-container text-white rounded-2xl font-bold text-xl shadow-2xl shadow-stitch-primary/30 transition-all hover:scale-[1.03] active:scale-[0.97]"
                                >
                                    맞춤 전략 생성하기
                                </button>
                            </div>
                        </div>

                        {/* Side Panel: AI Recommendation */}
                        <div className="lg:col-span-4 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-stitch-primary-container p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-stitch-primary/20 sticky top-24"
                            >
                                <div className="absolute -top-24 -right-24 w-72 h-72 bg-stitch-secondary/20 rounded-full blur-[80px]"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <span className="material-symbols-outlined text-stitch-secondary-fixed-dim text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                        <span className="font-st-headline font-bold text-lg uppercase tracking-tight">AI 추천 전략 프리뷰</span>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="p-6 rounded-2xl border border-white/20" style={{ background: 'rgba(30,16,8,0.7)' }}>
                                            <div className="text-[10px] uppercase tracking-[0.2em] font-black mb-2 text-white/50">추천 상권/업종</div>
                                            <div className="font-st-headline font-bold text-2xl mb-3 text-white">프리미엄 무인 소매점</div>
                                            <p className="text-xs text-white/70 leading-relaxed font-medium">
                                                현재 선택하신 '소매업'과 '오토 운영' 방식을 결합했을 때, 30-40대 직장인을 타겟으로 한 프리미엄 무인 샵이 가장 높은 수익률(18%)을 보일 것으로 예측됩니다.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-5 rounded-2xl border border-white/20" style={{ background: 'rgba(30,16,8,0.7)' }}>
                                                <div className="text-[9px] font-black uppercase tracking-widest mb-3 text-white/50">예상 수익률 (ROI)</div>
                                                <div className="text-3xl font-black font-st-headline" style={{ color: '#a8edbb' }}>24.5%</div>
                                            </div>
                                            <div className="p-5 rounded-2xl border border-white/20" style={{ background: 'rgba(30,16,8,0.7)' }}>
                                                <div className="text-[9px] font-black uppercase tracking-widest mb-3 text-white/50">리스크 수준</div>
                                                <div className="text-3xl font-black font-st-headline uppercase" style={{ color: '#fde68a' }}>낮음</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-white/10">
                                        <div className="flex items-center justify-between mb-4 text-xs font-bold uppercase tracking-widest">
                                            <span className="opacity-60">실행 가능성 분석</span>
                                            <span className="font-black" style={{ color: '#a8edbb' }}>89%</span>
                                        </div>
                                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '89%' }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="h-full rounded-full" style={{ background: '#a8edbb' }}
                                            ></motion.div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="bg-stitch-surface-container-low p-10 rounded-[2.5rem] border border-stitch-outline-variant/10 shadow-sm">
                                <h3 className="font-bold text-stitch-primary text-lg mb-8 flex items-center font-st-headline">
                                    <span className="material-symbols-outlined mr-3 text-stitch-primary">info</span>
                                    전략 구성 가이드
                                </h3>
                                <ul className="space-y-6">
                                    {[
                                        '최근 3개월간의 시장 데이터와 공공 데이터를 실시간으로 분석합니다.',
                                        '동일 업종 내 상위 5% 성공 매장의 운영 패턴을 벤치마킹합니다.',
                                        '임대료, 인건비 상승 등 외부 변수를 포함한 시뮬레이션을 제공합니다.'
                                    ].map((text, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <span className="w-6 h-6 bg-stitch-primary/10 rounded-lg flex items-center justify-center text-xs font-bold text-stitch-primary mt-0.5 mr-4 flex-shrink-0">{idx + 1}</span>
                                            <p className="text-xs text-stitch-on-surface-variant leading-relaxed font-medium opacity-80">{text}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="w-full py-12 px-12 mt-auto border-t border-stitch-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-stitch-on-surface-variant/40">
                    <div>© 2024 The Sovereign Insight. All rights reserved.</div>
                    <div className="flex gap-10">
                        <a className="hover:text-stitch-primary transition-all" href="#">개인정보 처리방침</a>
                        <a className="hover:text-stitch-primary transition-all" href="#">이용약관</a>
                        <a className="hover:text-stitch-primary transition-all" href="#">AI 공지사항</a>
                    </div>
                </footer>
            </div>
        </div>
    );
};
