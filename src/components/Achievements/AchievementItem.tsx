import { Trophy, Lock } from 'lucide-react';
import type { Achievement } from '../../store/useAchievementStore';
import { useTranslation } from 'react-i18next';

export function AchievementItem({ data }: { data: Achievement }) {
    const { t } = useTranslation();
    const progress = Math.min((data.currentValue / data.targetValue) * 100, 100);

    return (
        <div className={`relative p-5 rounded-[2rem] border transition-all duration-500 backdrop-blur-xl group
            ${data.isUnlocked
                /* 🚩 ปลดล็อคแล้ว: ใช้สีเขียวมรกตใสสว่าง ล้อกับธีม Emerald */
                ? 'bg-white/20 border-emerald-200/50 shadow-[0_8px_32px_rgba(16,185,129,0.15)] ring-1 ring-white/30'
                /* 🚩 ยังไม่ปลด: ใช้สีเข้มขึ้นเพื่อให้ตัดกับพื้นหลังสว่าง */
                : 'bg-slate-900/10 border-white/5 opacity-70 hover:opacity-100 hover:bg-white/10'
            }`}>

            <div className="flex items-center gap-5">
                {/* Icon Container: ปรับเป็นทรงสี่เหลี่ยมโค้งมนสไตล์แอปสมัยใหม่ */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-500 group-hover:scale-110 shadow-lg ${data.isUnlocked
                    ? 'bg-gradient-to-br from-emerald-400 to-cyan-500 text-white shadow-emerald-500/20 rotate-3'
                    : 'bg-slate-800/40 text-slate-400 grayscale border border-white/5'
                    }`}>
                    {data.isUnlocked ? (
                        <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">{data.icon}</span>
                    ) : (
                        <Lock size={20} className="opacity-50" />
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h4 className={`font-black text-[15px] tracking-tight ${data.isUnlocked ? 'text-slate-900' : 'text-slate-700/60'}`}>
                            {t(data.titleKey)}
                        </h4>
                        {data.isUnlocked && (
                            <div className="bg-emerald-500/20 p-1 rounded-full">
                                <Trophy size={12} className="text-emerald-600 fill-emerald-600/10" />
                            </div>
                        )}
                    </div>

                    <p className={`text-[11px] font-bold mt-0.5 leading-snug ${data.isUnlocked ? 'text-slate-600' : 'text-slate-500/40'}`}>
                        {t(data.descriptionKey)}
                    </p>

                    {/* Progress Area: ปรับสีให้เข้ากับธีม Cyan/Blue */}
                    {!data.isUnlocked && (
                        <div className="mt-4 space-y-1.5">
                            <div className="flex justify-between items-end px-0.5">
                                <span className="text-[10px] font-black text-slate-500/50 uppercase tracking-widest">{t('achievement.progress')}</span>
                                <span className="text-[10px] font-black text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded-md">
                                    {data.currentValue.toLocaleString()} <span className="text-cyan-300">/</span> {data.targetValue.toLocaleString()}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-slate-900/5 rounded-full overflow-hidden p-[1px] border border-white/20">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ✨ ของตกแต่ง: แสงสะท้อนเล็กๆ มุมการ์ด */}
            {data.isUnlocked && (
                <>
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    <div className="absolute -z-10 inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-[2rem]" />
                </>
            )}
        </div>
    );
}