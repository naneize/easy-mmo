import { useState } from 'react'
import { Heart, Swords, Shield, Coins, Sparkles, Trophy, Gift, Target, Zap } from 'lucide-react'
import type { MonsterData } from '../../types/game'
import { useGameStore } from '../../store/useGameStore'
import { getMasteryBonus } from '../../utils/gameHelpers'
import { initializeMonster } from '../../data/monsters'
import { StatItem } from './StatItem'
import { MasteryDetailsModal } from './MasteryDetailsModal'
import { DropDetailModal } from './DropDetailModal';

const ELEMENT_COLORS: Record<string, string> = {
    Fire: 'text-orange-500 bg-orange-50 border-orange-100',
    Water: 'text-blue-500 bg-blue-50 border-blue-100',
    Earth: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    Wind: 'text-sky-500 bg-sky-50 border-sky-100',
    Light: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    Dark: 'text-purple-600 bg-purple-50 border-purple-200',
    Neutral: 'text-slate-500 bg-slate-50 border-slate-100',
}

interface MonsterCardProps {
    monster: MonsterData;
    onBattle: (m: MonsterData) => void;
    isProcessing?: boolean;
}

export function MonsterCard({ monster, onBattle, isProcessing }: MonsterCardProps) {
    const { monsterKills } = useGameStore()
    const [showMasteryModal, setShowMasteryModal] = useState(false)
    const [showDropModal, setShowDropModal] = useState(false);

    const kills = monsterKills[monster.id] || 0
    const mastery = getMasteryBonus(monster, kills)
    const nextGoal = kills < 10 ? 10 : kills < 50 ? 50 : 100
    const progress = Math.min((kills / nextGoal) * 100, 100)
    const bonusType = monster.masteryBonus?.type ?? 'Stat'

    const formatType = (type: string) => (type === 'maxHp' ? 'HP' : type.toUpperCase());
    const formatBonus = (value: number, isPercent: boolean) => {
        if (isPercent) {
            return `${(value * 100).toFixed(1)}%`
        }
        return value.toString()
    }

    // คำนวณ stats จากระบบใหม่
    const initializedMonster = initializeMonster(monster)

    return (
        <>
            <div className={`bg-white rounded-[2.5rem] p-6 border-2 border-slate-50 shadow-sm transition-all flex flex-col group relative overflow-hidden 
                ${isProcessing
                    ? 'animate-monster-shake border-indigo-200 shadow-indigo-100'
                    : 'hover:shadow-xl hover:-translate-y-1'}`}>

                {/* ⚔️ Battle Visual Effects (Enhanced) */}
                {isProcessing && (
                    <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center overflow-hidden">
                        {/* Flash Effect ท้ายจังหวะ */}
                        <div className="absolute inset-0 bg-white animate-battle-flash z-10" />

                        {/* รอยดาบที่ 1 (เฉือนลง) */}
                        <div
                            className="absolute w-[150%] h-3 bg-white shadow-[0_0_30px_#fff] animate-slash-hit"
                            style={{ '--slash-rotate': '-45deg' } as any}
                        />

                        {/* รอยดาบที่ 2 (เฉือนสวน - หน่วงเวลาเล็กน้อย) */}
                        <div
                            className="absolute w-[150%] h-2 bg-indigo-300 shadow-[0_0_20px_#818cf8] animate-slash-hit [animation-delay:0.15s]"
                            style={{ '--slash-rotate': '45deg' } as any}
                        />

                        {/* Impact Spark (จุดปะทะตรงกลาง) */}
                        <div className="absolute w-20 h-20 bg-white rounded-full blur-xl animate-pulse scale-150 opacity-20" />
                    </div>
                )}

                {/* Mastery Level Badge */}
                {mastery.tier > 0 && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 animate-in slide-in-from-top-4">
                        <div className="bg-gradient-to-b from-amber-400 to-orange-500 text-white px-5 py-1.5 rounded-b-3xl text-[10px] font-black shadow-md flex items-center gap-1.5 min-w-[120px] justify-center border-x border-b border-white/20">
                            <Trophy size={12} className="drop-shadow-sm" />
                            <span className="tracking-widest">MASTER LV.{mastery.tier}</span>
                        </div>
                    </div>
                )}



                {/* 4. เรียกใช้ Modal */}
                {showDropModal && (
                    <DropDetailModal
                        monster={monster}
                        onClose={() => setShowDropModal(false)}
                    />
                )}

                {/* Header Info */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <h4 className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                            {monster.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border shadow-sm ${ELEMENT_COLORS[monster.element]}`}>
                                {monster.element}
                            </span>
                            <span className="flex items-center bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md shadow-sm">
                                <span className="text-[9px] font-black text-indigo-400 mr-0.5 tracking-tighter">LV.</span>
                                <span className="text-[11px] font-black text-indigo-700 tracking-tight">
                                    {monster.level}
                                </span>
                            </span>
                        </div>
                    </div>



                    <div className="flex flex-col gap-1 items-end">
                        {/* EXP Badge */}
                        <div className="bg-amber-50 text-amber-600 px-2 py-1 rounded-xl border border-amber-100 flex items-center gap-1 text-[10px] font-black shadow-sm">
                            <Sparkles size={10} />
                            <span>+{initializedMonster.exp} EXP</span>
                        </div>

                        {/* GOLD Badge */}
                        <div className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded-xl border border-yellow-100 flex items-center gap-1 text-[10px] font-black shadow-sm">
                            <Coins size={10} />
                            <span>+{monster.gold} GOLD</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowDropModal(true);
                    }}
                    // เพิ่ม justify-center และปรับ w-full (ถ้าอยากให้เต็มกรอบ) หรือกำหนดความกว้างคงที่
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 w-full rounded-xl bg-amber-50 text-amber-500 hover:bg-amber-100 transition-all shadow-sm border border-amber-200 group/btn"
                    title="View Drops"
                >
                    <Gift size={12} className="group-hover/btn:scale-110 transition-transform flex-shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-tight">View Drop</span>
                </button>


                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4 relative z-10">
                    <StatItem icon={<Heart size={14} className="text-rose-500" />} label="HP" value={initializedMonster.hp} color="bg-rose-50/50" />
                    <StatItem icon={<Swords size={14} className="text-slate-600" />} label="ATK" value={initializedMonster.atk} color="bg-slate-50/50" />
                    <StatItem icon={<Shield size={14} className="text-blue-500" />} label="DEF" value={initializedMonster.def} color="bg-blue-50/50" />
                    <StatItem icon={<Target size={14} className="text-purple-500" />} label="CRIT" value={`${(initializedMonster.critChance * 100).toFixed(1)}%`} color="bg-purple-50/50" />
                    <div className="col-span-2 grid grid-cols-2 gap-2">
                        <StatItem icon={<Zap size={14} className="text-yellow-500" />} label="CRIT DMG" value={`${initializedMonster.critDamage.toFixed(1)}x`} color="bg-yellow-50/50" />

                    </div>
                </div>

                {/* Mastery Progress */}
                <div onClick={() => setShowMasteryModal(true)} className="mb-6 p-4 bg-slate-50 rounded-[2rem] border border-slate-100 cursor-pointer hover:bg-indigo-50 transition-all group/mastery shadow-inner relative z-10">
                    <div className="flex justify-between items-end mb-2 text-[9px] font-black uppercase tracking-widest">
                        <span className="text-slate-400 group-hover/mastery:text-indigo-500">Mastery Progress</span>
                        <span className="text-slate-600">{kills} / {nextGoal}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-white">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700" style={{ width: `${progress}%` }} />
                    </div>
                    {monster.masteryBonus && (
                        <div className="mt-3 flex items-center gap-2">
                            <div className={`p-1 rounded-lg ${mastery.tier > 0 ? 'bg-white text-indigo-600 shadow-sm' : 'bg-slate-200 text-slate-400'}`}>
                                {bonusType === 'atk' ? <Swords size={10} /> : bonusType === 'def' ? <Shield size={10} /> : <Heart size={10} />}
                            </div>
                            <span className={`text-[10px] font-black ${mastery.tier > 0 ? 'text-indigo-600' : 'text-slate-400'}`}>
                                Bonus: +{formatBonus(mastery.value, mastery.isPercent)} {formatType(bonusType)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Battle Button with Action Gauge */}
                <button
                    disabled={isProcessing}
                    onClick={() => onBattle(monster)}
                    className={`relative mt-auto w-full py-4 rounded-[2rem] font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 overflow-hidden
                        ${isProcessing
                            ? 'bg-slate-800 text-indigo-200 cursor-not-allowed'
                            : 'bg-slate-900 text-white hover:bg-indigo-600 active:scale-95 shadow-indigo-100'}`}
                >
                    {isProcessing ? (
                        <>
                            {/* Action Gauge พื้นหลัง */}
                            <div className="absolute inset-0 bg-indigo-500/30 animate-battle-progress origin-left" />
                            <span className="relative z-10 flex items-center gap-2 italic">
                                ⚔️ กำลังตะลุมบอน...
                            </span>
                        </>
                    ) : (
                        <span className="flex items-center gap-2">เริ่มการต่อสู้ ⚔️</span>
                    )}
                </button>
            </div>

            {showMasteryModal && (
                <MasteryDetailsModal monster={monster} kills={kills} onClose={() => setShowMasteryModal(false)} />
            )}
        </>
    )
}