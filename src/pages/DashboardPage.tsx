import { useGameStore } from '../store/useGameStore';
import { Trophy, Zap, Shield, Swords, Heart, History, Sparkles, Target, Coins } from 'lucide-react';
import { calculateFinalStats } from '../logic/stats';
import { calculatePlayerClass } from '../utils/gameHelpers';
import { StatCard } from '../components/dashboard/StatCard';
import { ElementSelector } from '../components/dashboard/ElementSelector';
import { ELEMENT_CHART } from '../logic/elementalLogic';
import { ElementGuideModal } from '../components/ElementGuideModal';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

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
    const { t } = useTranslation();
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

    const playerClass = calculatePlayerClass(equippedSkills);

    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [showClassUnlocked, setShowClassUnlocked] = useState(false);
    const prevClassIdRef = useRef<string | null>(null);

    useEffect(() => {
        const prev = prevClassIdRef.current;
        const next = playerClass?.id || null;
        prevClassIdRef.current = next;

        if (!prev && next) {
            setShowClassUnlocked(true);
            const t = window.setTimeout(() => setShowClassUnlocked(false), 2500);
            return () => window.clearTimeout(t);
        }

        return;
    }, [playerClass?.id]);

    const formattedClassBonuses = useMemo(() => {
        const bonus = playerClass?.bonus;
        if (!bonus) return [] as Array<{ label: string; value: string }>;

        const entries = Object.entries(bonus).filter(([, v]) => typeof v === 'number' && v !== 0);

        const labelMap: Record<string, string> = {
            atk_flat: 'ATK +',
            atk_percent: 'ATK %',
            def_flat: 'DEF +',
            def_percent: 'DEF %',
            hp_mod: 'Max HP +',
            hp_percent: 'Max HP %',
            lifesteal_percent: 'Lifesteal %',
            crit_chance: 'Crit Chance %',
            crit_multi: 'Crit Damage +',
            armor_pen: 'Armor Pen %',
            dmgReduction: 'Damage Reduction %',
            gold_bonus: 'Gold Bonus %'
        };

        const percentKeys = new Set(['atk_percent', 'def_percent', 'hp_percent', 'lifesteal_percent', 'crit_chance', 'armor_pen', 'dmgReduction', 'gold_bonus']);

        const toDisplay = (key: string, raw: number) => {
            if (percentKeys.has(key)) return `${(raw * 100).toFixed(0)}%`;
            return `${Math.floor(raw)}`;
        };

        return entries.map(([k, v]) => ({
            label: labelMap[k] || k,
            value: toDisplay(k, v as number)
        }));
    }, [playerClass]);

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
                            <div className={`h-20 w-20 rounded-3xl bg-linear-to-tr ${ELEMENT_STYLES[player.element]} shadow-lg transition-all duration-500 ring-4 ring-white`} />
                            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 font-black text-slate-900 ring-4 ring-white shadow-md">
                                {player.level}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                {/* เปลี่ยนสีชื่อเป็น Slate-800 ให้อ่านง่ายบนพื้นสว่าง */}
                                <button
                                    type="button"
                                    onClick={() => setIsClassModalOpen(true)}
                                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white shadow-sm transition-all ${playerClass ? 'bg-fuchsia-600 text-white hover:bg-fuchsia-700' : 'bg-slate-300 text-slate-700 hover:bg-slate-400'} ${showClassUnlocked ? 'animate-pulse' : ''}`}
                                >
                                    {playerClass
                                        ? t(playerClass.nameKey) // ✅ ใช้ nameKey ที่เราตั้งไว้ใน ClassDefinition
                                        : t('ui.novice')         // ✅ ถ้าไม่มีคลาส ให้ดึงคำว่า Novice จากหมวด UI
                                    }
                                </button>
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white shadow-sm
                        ${player.element === 'Fire' ? 'bg-rose-500 text-white' :
                                        player.element === 'Water' ? 'bg-sky-500 text-white' :
                                            player.element === 'Earth' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'}`}>
                                    {player.element}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-2">

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
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <StatCard
                    icon={<Heart className={`text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.6)] ${isRegenerating ? 'animate-pulse' : ''}`} />}
                    label="HP"
                    value={`${Math.floor(player.hp)} / ${finalStats.maxHp}`}
                    baseValue={finalStats.baseMaxHp}
                    bonus={finalStats.bonusHp}
                    color="rose"
                    isRegen={isRegenerating}
                />

                <StatCard
                    icon={<Swords className="text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.6)]" />}
                    label="ATK"
                    value={finalStats.atk}
                    baseValue={finalStats.baseAtk}
                    bonus={finalStats.bonusAtk}
                    color="amber"
                />

                <StatCard
                    icon={<Shield className="text-emerald-300 drop-shadow-[0_0_8px_rgba(110,231,183,0.6)]" />}
                    label="DEF"
                    value={finalStats.def}
                    baseValue={finalStats.baseDef}
                    bonus={finalStats.bonusDef}
                    color="emerald"
                />

                <StatCard
                    icon={<Coins className="text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]" />}
                    label="Gold"
                    value={player.gold.toLocaleString()}
                    color="amber" // เปลี่ยนเป็น amber เพื่อให้ได้โทนเหลืองสว่าง
                />

                <StatCard
                    icon={<Target className="text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]" />}
                    label="Crit Chance"
                    value={`${(finalStats.critChance * 100).toFixed(1)}%`}
                    baseValue={`${(finalStats.baseCritChance * 100).toFixed(1)}%`}
                    bonus={finalStats.bonusCritChance}
                    color="red"
                />

                <StatCard
                    icon={<Zap className="text-orange-300 drop-shadow-[0_0_8px_rgba(253,186,116,0.6)]" />}
                    label="Crit Damage"
                    value={`${finalStats.critDamage.toFixed(2)}x`}
                    baseValue={`${finalStats.baseCritDamage.toFixed(2)}x`}
                    bonus={finalStats.bonusCritDamage}
                    color="orange"
                />
            </div>

            {/* --- Section 4: Skills & History --- */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Equipped Skills */}
                <div className="space-y-3">
                    <h3 className="px-2 text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                        {t('ui.equipped_skills')}
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
                                                {t(skill.nameKey)}
                                                {hasSynergy && <Sparkles size={12} className="text-indigo-500 animate-pulse" />}
                                            </div>
                                            <div className="text-[10px] font-medium text-slate-500/80 line-clamp-1">
                                                {t(skill.descriptionKey)}
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
                            {t('ui.no_skills_equipped')}
                        </div>
                    )}
                </div>

                {/* Battle Logs */}
                <div className="rounded-4xl bg-white p-6 shadow-sm border border-slate-100 h-fit">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-800">
                        <History className="text-indigo-500" size={20} />
                        {t('ui.recent_battle_logs')}
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
                                {t('ui.noBattleLogs')}
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

            {isClassModalOpen && (
                <div
                    className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setIsClassModalOpen(false)}
                >
                    <div
                        className="w-full max-w-[420px] rounded-[2rem] bg-white border-4 border-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`p-6 text-white relative overflow-hidden ${playerClass ? 'bg-gradient-to-br from-fuchsia-600 to-indigo-700' : 'bg-gradient-to-br from-slate-600 to-slate-800'}`}>
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Current Class</div>
                            <div className="mt-1 text-3xl font-black tracking-tighter">{playerClass
                                ? t(playerClass.nameKey)
                                : t('ui.novice')
                            }</div>
                            <button
                                type="button"
                                className="mt-4 w-full rounded-2xl bg-white/15 hover:bg-white/20 border border-white/30 px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all"
                                onClick={() => setIsClassModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>

                        <div className="p-6">
                            {playerClass ? (
                                <div className="space-y-3">
                                    <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">Bonuses</div>
                                    <div className="space-y-2">
                                        {formattedClassBonuses.length > 0 ? (
                                            formattedClassBonuses.map((b) => (
                                                <div key={b.label} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                                                    <div className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{b.label}</div>
                                                    <div className="text-[12px] font-black text-fuchsia-700">+{b.value}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-[11px] font-bold text-slate-500">
                                                No bonuses
                                            </div>
                                        )}
                                    </div>
                                    {/* ✨ เพิ่มส่วนนี้เข้าไปต่อท้ายรายการโบนัสปกติ */}
                                    {playerClass.id === 'mercenary' && (
                                        <div className="flex flex-col gap-1 rounded-2xl border-2 border-rose-100 bg-rose-50/50 px-4 py-3 mt-2 animate-in slide-in-from-bottom-2 duration-500">
                                            <div className="flex items-center justify-between">

                                                {/* ถ้ามี logic เช็คอาวุธ สามารถเปลี่ยนสีป้ายนี้ได้ */}
                                                <span className="text-[8px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded-full">SPECIAL</span>
                                            </div>
                                            <div className="text-[12px] font-medium text-rose-800/80 leading-relaxed">
                                                Increases Attack by <span className="font-black text-rose-600">+15%</span> when
                                                <span className="underline decoration-rose-400/50 underline-offset-2"> Sword</span> is equipped.
                                            </div>
                                        </div>
                                    )}

                                    {(playerClass.specialEffect || playerClass.elementAffinity) && (
                                        <div className="pt-4 space-y-3">
                                            {playerClass.specialEffect && (
                                                <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Special Effect</div>
                                                    <div className="mt-1 text-[12px] font-black text-slate-800">{playerClass.specialEffect.name}</div>
                                                    <div className="mt-1 text-[11px] font-bold text-slate-600 leading-snug">{playerClass.specialEffect.description}</div>
                                                </div>
                                            )}

                                            {/* ✨ 2. เพิ่มส่วนนี้: ตรวจสอบและแสดงผล Weapon Mastery ที่กำลังทำงานอยู่ */}
                                            {playerClass.id === 'mercenary' && (
                                                <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 animate-in fade-in slide-in-from-top-1 duration-300">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-rose-400 italic">Weapon Mastery</div>
                                                        {/* เช็คว่าใส่ดาบอยู่จริงๆ ไหม (Optionally: ถ้าอยากให้โชว์แค่ตอนใส่ดาบ) */}
                                                        <span className="text-[8px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-black animate-pulse">ACTIVE</span>
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <span className="text-lg">⚔️</span>
                                                        <div>
                                                            <div className="text-[12px] font-black text-rose-900 leading-none">Sword Mastery</div>
                                                            <div className="text-[10px] font-bold text-rose-700/80 mt-1">
                                                                ได้รับ ATK +15% จากการใช้ดาบ
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {playerClass.elementAffinity && (
                                                <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Element Affinity</div>
                                                    <div className="mt-2 space-y-2">
                                                        {typeof playerClass.elementAffinity.advantageMultiplier === 'number' && (
                                                            <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                                                                <div className="text-[11px] font-black text-indigo-800 uppercase tracking-wider">โบนัสเมื่อชนะทาง</div>
                                                                <div className="text-[12px] font-black text-indigo-800">x{playerClass.elementAffinity.advantageMultiplier.toFixed(2)}</div>
                                                            </div>
                                                        )}

                                                        {typeof playerClass.elementAffinity.disadvantageDamageTakenMultiplier === 'number' && (
                                                            <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                                                                <div className="text-[11px] font-black text-emerald-800 uppercase tracking-wider">ลดความเสียหายเมื่อแพ้ทาง</div>
                                                                <div className="text-[12px] font-black text-emerald-800">x{playerClass.elementAffinity.disadvantageDamageTakenMultiplier.toFixed(2)}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
                                    {/* 1. แก้ไขหัวข้อ "No Class Yet" */}
                                    <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                                        {t('ui.novice', { lng: 'en' })} {/* หรือใช้คำว่า 'No Class Yet' ใน JSON ก็ได้ */}
                                    </div>

                                    {/* 2. แก้ไขคำแนะนำการปลดล็อกคลาส */}
                                    <div className="mt-1 text-[12px] font-bold text-slate-600">
                                        {t('ui.classUnlockHint')}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}