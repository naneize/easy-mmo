import { CheckCircle2 } from 'lucide-react'
import type { MonsterData } from '../../types/game'
import { getMasteryBonus } from '../../utils/gameHelpers'
import { useTranslation } from 'react-i18next'

interface MilestoneItemProps {
    goal: number;
    currentKills: number;
    monster: MonsterData;
}

export function MilestoneItem({ goal, currentKills, monster }: MilestoneItemProps) {
    const { t } = useTranslation()
    const isReached = currentKills >= goal

    // ใช้ getMasteryBonus เพื่อคำนวณค่าที่ถูกต้องตาม tier
    const mastery = getMasteryBonus(monster, goal)
    const bonusAmount = mastery.value
    const isPercent = mastery.isPercent
    const rawType = monster.masteryBonus?.type ?? 'Stat'

    const formatType = (type: string) => (type === 'maxHp' ? 'HP' : type.toUpperCase());
    const formatBonus = (value: number, isPercent: boolean) => {
        if (isPercent) {
            return `${(value * 100).toFixed(1)}%`
        }
        return value.toString()
    }

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
                    {t('milestoneItem.defeated', { count: goal })}
                </span>
            </div>
            <div className={`text-[11px] font-black px-3 py-1 rounded-lg ${isReached ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}>
                +{formatBonus(bonusAmount, isPercent)} {formatType(rawType)}
            </div>
        </div>
    )
}