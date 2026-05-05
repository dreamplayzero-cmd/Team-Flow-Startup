import React from 'react';
import executiveImg from '../../assets/executive.png';

interface TopNavBarProps {
    onLogoClick?: () => void;
    offsetSidebar?: boolean;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ onLogoClick, offsetSidebar = false }) => {
    return (
        <nav className={`fixed top-0 right-0 left-0 ${offsetSidebar ? 'lg:left-64' : ''} z-50 bg-[#faf8ff]/80 backdrop-blur-3xl border-b border-stitch-outline-variant/10 shadow-sm h-16 flex items-center transition-all`}>
            <div className="flex justify-between items-center px-10 w-full max-w-[1440px] mx-auto">
                <div className="flex items-center gap-12">
                    <div
                        className="text-xl font-black text-stitch-primary font-st-headline tracking-tighter cursor-pointer"
                        onClick={onLogoClick}
                    >
                        Youth Startup Flow
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-xs font-black text-stitch-on-surface-variant/40 uppercase tracking-widest">
                        <a className="hover:text-stitch-primary transition-colors text-stitch-primary border-b border-stitch-primary pb-1" href="#">시장 정보</a>
                        <a className="hover:text-stitch-primary transition-colors" href="#">전략 자산</a>
                        <a className="hover:text-stitch-primary transition-colors" href="#">리스크 모델링</a>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-stitch-on-surface-variant cursor-pointer p-2 hover:bg-stitch-surface-container-low rounded-full transition-all">search</span>
                        <span className="material-symbols-outlined text-stitch-on-surface-variant cursor-pointer p-2 hover:bg-stitch-surface-container-low rounded-full transition-all">notifications</span>
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-stitch-outline-variant/10 bg-stitch-surface-container-highest">
                        <img src={executiveImg} alt="User" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </nav>
    );
};
