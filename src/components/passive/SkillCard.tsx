import { Sun, Moon, Zap, Sparkles, Lock } from 'lucide-react';
import React from 'react';

interface SkillCardProps {
    skill: any;
    isEquipped?: boolean;
    isSynergy?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'equip' | 'upgrade';
    children?: React.ReactNode;
    className?: string;
}

const ELEMENT_COLORS: Record<string, string> = {
    Fire: 'bg-orange-500 text-white shadow-orange-200',
    Water: 'bg-blue-500 text-white shadow-blue-200',
    Earth: 'bg-emerald-600 text-white shadow-emerald-200',
    Wind: 'bg-sky-500 text-white shadow-sky-200',
    Light: 'bg-yellow-400 text-yellow-900 shadow-yellow-100',
    Dark: 'bg-purple-900 text-purple-100 shadow-purple-900/20',
    Neutral: 'bg-slate-500 text-white shadow-slate-200'
};

const TIER_CONFIGS = {
    common: {
        label: 'Common',
        color: 'text-slate-400',
        border: 'border-slate-200',
        glow: 'group-hover:shadow-slate-100',
        bgIcon: 'bg-slate-100 text-slate-500'
    },
    rare: {
        label: 'Rare',
        color: 'text-blue-500',
        border: 'border-blue-200',
        glow: 'group-hover:shadow-blue-100',
        bgIcon: 'bg-blue-50 text-blue-600'
    },
    epic: {
        label: 'Epic',
        color: 'text-purple-500',
        border: 'border-purple-200',
        glow: 'group-hover:shadow-purple-100',
        bgIcon: 'bg-purple-50 text-purple-600'
    },
    legendary: {
        label: 'Legendary',
        color: 'text-orange-500',
        border: 'border-orange-200',
        glow: 'group-hover:shadow-orange-200',
        bgIcon: 'bg-orange-50 text-orange-600'
    }
};

export function SkillCard({
    skill,
    className = "",
    isEquipped,
    isSynergy,
    onClick,
    disabled,
    variant = 'equip',
    children
}: SkillCardProps) {
    const Icon = skill.Icon;
    const isLocked = skill.unlocked === false;
    const tier = (skill.tier || 'common') as keyof typeof TIER_CONFIGS;
    const tierStyle = TIER_CONFIGS[tier];

    return (
        <div
            onClick={!disabled && !isLocked ? onClick : undefined}
            className={`group relative flex flex-col rounded-[1.5rem] sm:rounded-[2rem] border-2 p-4 sm:p-5 transition-all duration-300 overflow-hidden
                ${isLocked ? 'bg-slate-50/50 border-slate-100 opacity-80' : `bg-white ${tierStyle.border} ${tierStyle.glow}`}
                ${isEquipped ? 'ring-2 ring-emerald-500 ring-offset-2 border-emerald-200 shadow-lg scale-[1.01] sm:scale-[1.02]' : 'hover:border-indigo-300'}
                ${disabled ? 'grayscale cursor-not-allowed' : 'cursor-pointer'}
                ${className}
            `}
        >
            {/* Background Decorative Gradient (Hidden on very small screens to save performance) */}
            {!isLocked && (
                <div className={`absolute -right-8 -top-8 h-20 w-20 sm:h-24 sm:w-24 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20
                    ${tier === 'legendary' ? 'bg-orange-500' : 'bg-indigo-500'}`}
                />
            )}

            {/* Top Bar: Element & Tier */}
            <div className="flex justify-between items-center mb-3 sm:mb-4">
                <div className={`flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm transition-all
                    ${isLocked ? 'bg-slate-200 text-slate-400' : ELEMENT_COLORS[skill.element ?? 'Neutral']}`}>
                    {skill.element === 'Light' && <Sun size={8} className="sm:w-[10px]" strokeWidth={3} />}
                    {skill.element === 'Dark' && <Moon size={8} className="sm:w-[10px]" strokeWidth={3} />}
                    {skill.element === 'Neutral' && <Zap size={8} className="sm:w-[10px]" strokeWidth={3} />}
                    <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-wider">{skill.element ?? 'Neutral'}</span>
                </div>

                <div className={`text-[7px] sm:text-[9px] font-black uppercase tracking-widest ${isLocked ? 'text-slate-300' : tierStyle.color}`}>
                    {tierStyle.label}
                </div>
            </div>

            {/* Content Body */}
            <div className="flex gap-3 sm:gap-4 items-center">
                <div className="relative shrink-0">
                    <div className={`grid h-12 w-12 sm:h-16 sm:w-16 place-items-center rounded-xl sm:rounded-2xl transition-all duration-500
                        ${isLocked ? 'bg-slate-100 text-slate-300' :
                            isEquipped ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' :
                                `${tierStyle.bgIcon} group-hover:scale-105`}`}>
                        {Icon && <Icon size={isLocked ? 20 : 28} className="sm:w-[32px] sm:h-[32px]" strokeWidth={isEquipped ? 2.5 : 2} />}
                    </div>
                    {isLocked && (
                        <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white p-1 rounded-md border-2 border-white shadow-md">
                            <Lock size={10} fill="currentColor" />
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className={`text-sm sm:text-lg font-black truncate leading-tight flex items-center gap-1.5
                        ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>
                        {skill.name}
                        {isSynergy && <Sparkles size={14} className="text-amber-400 animate-pulse shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
                        <span className={`text-[8px] sm:text-[10px] font-black px-1 sm:px-1.5 py-0.5 rounded border 
                            ${isLocked ? 'border-slate-200 text-slate-300' : 'border-indigo-100 text-indigo-500 bg-indigo-50/50'}`}>
                            LV.{skill.level || 1}
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate">
                            {skill.type || 'Ability'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Description Area */}
            <div className="mt-3 sm:mt-4 bg-slate-50/50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-slate-100/50 min-h-[40px] sm:min-h-[52px]">
                <p className={`text-[9px] sm:text-[11px] leading-tight sm:leading-relaxed font-medium line-clamp-2
                    ${isLocked ? 'text-slate-400 italic' : 'text-slate-600'}`}>
                    {skill.description}
                </p>
            </div>

            {/* Action Slot */}
            <div className="mt-auto pt-3 relative z-20">
                {children}
            </div>

            {/* Equipped Overlay (Responsive) */}
            {isEquipped && (
                <div className="absolute top-0 right-0 h-12 w-12 sm:h-16 sm:w-16 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-8px] right-[-25px] sm:top-[-10px] sm:right-[-30px] h-6 w-16 sm:h-8 sm:w-20 bg-emerald-500 text-white text-[6px] sm:text-[8px] font-black uppercase flex items-center justify-center rotate-45 shadow-sm pt-2">
                        Active
                    </div>
                </div>
            )}
        </div>
    );
}