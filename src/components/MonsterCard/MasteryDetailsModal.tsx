import { X, Trophy, Target } from 'lucide-react'
import type { MonsterData } from '../../types/game'
import { MilestoneItem } from './MilestoneItem'
import { getMasteryBonus } from '../../utils/gameHelpers'

interface MasteryModalProps {
    monster: MonsterData;
    kills: number;
    onClose: () => void;
}

export function MasteryDetailsModal({ monster, kills, onClose }: MasteryModalProps) {
    const mastery = getMasteryBonus(monster, kills)

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 border-4 border-white">
                <div className="bg-indigo-600 p-8 text-center text-white relative">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner border border-white/30">
                        <Trophy size={32} className="text-amber-300 animate-bounce" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Mastery Progress</h3>
                    <p className="text-indigo-100 text-[10px] font-bold mt-2 opacity-80 uppercase tracking-widest">{monster.name}</p>
                </div>

                <div className="p-8 bg-slate-50/50">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Target size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Total Defeated</p>
                                    <p className="text-lg font-black text-slate-700 leading-none">{kills} ตัว</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Rank</p>
                                <p className="text-lg font-black text-amber-500 leading-none">LV.{mastery.tier}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-3 italic">Reward Milestones</h4>
                            <MilestoneItem goal={10} currentKills={kills} monster={monster} />
                            <MilestoneItem goal={50} currentKills={kills} monster={monster} />
                            <MilestoneItem goal={100} currentKills={kills} monster={monster} />
                        </div>
                    </div>
                    <button onClick={onClose} className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
                        เข้าใจแล้ว
                    </button>
                </div>
            </div>
        </div>
    )
}