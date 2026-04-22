import React from 'react';
import { Compass } from 'lucide-react';

export const Logo: React.FC = () => {
    return (
        <div className="flex flex-col items-center gap-6 py-4">
            <div className="relative">
                {/* Icon Container */}
                <div className="relative bg-[#74a2ff] p-5 rounded-xl shadow-lg shadow-blue-500/20">
                    <Compass className="w-12 h-12 text-[#1c1c1e]" strokeWidth={1.5} />
                </div>
            </div>

            <div className="text-center space-y-2">
                <h1 className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-[#74a2ff]">
                    STARTERMAP
                </h1>
                <p className="text-[12px] tracking-[0.4em] text-white/60 font-medium uppercase">
                    Industrial Intelligence Hub
                </p>
            </div>
        </div>
    );
};
