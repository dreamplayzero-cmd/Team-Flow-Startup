import React from 'react';
import { LayoutGrid, BarChart2, MessageSquare, BookOpen } from 'lucide-react';

const NavItem: React.FC<{ icon: any, label: string, active?: boolean }> = ({ icon: Icon, label, active }) => (
    <div className={`flex flex-col items-center gap-1.5 flex-1 py-3 transition-colors cursor-pointer group ${active ? '' : 'hover:text-white text-white/20'}`}>
        <div className={`relative p-2.5 rounded-xl transition-all ${active ? 'bg-[#74a2ff] text-[#1c1c1e]' : ''}`}>
            <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
        </div>
        <span className={`text-[9px] font-black tracking-[0.2em] uppercase transition-colors ${active ? 'text-[#74a2ff]' : ''}`}>{label}</span>
    </div>
);

export const BottomNav: React.FC = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-white/5 px-6 pb-6 pt-2 z-50">
            <div className="max-w-md mx-auto flex items-center justify-between">
                <NavItem icon={LayoutGrid} label="Dashboard" active />
                <NavItem icon={BarChart2} label="Market" />
                <NavItem icon={MessageSquare} label="Assistant" />
                <NavItem icon={BookOpen} label="Guides" />
            </div>
        </div>
    );
};
