import React from 'react';
import { cn } from '../../utils/cn';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'kakao' | 'naver' | 'apple' | 'ghost';
    fullWidth?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = true,
    className,
    ...props
}) => {
    const variants = {
        primary: "bg-[#74a2ff] text-[#1c1c1e] shadow-lg shadow-blue-500/20 hover:bg-[#8ab1ff] transition-all",
        kakao: "bg-[#fee500] text-[#1c1c1e] hover:bg-[#fada00] p-3 rounded-xl",
        naver: "bg-[#03c75a] text-white hover:bg-[#02b350] p-3 rounded-xl",
        apple: "bg-black text-white hover:bg-zinc-900 p-3 rounded-xl border border-white/10",
        ghost: "bg-transparent text-white/40 hover:text-white underline font-normal",
    };

    return (
        <button
            className={cn(
                "py-4 px-6 rounded-lg font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3",
                fullWidth && "w-full",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
