import { X, Award } from 'lucide-react';
import { useAchievementStore } from '../../store/useAchievementStore';
import { AchievementItem } from './AchievementItem';
import { useTranslation } from 'react-i18next';

export function AchievementModal({ onClose }: { onClose: () => void }) {
    const { achievements } = useAchievementStore();
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={onClose} />

            <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-8">
                <div className="bg-slate-900 p-8 text-white flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <Award className="text-amber-400" size={32} />
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">{t('achievement.title')}</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t('achievement.subtitle')}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 max-h-[60vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map(a => <AchievementItem key={a.id} data={a} />)}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t('achievement.footer')}
                </div>
            </div>
        </div>
    );
}