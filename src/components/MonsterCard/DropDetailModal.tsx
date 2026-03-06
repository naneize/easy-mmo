import { X, Gift, Coins, Sparkles } from 'lucide-react'
import type { MonsterData } from '../../types/game'
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../store/useGameStore';

interface Props {
    monster: MonsterData;
    onClose: () => void;
}

export function DropDetailModal({ monster, onClose }: Props) {
    const { ownedSkills } = useGameStore();
    const { t } = useTranslation();

    // ดึงข้อมูลสกิลจาก ID ที่มอนสเตอร์ดรอปได้
    const droppedSkills = (monster.droppedSkills || []).map(id =>
        ownedSkills.find(s => s.id === id)
    ).filter(Boolean);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-2xl text-amber-600">
                            <Gift size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">{t('dropDetail.title')}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t(monster.nameKey)}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    {droppedSkills.length > 0 ? (
                        droppedSkills.map(skill => {
                            // 1. กำหนดสกิลเริ่มต้น (เพื่อให้ตรงกับ Logic ใน Battle)
                            const starterSkills = ['sturdy-body', 'brute-force', 'battle-focus', 'gold-finder'];
                            const isStarter = starterSkills.includes(skill.id);

                            // 2. เลือกข้อความที่จะโชว์
                            const displayRate = isStarter ? "30%" : "3-5%";

                            return (
                                <div key={skill?.id} className="flex items-center gap-4 p-4 rounded-3xl border border-slate-100 bg-white shadow-sm">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl">
                                        {typeof skill?.Icon === 'string' ? skill.Icon : "✨"}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="text-sm font-black text-slate-800">{t(`skills.${skill.id}.name`)}</div>

                                        </div>
                                        <div className="text-[10px] text-slate-400 font-medium leading-tight">{t(`skills.${skill.id}.description`)}</div>
                                    </div>
                                    {/* 🟢 แสดง Rate ตามประเภทสกิล */}
                                    <div className={`text-[10px] font-black px-2 py-1 rounded-lg ${isStarter ? 'text-emerald-600 bg-emerald-50' : 'text-amber-500 bg-amber-50'}`}>
                                        {displayRate}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center py-10 text-slate-400 font-bold uppercase text-xs">{t('dropDetail.noDrops')}</p>
                    )}
                </div>
            </div>
        </div>
    );
}