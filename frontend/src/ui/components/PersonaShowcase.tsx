import React from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../store';
import { setView } from '../../store/slices/navigationSlice';
import { updateFormData, setSelectedPersona, analyzePersona } from '../../store/slices/analysisSlice';

import p1 from '../../assets/personas/persona1.jpg';
import p2 from '../../assets/personas/persona2.jpg';
import p3 from '../../assets/personas/persona3.jpg';
import p4 from '../../assets/personas/persona4.jpg';
import p5 from '../../assets/personas/persona5.jpg';

const personas = [
    {
        id: 1,
        name: '김지호',
        age: 24,
        role: '패션 디자인 전공',
        budget: '8,000만 원',
        location: '한남동',
        type: '편집숍/리테일',
        desc: '한남동에 개인 디자이너 브랜드 편집숍 오픈 계획',
        img: p1,
    },
    {
        id: 2,
        name: '박민경',
        age: 29,
        role: '헬스 트레이너',
        budget: '1억 원',
        location: '망원동',
        type: '샐러드 카페',
        desc: '저칼로리 샐러드 카페 오픈 희망',
        img: p2,
    },
    {
        id: 3,
        name: '이서현',
        age: 27,
        role: 'UI 디자이너',
        budget: '1.5억 원',
        location: '성수동',
        type: '미니멀리즘 카페',
        desc: '픽셀(Pixel) 미니멀리즘 카페 오픈 계획',
        img: p3,
    },
    {
        id: 4,
        name: '최우진',
        age: 26,
        role: '테크 미디어 인턴',
        budget: '6,000만 원',
        location: '연남동',
        type: '무인 사진관',
        desc: '레트로-AI 무인 셀프 사진관 구축 계획',
        img: p4,
    },
    {
        id: 5,
        name: '한상미',
        age: 38,
        role: '베테랑 셰프',
        budget: '5억 원',
        location: '한남동',
        type: '파인 다이닝',
        desc: '퓨전 한식 베테랑 파인 다이닝 2호점',
        img: p5,
    }
];

export const PersonaShowcase: React.FC = () => {
    const dispatch = useAppDispatch();

    const handlePersonaClick = (p: typeof personas[0]) => {
        // Parse budget
        let capital = 50000000;
        if (p.budget.includes('억')) {
            const num = parseFloat(p.budget.replace('억 원', '').trim());
            capital = Math.floor(num * 100000000);
        } else if (p.budget.includes('만')) {
            const num = parseInt(p.budget.replace(',', '').replace('만 원', '').trim());
            capital = num * 10000;
        }

        // Map industry to backend standard
        let industry = '카페';
        if (p.type.includes('편집숍')) industry = '패션 편집샵';
        else if (p.type.includes('샐러드')) industry = '디저트';
        else if (p.type.includes('미니멀리즘 카페')) industry = '카페';
        else if (p.type.includes('사진관')) industry = '셀프 사진관';
        else if (p.type.includes('다이닝')) industry = '파스타';

        dispatch(updateFormData({
            age: p.age,
            capital: capital, 
            industry,
            areas: [p.location],
            gender: '무관',
            experience: p.id === 5 ? 3 : 0,
            target: p.id === 3 ? '2030 MZ' : '상관없음',
        }));

        dispatch(setSelectedPersona({ name: p.name, description: p.desc }));
        dispatch(analyzePersona({ name: p.name, description: p.desc }));
        dispatch(setView('persona'));
    };

    return (
        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-stitch-outline-variant/10">
            <div className="flex justify-between items-end gap-6 mb-10">
                <div>
                    <h2 className="text-3xl font-st-headline font-black text-stitch-primary mb-2">창업 페르소나 매칭</h2>
                    <p className="text-stitch-on-surface-variant/60 font-bold text-xs uppercase tracking-widest">
                        다양한 창업자 프로필 데이터 요약
                    </p>
                </div>
                <button
                    onClick={() => handlePersonaClick(personas[0])}
                    className="flex items-center gap-2 bg-stitch-surface text-stitch-on-surface hover:bg-stitch-primary hover:text-white transition-all px-6 py-3 rounded-xl font-bold text-xs shadow-sm border border-stitch-outline-variant/10"
                >
                    상세 프로파일링 보기 <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {personas.map((p, idx) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative bg-[#1E2024] rounded-[1.5rem] overflow-hidden cursor-pointer"
                        onClick={() => handlePersonaClick(p)}
                    >
                        {/* Image Background */}
                        <div className="absolute inset-0 z-0">
                            <img src={p.img} alt={p.name} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500 scale-105 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/80 to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-6 flex flex-col h-full min-h-[320px]">
                            <div className="flex justify-between items-start mb-auto">
                                <span className="bg-stitch-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                    {p.location}
                                </span>
                                <span className="material-symbols-outlined text-white/50 group-hover:text-white transition-colors">
                                    insights
                                </span>
                            </div>

                            <div className="mt-8">
                                <div className="text-[#4EDEA3] text-[10px] font-black uppercase tracking-widest mb-1.5">{p.type}</div>
                                <h3 className="text-white font-st-headline font-black text-xl mb-1">{p.name} <span className="text-white/60 text-sm font-normal">({p.age}세)</span></h3>
                                <p className="text-white/80 text-xs font-bold mb-4 line-clamp-2">{p.desc}</p>

                                <div className="flex flex-col gap-2 border-t border-white/10 pt-4 mt-4">
                                    <div className="flex justify-between items-center text-[10px] text-white/60">
                                        <span className="uppercase tracking-widest font-bold">경력/현업</span>
                                        <span className="text-white font-bold">{p.role}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-white/60">
                                        <span className="uppercase tracking-widest font-bold">예산</span>
                                        <span className="text-white font-bold">{p.budget}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
