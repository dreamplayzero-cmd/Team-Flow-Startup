import React from 'react';
import { TrendingUp, Info, Gavel, Map as MapIcon, Wallet, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const BrandItem: React.FC<{ rank: string, name: string, change: string, isPositive: boolean }> = ({ rank, name, change, isPositive }) => (
    <div className="flex items-center justify-between bg-[#2c2c2e] p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-white/20 italic">{rank}</span>
            <span className="text-[11px] font-bold text-white uppercase tracking-tight">{name}</span>
        </div>
        <span className={`text-[10px] font-bold ${isPositive ? 'text-[#03c75a]' : 'text-red-500'}`}>
            {change}
        </span>
    </div>
);

const GuideItem: React.FC<{ icon: any, label: string }> = ({ icon: Icon, label }) => (
    <div className="flex flex-col items-center justify-center gap-3 bg-[#2c2c2e] aspect-square rounded-2xl border border-white/5 hover:border-[#74a2ff]/30 transition-all cursor-pointer group">
        <Icon className="w-5 h-5 text-white/40 group-hover:text-[#74a2ff] transition-colors" strokeWidth={1.5} />
        <span className="text-[9px] font-black text-white/20 group-hover:text-white transition-colors uppercase tracking-[0.2em]">{label}</span>
    </div>
);

export const StatsGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Brand Ranking */}
            <motion.div
                className="bg-[#1c1c1e] p-8 rounded-3xl border border-white/5 space-y-6"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">인기 브랜드 순위</h3>
                    <TrendingUp className="w-4 h-4 text-[#74a2ff]" />
                </div>
                <div className="space-y-3">
                    <BrandItem rank="01" name="SILO COFFEE" change="+12%" isPositive={true} />
                    <BrandItem rank="02" name="TEK WORKSHOP" change="+8%" isPositive={true} />
                </div>
            </motion.div>

            {/* Opening Shop Essentials */}
            <motion.div
                className="bg-[#1c1c1e] p-8 rounded-3xl border border-white/5 space-y-6"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">창업 가이드</h3>
                    <Info className="w-4 h-4 text-white/20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <GuideItem icon={Gavel} label="법률" />
                    <GuideItem icon={MapIcon} label="지역" />
                    <GuideItem icon={Wallet} label="자금" />
                    <GuideItem icon={Zap} label="실행" />
                </div>
            </motion.div>
        </div>
    );
};
