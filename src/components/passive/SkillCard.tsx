import { Sun, Moon, Zap, Sparkles } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface SkillCardProps {
    skill: any;
    isEquipped?: boolean;
    isSynergy?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'equip' | 'upgrade';
    children?: React.ReactNode;
    className?: string;
    hideDescription?: boolean;
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

export function SkillCard({ skill, className = "", isEquipped, isSynergy, onClick, disabled, children, hideDescription = false }: SkillCardProps) {
    const { t } = useTranslation();

    const TIER_CONFIGS = {
        common: { label: t('inventory.common'), color: 'text-slate-400', border: 'border-slate-200', glow: 'group-hover:shadow-slate-100', bgIcon: 'bg-slate-100 text-slate-500' },
        rare: { label: t('inventory.rare'), color: 'text-blue-500', border: 'border-blue-200', glow: 'group-hover:shadow-blue-100', bgIcon: 'bg-blue-50 text-blue-600' },
        epic: { label: t('inventory.epic'), color: 'text-purple-500', border: 'border-purple-200', glow: 'group-hover:shadow-purple-100', bgIcon: 'bg-purple-50 text-purple-600' },
        legendary: { label: t('inventory.legendary'), color: 'text-orange-500', border: 'border-orange-200', glow: 'group-hover:shadow-orange-200', bgIcon: 'bg-orange-50 text-orange-600' }
    };

    const Icon = skill.Icon;
    const isLocked = skill.locked || skill.isLocked;
    const tier = (skill.tier || 'common') as keyof typeof TIER_CONFIGS;
    const tierStyle = TIER_CONFIGS[tier];

    return (
        <div
            onClick={!disabled && !isLocked ? onClick : undefined}
            className={`group relative flex flex-col rounded-[1.5rem] sm:rounded-[2rem] border-2 p-4 transition-all duration-300 overflow-hidden
                ${isLocked ? 'bg-slate-50/50 border-slate-100 opacity-80' : `bg-white ${tierStyle.border} ${tierStyle.glow}`}
                ${isEquipped ? 'ring-2 ring-emerald-500 ring-offset-2 border-emerald-200 shadow-lg' : 'hover:border-indigo-300'}
                ${disabled ? 'grayscale cursor-not-allowed' : 'cursor-pointer'}
                /* 🎯 จุดสำคัญ: ถ้าหด ต้อง min-h-0 และ h-fit */
                ${hideDescription ? 'min-h-0 h-fit justify-center' : 'min-h-[160px]'} 
                ${className}`}
        >
            {/* 1. Top Bar: ซ่อนเมื่อหด */}
            {!hideDescription && (
                <div className="flex justify-between items-center mb-3">
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full shadow-sm
                        ${isLocked ? 'bg-slate-200 text-slate-400' : ELEMENT_COLORS[skill.element ?? 'Neutral']}`}>
                        {skill.element === 'Light' ? <Sun size={8} /> : skill.element === 'Dark' ? <Moon size={8} /> : <Zap size={8} />}
                        <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-wider">{t(`${(skill.element ?? 'Neutral').toLowerCase()}`)}</span>
                    </div>
                    <div className={`text-[7px] sm:text-[9px] font-black uppercase tracking-widest ${tierStyle.color}`}>{tierStyle.label}</div>
                </div>
            )}

            {/* 2. Content Body: Icon & Name (ส่วนนี้โชว์เสมอ) */}
            <div className="flex gap-3 items-center">
                <div className={`grid shrink-0 place-items-center rounded-xl sm:rounded-2xl transition-all
                    ${hideDescription ? 'h-11 w-11' : 'h-12 w-12 sm:h-16 sm:w-16'}
                    ${isLocked ? 'bg-slate-100 text-slate-300' : isEquipped ? 'bg-emerald-500 text-white shadow-lg' : `${tierStyle.bgIcon}`}`}>
                    {Icon && <Icon size={hideDescription ? 22 : 28} />}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="text-sm sm:text-lg font-black truncate leading-tight flex items-center gap-1.5 text-slate-800">
                        {t(skill.nameKey)}
                        {isSynergy && <Sparkles size={14} className="text-amber-400 animate-pulse shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded border border-indigo-100 text-indigo-500 bg-indigo-50/50">
                            LV.{skill.level || 1}
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase">{skill.type || t('skills.ability')}</span>
                    </div>
                </div>
            </div>

            {/* 3. Description Area: ครอบด้วยเงื่อนไขเดียว จบเลย */}
            {!hideDescription && (
                <div className="mt-3 bg-slate-50/50 rounded-lg p-2 border border-slate-100/50">
                    <p className="text-[10px] sm:text-[12px] leading-relaxed text-slate-600 font-medium">
                        {t(skill.descriptionKey)}
                    </p>
                </div>
            )}

            {/* 4. Action Slot (Buttons) */}
            <div className={`${hideDescription ? 'mt-0' : 'mt-auto pt-3'} relative z-20`}>
                {children}
            </div>

            {/* 5. Equipped Ribbon: ซ่อนเมื่อหดเพื่อความคลีน */}
            {isEquipped && !hideDescription && (
                <div className="absolute top-0 right-0 h-12 w-12 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-8px] right-[-25px] h-6 w-16 bg-emerald-500 text-white text-[6px] font-black uppercase flex items-center justify-center rotate-45 shadow-sm pt-2">
                        {t('skills.active')}
                    </div>
                </div>
            )}
        </div>
    );

}