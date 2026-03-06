import { Trophy, Lock } from 'lucide-react';
import type { Achievement } from '../../store/useAchievementStore';
import { useTranslation } from 'react-i18next';

export function AchievementItem({ data }: { data: Achievement }) {
    const { t } = useTranslation();
    const progress = Math.min((data.currentValue / data.targetValue) * 100, 100);

    return (
        <div className={`relative p-5 rounded-[2.5rem] border-2 transition-all duration-500 backdrop-blur-md ${data.isUnlocked
            /* 🚩 ถ้าปลดล็อคแล้ว: ใช้สีทองใสๆ ให้ความรู้สึกหรูหรา */
            ? 'bg-amber-400/20 border-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
            /* 🚩 ถ้ายังไม่ปลด: ใช้สีขาวใส (Glass) */
            : 'bg-white/5 border-white/10 opacity-80'
            }`}>

            <div className="flex items-center gap-4">
                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-inner ${data.isUnlocked
                    ? 'bg-gradient-to-b from-amber-300 to-orange-500 text-white animate-bounce-slow'
                    : 'bg-white/10 text-white/20 grayscale'
                    }`}>
                    {data.isUnlocked ? data.icon : <Lock size={20} />}
                </div>

                <div className="flex-1">
                    <h4 className={`font-black text-sm flex items-center gap-2 ${data.isUnlocked ? 'text-amber-200' : 'text-white/70'}`}>
                        {t(data.titleKey)}
                        {data.isUnlocked && <Trophy size={14} className="text-amber-400 fill-amber-400/20" />}
                    </h4>

                    <p className={`text-[10px] font-bold uppercase leading-tight ${data.isUnlocked ? 'text-amber-100/60' : 'text-white/40'}`}>
                        {t(data.descriptionKey)}
                    </p>

                    {!data.isUnlocked && (
                        <div className="mt-3">
                            <div className="flex justify-between text-[9px] font-black mb-1">
                                <span className="text-white/40">{t('achievement.progress')}</span>
                                <span className="text-white/60">{data.currentValue.toLocaleString()} / {data.targetValue.toLocaleString()}</span>
                            </div>
                            {/* 🚩 Progress Bar แบบใส */}
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 shadow-[0_0_8px_rgba(129,140,248,0.5)] transition-all duration-1000"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Effect พิเศษเมื่อปลดล็อคแล้ว (แสงฟุ้ง) */}
            {data.isUnlocked && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full blur-md animate-pulse" />
            )}
        </div>
    );
}