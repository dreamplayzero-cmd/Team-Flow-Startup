import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
    rightElement?: React.ReactNode;
}

export const AuthInput: React.FC<AuthInputProps> = ({
    label,
    icon: Icon,
    rightElement,
    className,
    ...props
}) => {
    return (
        <div className="w-full">
            <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/30 group-focus-within:text-[#74a2ff] transition-colors">
                    <Icon size={20} />
                </div>
                <input
                    className={cn(
                        "w-full bg-[#2c2c2e] text-base py-5 pl-14 pr-4 rounded-xl border border-white/5 transition-all outline-none",
                        "focus:border-[#74a2ff]/30 focus:bg-[#343436] text-white placeholder:text-white/20",
                        className
                    )}
                    {...props}
                />
            </div>
        </div>
    );
};
