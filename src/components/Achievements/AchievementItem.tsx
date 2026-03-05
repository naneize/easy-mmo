import { Trophy, Lock } from 'lucide-react';
import type { Achievement } from '../../store/useAchievementStore';
import { useTranslation } from 'react-i18next';

export function AchievementItem({ data }: { data: Achievement }) {
    const { t } = useTranslation();
    const progress = Math.min((data.currentValue / data.targetValue) * 100, 100);

    return (
        <div className={`relative p-5 rounded-[2rem] border-2 transition-all duration-500 ${data.isUnlocked
            ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-md'
            : 'bg-slate-50 border-slate-100 opacity-70'
            }`}>
            <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${data.isUnlocked ? 'bg-amber-400 animate-bounce-slow' : 'bg-slate-200 grayscale'
                    }`}>
                    {data.isUnlocked ? data.icon : <Lock className="text-slate-400" size={20} />}
                </div>

                <div className="flex-1">
                    <h4 className="font-black text-slate-800 text-sm flex items-center gap-2">
                        {t(data.titleKey)}
                        {data.isUnlocked && <Trophy size={14} className="text-amber-500" />}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-tight">{t(data.descriptionKey)}</p>

                    {!data.isUnlocked && (
                        <div className="mt-3">
                            <div className="flex justify-between text-[9px] font-black text-slate-400 mb-1">
                                <span>{t('achievement.progress')}</span>
                                <span>{data.currentValue} / {data.targetValue}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 transition-all duration-1000"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}