import { Trophy, Sparkles, ArrowRight, XCircle, Target, Heart, Gift } from 'lucide-react'
import { useGameStore } from '../store/useGameStore'
import { MONSTERS } from '../data/monsters'
import { getMasteryBonus } from '../utils/gameHelpers'
import { INITIAL_SKILLS } from '../store/skills';
import type { Skill } from '../types/game';
import { calculateFinalStats } from '../logic/stats';
import { useTranslation } from 'react-i18next';

export function BattleResultModal() {
    const { t } = useTranslation();
    const { lastBattleResult,
        clearBattleResult,
        monsterKills,
        player,
        equipped,
        getEquippedSkillsWithIcons } = useGameStore();

    // 2. Validation เช็คผลการต่อสู้ล่าสุด
    if (!lastBattleResult) return null;

    const {
        won,
        expEarned,
        goldEarned,
        isLevelUp,
        monsterId,
        monsterName,
        droppedSkillIds
    } = lastBattleResult;

    // #region --- Logic: Mastery & HP Calculation ---

    // 1. คำนวณ Mastery Bonus (โบนัสจากการฆ่ามอนสเตอร์)
    let masteryHpBonus = 0;
    MONSTERS.forEach(m => {
        const kills = monsterKills[m.id] || 0;
        [10, 50, 100].forEach(milestone => {
            if (kills >= milestone) {
                const b = getMasteryBonus(m, milestone);
                if (b && b.type === 'maxHp') masteryHpBonus += b.value;
            }
        });
    });

    // 2. คำนวณ Skill Bonus (ส่วนที่ขาดไป 50 จนทำให้ได้ 315 แทนที่จะเป็น 365)
    // เราต้องเช็คสกิล Vitality และบวกเพิ่มเข้าไปให้ครบ
    let skillHpBonus = 0;
    const vitalitySkill = player.skills?.find(s => s.id === 'vitality' || s.name === 'Vitality');
    if (vitalitySkill) {
        // ถ้าขาด 50 และสกิลเลเวล 10 แสดงว่าต้องคูณ 5 (10 * 5 = 50)
        // ถ้าคุณอัปสกิลเพิ่มแล้วเลขยังไม่ถึง 365 ให้ปรับเลข 5 เป็นเลขโบนัสจริงของเกมคุณครับ
        skillHpBonus = (vitalitySkill.level || 0) * 5;
    }

    // 1. คำนวณค่าพลังสุทธิโดยใช้ฟังก์ชันเดียวกับ Dashboard
    const equippedSkills = getEquippedSkillsWithIcons();
    const finalStats = calculateFinalStats(player, equipped, monsterKills, equippedSkills);

    // 2. ใช้ค่าจาก finalStats โดยตรง (ไม่ต้อง + โบนัสเองแล้ว)
    const realMaxHp = finalStats.maxHp;

    // 3. คำนวณความคืบหน้าต่างๆ
    const hpPercentage = Math.max(0, Math.min(100, (player.hp / realMaxHp) * 100));
    const playerExpProgress = Math.min((player.exp / player.maxExp) * 100, 100);

    // ส่วน Mastery Tracker (คงไว้เหมือนเดิม)
    const currentKills = monsterKills[monsterId || ''] || 0;
    const getNextGoal = (kills: number) => {
        if (kills < 10) return 10;
        if (kills < 50) return 50;
        return 100;
    };
    const nextGoal = getNextGoal(currentKills);
    const progress = Math.min((currentKills / nextGoal) * 100, 100);
    const droppedSkills = (droppedSkillIds || [])
        .map(id => INITIAL_SKILLS.find(s => s.id === id))
        .filter((skill): skill is Skill => skill !== undefined);

    // #endregion

    const handleClose = () => {
        clearBattleResult();
    };

    const monster = MONSTERS.find(m => m.id === monsterId);
    const baseGold = monster?.gold || 0;
    const baseExp = monster?.exp || 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
            {/* ปรับ max-h ให้ไม่เกิน 90% ของหน้าจอ และให้เลื่อนได้ข้างใน */}
            <div className="bg-white rounded-[2.5rem] w-full max-w-[340px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-4 border-white animate-in zoom-in-95 duration-300">

                {/* --- Header Section (Fixed) --- */}
                <div className={`shrink-0 p-6 text-center relative overflow-hidden ${won ? 'bg-amber-400' : 'bg-slate-400'}`}>
                    <div className="absolute inset-0 opacity-10 pointer-events-none flex flex-wrap gap-4 p-2 rotate-12">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <Trophy key={i} size={20} />
                        ))}
                    </div>

                    <div className="relative z-10">
                        <div className="inline-flex p-3 rounded-full bg-white/30 mb-2 shadow-inner">
                            {won ? <Trophy size={32} className="text-white" /> : <XCircle size={32} className="text-white" />}
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
                            {won ? t('battleResult.victory') : t('battleResult.defeated')}
                        </h2>
                        {isLevelUp && (
                            <div className="mt-1 inline-block bg-white text-amber-500 px-3 py-0.5 rounded-full text-[9px] font-black uppercase animate-bounce shadow-sm">
                                {t('battleResult.levelUp')} ✨
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Content Section (Scrollable) --- */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">

                    {/* Status Bars */}
                    <div className="space-y-2.5 bg-slate-50 p-4 rounded-[2rem] border border-slate-100">
                        <div>
                            <div className="flex justify-between items-center mb-1 px-1">
                                <div className="flex flex-col">

                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter leading-none mb-1">
                                        {t('global.level')} {player.level}
                                    </span>

                                </div>
                                <div className="flex items-center gap-1">
                                    <Heart size={10} className="text-rose-500 fill-rose-500" />
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('battleResult.health')}</span>
                                </div>
                                <span className="text-[9px] font-black text-rose-600">
                                    {Math.floor(player.hp)} / {realMaxHp}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white rounded-full p-0.5 border border-rose-100">
                                <div className="h-full bg-rose-500 rounded-full transition-all duration-1000" style={{ width: `${hpPercentage}%` }} />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1 px-1">
                                <div className="flex items-center gap-1">
                                    <Sparkles size={10} className="text-amber-500" />
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('battleResult.experience')}</span>
                                </div>
                                <span className="text-[9px] font-black text-amber-600">
                                    {player.exp} / {player.maxExp}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-white rounded-full p-0.5 border border-amber-100">
                                <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: `${playerExpProgress}%` }} />
                            </div>
                        </div>
                    </div>

                    {won ? (
                        <div className="space-y-4">
                            {/* Rewards Grid */}
                            <div className="grid grid-cols-2 gap-2">
                                {/* ช่อง EXP - โชว์แค่ยอดรวมปกติ เพราะยังไม่มี Bonus */}
                                <div className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-sm text-center">
                                    <div className="text-xl font-black text-slate-800">+{expEarned.toLocaleString()}</div>
                                    <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{t('global.exp')}</div>
                                </div>

                                {/* ช่อง GOLD - โชว์ Bonus เฉพาะตอนที่ได้รับเพิ่มจริงเท่านั้น */}
                                <div className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-sm text-center">
                                    <div className="text-xl font-black text-slate-800">+{goldEarned.toLocaleString()}</div>
                                    <div className="flex items-center justify-center gap-1">
                                        <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{t('global.gold')}</div>

                                        {/* เงื่อนไข: ต้องได้มากกว่าฐาน "และ" ฐานต้องไม่เป็น 0 */}
                                        {goldEarned > baseGold && baseGold > 0 && (
                                            <div className="text-[7px] font-black text-emerald-500 bg-emerald-50 px-1 rounded-sm animate-bounce-short">
                                                (+{goldEarned - baseGold})
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Dropped Skills */}
                            {droppedSkills.length > 0 && (
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-1.5 px-1">
                                        <Gift size={12} className="text-emerald-500" />
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{t('battleResult.lootDiscovered')}</span>
                                    </div>
                                    {droppedSkills.map(skill => (
                                        <div key={skill?.id} className="flex items-center gap-3 p-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in slide-in-from-left-4">
                                            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm shrink-0">
                                                {typeof skill?.Icon === 'string' ? skill.Icon : skill?.Icon ? <skill.Icon size={16} className="text-emerald-500" /> : "✨"}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[11px] font-black text-emerald-900 truncate">{skill?.name}</span>
                                                <span className="text-[8px] font-bold text-emerald-600/70 uppercase leading-none">{t('battleResult.newSkill')}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Mastery Tracker */}
                            <div className="bg-indigo-50/50 p-4 rounded-[2rem] border border-indigo-100/50 shadow-inner">
                                <div className="flex justify-between items-center mb-1.5">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <div className="p-1 bg-indigo-600 rounded text-white shrink-0">
                                            <Target size={12} />
                                        </div>
                                        <span className="text-[10px] font-black text-indigo-900 truncate uppercase tracking-tighter">{t('battleResult.mastery')}: {t(`monsters.${monsterId}.name`)}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-indigo-600 shrink-0">
                                        {currentKills}/{nextGoal}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-indigo-50 p-0.5">
                                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-4 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                            <p className="text-center text-slate-400 font-medium italic text-xs leading-relaxed px-4">
                                "{t('battleResult.defeatMessage')}"
                            </p>
                        </div>
                    )}
                </div>

                {/* --- Action Button (Fixed) --- */}
                <div className="p-6 pt-2 shrink-0 bg-white">
                    <button
                        onClick={handleClose}
                        className={`w-full py-4 rounded-[1.5rem] font-black text-base shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 group
                        ${won ? 'bg-slate-900 text-white hover:bg-indigo-600' : 'bg-white border-2 border-slate-200 text-slate-600'}`}
                    >
                        {won ? t('battleResult.continue') : t('battleResult.backToCamp')}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    )
}