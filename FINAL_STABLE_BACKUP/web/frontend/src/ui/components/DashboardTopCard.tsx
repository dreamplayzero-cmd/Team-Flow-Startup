import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface DashboardTopCardProps {
    title: string;
    subtitle: string;
    description: string;
    icon: LucideIcon;
    bgIcon: LucideIcon;
    colorClass: string;
    delay?: number;
    onClick?: () => void;
}

export const DashboardTopCard: React.FC<DashboardTopCardProps> = ({
    title,
    subtitle,
    description,
    icon: Icon,
    bgIcon: BgIcon,
    colorClass,
    delay = 0,
    onClick
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay }
            }}
            whileHover={{
                y: -15,
                scale: 1.02,
                transition: { duration: 0.3 }
            }}
            onClick={onClick}
            className="relative glass-card p-6 rounded-3xl overflow-hidden group cursor-pointer group glow-primary transition-all duration-500"
        >
            {/* Background Icon */}
            <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <BgIcon size={120} strokeWidth={1} className={colorClass} />
            </div>

            <div className="relative z-10 space-y-4">
                <div className={cn("inline-flex p-3 rounded-xl bg-surface-container-high border border-outline-variant/15 shadow-inner")}>
                    <Icon className={cn("w-6 h-6", colorClass)} />
                </div>

                <div>
                    <h3 className="text-xl font-headline font-bold text-on-surface tracking-tight">{title}</h3>
                    <p className="text-[10px] font-label text-primary-container mt-1 uppercase tracking-[0.2em]">{subtitle}</p>
                </div>

                <p className="text-xs text-on-surface-variant font-body leading-relaxed max-w-[160px]">
                    {description}
                </p>
            </div>

            {/* Glowing Accent */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary-container/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </motion.div>
    );
};
