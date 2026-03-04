import type { Entity, MonsterData, BattleEffect } from '../../../types/game';
import type { GameItem } from '../../../data/items';
import { calculateInitialStats } from '../statsCalculator';
import { processConstantSkills } from '../skillProcessor';
import { initializeMonster } from '../../../data/monsters';



export const prepareBattleContext = (
    player: Entity,
    monsterData: MonsterData,
    equippedSkills: BattleEffect[],
    killCount: number
) => {

    const monster = initializeMonster(monsterData);

    // รวมรายการ Effects ทั้งหมด
    const equipmentList = Object.values(player.equipment).filter((item): item is GameItem => item !== null);
    const allEffects: BattleEffect[] = [...equippedSkills, ...equipmentList];

    // คำนวณค่า Mastery และธาตุ
    const { mastery, masteryBonusStats, pElementMult, mElementMult } = calculateInitialStats(player, monster, killCount);

    // ประมวลผล Passive/Constant
    const { bonusStats, skillLogs: constantSkillLogs } = processConstantSkills(allEffects, player, monster, masteryBonusStats.def);

    // พลังโจมตีพื้นฐาน (ก่อนเช็คเงื่อนไข Dynamic เช่น Frenzy)
    const baseEffectiveAtk = ((player.atk + bonusStats.atk_flat) * (1 + bonusStats.atk_percent)) * pElementMult;

    // ==========================================
    // 🔥 DETAILED DEBUG LOGS (Monster Stats Added)
    // ==========================================
    console.group(`⚔️ BATTLE SETUP: ${player.name} vs ${monster.name}`);

    // --- 🛡️ PLAYER SECTION ---
    console.group("👤 Hero Stats & Modifiers");
    console.log(`- Base ATK (Stat + Equip + Passive): ${player.atk}`);
    console.log(`- Base DEF (Stat + Equip + Passive): ${player.def}`);
    console.log(`- Base MAX HP (Stat + Equip + Passive): ${player.maxHp}`);
    console.log(`- Mastery Level: ${mastery?.tier || 0} (Kills: ${killCount})`);
    if (masteryBonusStats.atk > 0 || masteryBonusStats.def > 0) {
        console.log(`- Mastery Bonus:`, masteryBonusStats);
    }
    console.log(`- Included Skill Boost: ATK +${(bonusStats.atk_percent * 100).toFixed(0)}%`);
    console.log(`- Included Skill Boost: DEF +${(bonusStats.def_percent * 100).toFixed(0)}%`);
    console.log(`- Included Skill Boost: MAX HP +${(bonusStats.hp_percent * 100).toFixed(0)}%`);

    console.log(`- Passive Skills:`, constantSkillLogs.map(log => log.skillName || log.name || 'Unnamed Skill'));
    console.groupEnd();

    // --- 👾 MONSTER SECTION ---
    console.group(`👾 Monster Stats: ${monster.name}`);
    console.log(`- Level: ${monster.level}`);

    // เช็คว่าค่าพลังแฝงอยู่ในตัวแปรไหนกันแน่ (บางทีอาจอยู่ใน monster.stats หรือ monsterData)
    const mHp = monster.hp || (monster as any).stats?.hp || 0;
    const mAtk = monster.atk || (monster as any).stats?.atk || 0;
    const mDef = monster.def || (monster as any).stats?.def || 0;

    console.log(`- HP: ${mHp}`);
    console.log(`- ATK: ${mAtk}`);
    console.log(`- DEF: ${mDef}`);
    console.log(`- Element: ${monster.element || 'Neutral'}`);
    console.log(`- Role: ${monster.role || 'NORMAL'}`);
    console.groupEnd();

    // --- 🧪 CALCULATION & MATCHUP ---
    console.group("🧪 Battle Calculation");
    // ฝั่ง Player ตี Monster
    console.log(`- Player Element Mult: x${pElementMult} ${pElementMult > 1 ? '🔥 Advantage' : pElementMult < 1 ? '❄️ Disadvantage' : '⚖️ Neutral'}`);
    const pFormula = `(${player.atk} * (1 + ${bonusStats.atk_percent.toFixed(2)})) * ${pElementMult}`;
    console.log(`- Player Final ATK: ${baseEffectiveAtk.toFixed(2)} (Formula: ${pFormula})`);

    // คำนวณ Damage ที่คาดหวัง (Estimated Damage)
    const estDamageToMonster = Math.max(1, Math.floor(baseEffectiveAtk - monster.def));
    console.log(`- 💥 Est. DMG to Monster: ${estDamageToMonster} (${baseEffectiveAtk.toFixed(0)} ATK - ${monster.def} DEF)`);

    // ฝั่ง Monster ตี Player (ถ้ามี Logic คำนวณฝั่งมอนสเตอร์)
    const mLogMult = typeof mElementMult !== 'undefined' ? mElementMult : 1;
    const estDamageToPlayer = Math.max(1, Math.floor(monster.atk * mLogMult - player.def));
    console.log(`- 🩸 Est. DMG to Player: ${estDamageToPlayer} (${monster.atk} ATK * ${mLogMult.toFixed(2)} - ${player.def} DEF)`);
    console.groupEnd();

    console.groupEnd();
    // ==========================================

    return {
        allEffects,
        bonusStats,
        baseEffectiveAtk,
        pElementMult,
        mElementMult,
        constantSkillLogs,
        mastery
    };
};