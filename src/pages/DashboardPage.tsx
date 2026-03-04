import { useGameStore } from '../store/useGameStore';
import { Trophy, Zap, Shield, Swords, Heart, History, Sparkles, Target } from 'lucide-react';
import { calculateFinalStats } from '../logic/stats';
import { StatCard } from '../components/dashboard/StatCard';
import { ElementSelector } from '../components/dashboard/ElementSelector';
import { QuickShop } from '../components/dashboard/QuickShop';
import { ELEMENT_CHART } from '../logic/elementalLogic';
import { ElementGuideModal } from '../components/ElementGuideModal';
import { useState } from 'react';

const ELEMENT_STYLES: Record<string, string> = {
    Fire: 'from-orange-500 to-rose-600',
    Water: 'from-blue-400 to-cyan-600',
    Earth: 'from-emerald-600 to-green-800',
    Wind: 'from-slate-400 to-sky-500',
    Light: 'from-amber-300 to-yellow-500',
    Dark: 'from-purple-600 to-indigo-900',
    Neutral: 'from-slate-400 to-slate-600'
};

export function DashboardPage() {
    const {
        player,
        equipped,
        monsterKills,
        battleLogs = [], // ป้องกันกรณี logs เป็น undefined
        setElement,
        buyItem,
        getEquippedSkillsWithIcons
    } = useGameStore();



    // ดึงสกิลที่สวมใส่อยู่
    const equippedSkills = getEquippedSkillsWithIcons();

    // ✅ คำนวณค่าพลังสุทธิรวมโบนัสทั้งหมดจาก logic/stats.ts
    const finalStats = calculateFinalStats(player, equipped, monsterKills, equippedSkills);

    const expPercentage = Math.min((player.exp / player.maxExp) * 100, 100);
    const masteredCount = Object.values(monsterKills).filter(kills => kills >= 10).length;

    // เช็คการ Regen โดยอิงจาก MaxHP สุทธิ
    const isRegenerating = player.hp < finalStats.maxHp;

    const [isElementModalOpen, setIsElementModalOpen] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* --- Section 1: Hero Profile --- */}
            {/* เปลี่ยนจาก bg-slate-900 เป็นพื้นหลังสีสว่างตามธาตุ พร้อมใส่ลูกเล่น Gradient */}
            <div className={`relative overflow-hidden rounded-[2.5rem] p-8 shadow-xl border-4 border-white transition-all duration-700
    ${player.element === 'Fire' ? 'bg-rose-50' :
                    player.element === 'Water' ? 'bg-sky-50' :
                        player.element === 'Earth' ? 'bg-emerald-50' : 'bg-slate-50'}`}>

                {/* ลายน้ำจางๆ ด้านหลัง (Decorative Background) */}
                <div className={`absolute -right-10 -bottom-10 h-64 w-64 rounded-full opacity-20 blur-3xl
        ${player.element === 'Fire' ? 'bg-rose-400' :
                        player.element === 'Water' ? 'bg-sky-400' :
                            player.element === 'Earth' ? 'bg-emerald-400' : 'bg-amber-400'}`}
                />

                <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-6">
                        {/* รูป Avatar */}
                        <div className="relative">
                            <div className={`h-20 w-20 rounded-3xl bg-gradient-to-tr ${ELEMENT_STYLES[player.element]} shadow-lg transition-all duration-500 ring-4 ring-white`} />
                            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 font-black text-slate-900 ring-4 ring-white shadow-md">
                                {player.level}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                {/* เปลี่ยนสีชื่อเป็น Slate-800 ให้อ่านง่ายบนพื้นสว่าง */}
                                <h2 className="text-2xl font-black tracking-tight text-slate-800">{player.name}</h2>
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white shadow-sm
                        ${player.element === 'Fire' ? 'bg-rose-500 text-white' :
                                        player.element === 'Water' ? 'bg-sky-500 text-white' :
                                            player.element === 'Earth' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'}`}>
                                    {player.element}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white/50 px-2 py-1 rounded-md border border-white/50">
                                    Rank: Bronze
                                </p>

                                {masteredCount > 0 && (
                                    <div className="flex items-center gap-1 bg-indigo-500 px-2 py-1 rounded-md text-[9px] font-black text-white border border-indigo-200 shadow-sm">
                                        <Target size={10} /> MASTERY x{masteredCount}
                                    </div>
                                )}

                                {/* 💰 ส่วนแสดง Gold ปรับให้ดูเด่นและแพงขึ้น */}
                                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-amber-200 shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-amber-600 tracking-wider">
                                        {player.gold.toLocaleString()} GOLD
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* EXP Bar ปรับสีให้สดใสขึ้นบนพื้นสว่าง */}
                    <div className="flex-1 max-w-xs bg-white/40 p-4 rounded-3xl border border-white/60 backdrop-blur-sm">
                        <div className="mb-2 flex justify-between text-[10px] font-black uppercase tracking-tighter text-slate-500">
                            <span>EXP Progress</span>
                            <span className="text-indigo-600">{player.exp} / {player.maxExp}</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-slate-200/50 p-0.5 shadow-inner">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 shadow-sm"
                                style={{ width: `${expPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Section 2: Element Selection (แถวเดี่ยวๆ กว้างๆ) --- */}
            <div className="w-full">
                <ElementSelector
                    currentElement={player.element}
                    onSelect={setElement}
                    onOpenGuide={() => setIsElementModalOpen(true)}
                />
            </div>

            {/* --- Section 3: Final Stats Display --- */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard
                    icon={<Heart className={`text-rose-500 ${isRegenerating ? 'animate-pulse' : ''}`} />}
                    label="HP"
                    value={`${Math.floor(player.hp)} / ${finalStats.maxHp}`}
                    baseValue={finalStats.baseMaxHp}
                    bonus={finalStats.bonusHp}
                    color="rose"
                    isRegen={isRegenerating}
                />

                <StatCard
                    icon={<Swords className="text-amber-500" />}
                    label="ATK"
                    value={finalStats.atk}
                    baseValue={finalStats.baseAtk}
                    bonus={finalStats.bonusAtk}
                    color="amber"
                />

                <StatCard
                    icon={<Shield className="text-emerald-500" />}
                    label="DEF"
                    value={finalStats.def}
                    baseValue={finalStats.baseDef}
                    bonus={finalStats.bonusDef}
                    color="emerald"
                />

                <StatCard
                    icon={<Trophy className="text-sky-500" />}
                    label="Gold"
                    value={player.gold.toLocaleString()}
                    color="sky"
                />
            </div>

            {/* --- Section 4: Skills & History --- */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Equipped Skills */}
                <div className="space-y-3">
                    <h3 className="px-2 text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Zap size={16} /> Equipped Skills
                    </h3>
                    {equippedSkills.length > 0 ? (
                        equippedSkills.map(skill => {
                            const hasSynergy = player.element === skill.element;
                            return (
                                <div
                                    key={skill.id}
                                    className={`flex items-center justify-between gap-4 rounded-2xl p-3 border transition-all shadow-sm
                                        ${hasSynergy ? 'bg-indigo-50 border-indigo-200' : 'bg-emerald-50 border-emerald-100'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`grid h-10 w-10 place-items-center rounded-xl text-white shadow-sm
                                            ${hasSynergy ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                                            <skill.Icon size={20} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                                {skill.name}
                                                {hasSynergy && <Sparkles size={12} className="text-indigo-500 animate-pulse" />}
                                            </div>
                                            <div className="text-[10px] font-medium text-slate-500/80 line-clamp-1">
                                                {skill.description}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest 
                                        ${hasSynergy ? 'text-indigo-600 bg-indigo-100' : 'text-emerald-600 bg-emerald-100'}`}>
                                        {hasSynergy ? 'Synergy' : 'Active'}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-8 text-center text-sm text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            ยังไม่ได้ติดตั้งสกิล
                        </div>
                    )}
                </div>

                {/* Battle Logs */}
                <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-100 h-fit">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-800">
                        <History className="text-indigo-500" size={20} />
                        Recent Battle Logs
                    </h3>
                    <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                        {battleLogs.length > 0 ? (
                            [...battleLogs].slice(-6).reverse().map((log, i) => (
                                <div key={i} className="text-[11px] font-bold text-slate-500 flex items-start gap-2 border-l-2 border-slate-100 pl-3 py-1.5 leading-tight">
                                    <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-slate-300" />
                                    {log.text}
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-sm text-slate-400 italic">
                                ยังไม่มีประวัติการต่อสู้
                            </div>
                        )}
                    </div>
                </div>



            </div>

            {/* Element Guide Modal */}
            {isElementModalOpen && (
                <ElementGuideModal
                    onClose={() => setIsElementModalOpen(false)}
                    elementChart={ELEMENT_CHART}
                />
            )}

            {/* --- Section 3: Quick Shop (แยกมาเป็นอีกแถว หรือไปวางที่อื่น) --- */}
            <div className="w-full mt-6">
                <QuickShop onBuy={buyItem} />
            </div>

        </div>


    );
}