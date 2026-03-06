import { X, Shield, Zap, Sparkles } from 'lucide-react'
import type { MonsterData } from '../../types/game'
import { useTranslation } from 'react-i18next'

interface Props {
    monster: MonsterData;
    onClose: () => void;
}

export function MonsterSkillModal({ monster, onClose }: Props) {
    const { t } = useTranslation();

    // ดึงรายการ Passive ออกมา
    const passives = monster.passives || [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">

                {/* Header: เปลี่ยนสีเป็น Indigo เพื่อให้ต่างจากหน้า Drop */}
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-indigo-50/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-2xl text-indigo-600">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">
                                {t('monsterSkill.title', 'Monster Passives')}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                {t(monster.nameKey)}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    {passives.length > 0 ? (
                        passives.map((skill, index) => (
                            <div key={`${skill.id}-${index}`} className="flex items-center gap-4 p-4 rounded-3xl border border-slate-100 bg-white shadow-sm hover:border-indigo-100 transition-colors group">
                                {/* Icon สกิล (จำลอง) */}
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl group-hover:bg-indigo-50 transition-colors">
                                    {/* คุณอาจจะเปลี่ยนเป็น Logic เลือก Icon ตามประเภทสกิลในอนาคต */}
                                    <Zap size={20} className="text-indigo-400" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm font-black text-slate-800">
                                            {t(`skills.${skill.id}.name`)}
                                        </div>
                                        {/* Badge บอกเลเวลสกิลของมอนสเตอร์ */}
                                        <div className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">
                                            LV.{skill.level}
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium leading-tight mt-1">
                                        {t(`skills.${skill.id}.description`)}
                                    </div>
                                </div>

                                {/* เอฟเฟกต์ประดับเพื่อให้ดูเป็นสกิล */}
                                <div className="text-indigo-200">
                                    <Sparkles size={16} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-slate-400 font-bold uppercase text-xs">
                                {t('monsterSkill.noSkills', 'This monster has no passive skills')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer สั้นๆ ให้ดูจบงานสวย */}
                <div className="p-4 bg-slate-50/50 text-center">
                    <p className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter">
                        Be careful, these passives make them stronger!
                    </p>
                </div>
            </div>
        </div>
    );
}