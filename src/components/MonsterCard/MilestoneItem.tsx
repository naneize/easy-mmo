import { CheckCircle2 } from 'lucide-react'
import type { MonsterData } from '../../types/game'

interface MilestoneItemProps {
    goal: number;
    currentKills: number;
    monster: MonsterData;
    tierMultiplier: number;
}

export function MilestoneItem({ goal, currentKills, monster, tierMultiplier }: MilestoneItemProps) {
    const isReached = currentKills >= goal
    const baseVal = monster.masteryBonus?.valuePerTier ?? 0
    const rawType = monster.masteryBonus?.type ?? 'Stat'
    const bonusAmount = baseVal * tierMultiplier

    const formatType = (type: string) => (type === 'maxHp' ? 'HP' : type.toUpperCase());

    return (
        <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${isReached ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-slate-100 opacity-60'
            }`}>
            <div className="flex items-center gap-3">
                {isReached ? (
                    <div className="bg-emerald-500 p-0.5 rounded-full shadow-sm">
                        <CheckCircle2 size={16} className="text-white" />
                    </div>
                ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center text-[9px] font-black text-slate-300">
                        {goal === 10 ? 1 : goal === 50 ? 2 : 3}
                    </div>
                )}
                <span className={`text-[11px] font-black ${isReached ? 'text-emerald-700' : 'text-slate-500'}`}>
                    ปราบครบ {goal} ตัว
                </span>
            </div>
            <div className={`text-[11px] font-black px-3 py-1 rounded-lg ${isReached ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}>
                +{bonusAmount} {formatType(rawType)}
            </div>
        </div>
    )
}