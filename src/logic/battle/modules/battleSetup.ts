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
    const { mastery, masteryBonusStats, masteryBonusForCalc, pElementMult, mElementMult, playerClass, classBonus } = calculateInitialStats(player, monster, killCount, equippedSkills as Array<{ id: string }>);

    // ประมวลผล Passive/Constant
    const { bonusStats, skillLogs: constantSkillLogs } = processConstantSkills(allEffects, player, monster, 0);


    if (classBonus) {
        bonusStats.atk_flat += classBonus.atk_flat || 0;
        bonusStats.atk_percent += classBonus.atk_percent || 0;

        bonusStats.def_flat += classBonus.def_flat || 0;
        bonusStats.def_percent += classBonus.def_percent || 0;

        bonusStats.hp_mod += classBonus.hp_mod || 0;
        bonusStats.hp_percent += classBonus.hp_percent || 0;

        bonusStats.lifesteal_percent += classBonus.lifesteal_percent || 0;
        bonusStats.crit_chance += classBonus.crit_chance || 0;
        bonusStats.crit_multi += classBonus.crit_multi || 0;
        bonusStats.armor_pen += classBonus.armor_pen || 0;
        bonusStats.dmgReduction += classBonus.dmgReduction || 0;
    }

    // --- Critical baseline (รวม base stat ของผู้เล่นเข้ากับ bonus จากสกิล/คลาส) ---
    const baseCritChance = player.critChance ?? 0.05;
    const baseCritDamage = player.critDamage ?? 1.5;
    const critChanceFromBonus = typeof bonusStats.crit_chance === 'number' ? bonusStats.crit_chance : 0;
    const critMultiFromBonus = typeof bonusStats.crit_multi === 'number' ? bonusStats.crit_multi : 2.0;
    bonusStats.crit_chance = Math.min(1, Math.max(0, baseCritChance + critChanceFromBonus));
    bonusStats.crit_multi = Math.max(1, baseCritDamage + (critMultiFromBonus - 2.0));

    const baseAtk = player.atk;
    const baseDef = player.def;
    const baseMaxHp = player.maxHp;

    const baseEffectiveMaxHp = (baseMaxHp + (bonusStats.hp_mod || 0) + (masteryBonusForCalc.hp_flat || 0)) * (1 + (bonusStats.hp_percent || 0) + (masteryBonusForCalc.hp_percent || 0));
    const baseEffectiveDef = (baseDef + (bonusStats.def_flat || 0) + (masteryBonusForCalc.def_flat || 0)) * (1 + (bonusStats.def_percent || 0) + (masteryBonusForCalc.def_percent || 0));
    const baseEffectiveAtk = (baseAtk + (bonusStats.atk_flat || 0) + (masteryBonusForCalc.atk_flat || 0)) * (1 + (bonusStats.atk_percent || 0) + (masteryBonusForCalc.atk_percent || 0));

    // ==========================================
    // 🔥 DETAILED DEBUG LOGS (Updated with Final Damage & Correct Element Logic)
    // ==========================================
    console.group(`⚔️ BATTLE SETUP: ${player.name} vs ${monster.name}`);

    // --- 🛡️ PLAYER SECTION ---
    console.group("👤 Hero Stats (Real Time)");

    // คำนวณค่า Battle Focus ล่วงหน้าเพื่อใช้โชว์ใน Log
    const bfSkill = allEffects.find(eff => eff.id === 'battle-focus');
    const bfLevel = (bfSkill && 'level' in bfSkill) ? (bfSkill as any).level : 1;
    const bfMult = bfSkill ? (1 + (0.05 + (bfLevel - 1) * 0.005)) : 1;
    console.table({
        baseAtk,
        baseDef,
        baseMaxHp,
        baseCritChance,
        baseCritDamage,
        finalAtk: Number(baseEffectiveAtk.toFixed(2)),
        finalDef: Number(baseEffectiveDef.toFixed(2)),
        finalMaxHp: Number(baseEffectiveMaxHp.toFixed(2)),
        finalCritChance: Number((bonusStats.crit_chance ?? 0).toFixed(4)),
        finalCritDamage: Number((bonusStats.crit_multi ?? 1).toFixed(2)),
        lifestealPercent: Number(((bonusStats.lifesteal_percent ?? 0) * 100).toFixed(1)),
        finalDmgMult: `x${bfMult.toFixed(3)} (Battle Focus)` // 🚩 เพิ่มบรรทัดนี้
    });

    console.group("🧩 Modifiers Breakdown");
    console.log(`- Mastery Level: ${mastery?.tier || 0} (Kills: ${killCount})`);
    console.log(`- Mastery Bonus (display):`, masteryBonusStats);
    console.log(`- Mastery Bonus (calc):`, masteryBonusForCalc);
    console.log(`- Skill/Item BonusStats:`, bonusStats);
    console.groupEnd();

    console.log(`- Passive Effects:`, constantSkillLogs.map(log => log.skillName || (log as any).name || 'Unnamed Effect'));
    console.groupEnd();

    // --- 👾 MONSTER SECTION ---
    console.group(`👾 Monster Stats: ${monster.name}`);
    console.log(`- Level: ${monster.level}`);

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
    console.log(`- Elemental Matchup: x${pElementMult.toFixed(2)} ${pElementMult > 1 ? '🔥 Advantage' : pElementMult < 1 ? '❄️ Disadvantage' : '⚖️ Neutral'}`);
    console.log(`- Final Dmg Multiplier (Battle Focus): x${bfMult.toFixed(3)}`);

    // สูตร ATK (ตอนนี้ ATK จะไม่คูณ pElementMult แล้วเพื่อให้เลขตรงหน้า Status)
    const pAtkFormula = `(${baseAtk} + ${((bonusStats.atk_flat || 0) + (masteryBonusForCalc.atk_flat || 0)).toFixed(0)}) * (1 + ${(bonusStats.atk_percent || 0).toFixed(2)} + ${(masteryBonusForCalc.atk_percent || 0).toFixed(2)})`;
    console.log(`- Player Final ATK: ${baseEffectiveAtk.toFixed(2)} (Formula: ${pAtkFormula})`);

    // 🚩 คำนวณ Damage ที่คาดหวังใหม่ (ย้าย Element ไปคูณที่ DMG)
    const baseDiff = Math.max(1, baseEffectiveAtk - monster.def);
    const estDamageToMonster = Math.floor(baseDiff * pElementMult * bfMult);

    console.log(`- 💥 Est. DMG to Monster: ${estDamageToMonster}`);
    console.log(`  └─ Formula: (ATK ${baseEffectiveAtk.toFixed(0)} - DEF ${monster.def}) * Element ${pElementMult.toFixed(2)} * FinalMult ${bfMult.toFixed(2)}`);

    // ฝั่ง Monster ตี Player
    const mLogMult = typeof mElementMult !== 'undefined' ? mElementMult : 1;
    const estDamageToPlayer = Math.max(1, Math.floor(monster.atk * mLogMult - baseEffectiveDef));
    console.log(`- 🩸 Est. DMG to Player: ${estDamageToPlayer} (${monster.atk} ATK * ${mLogMult.toFixed(2)} - ${baseEffectiveDef.toFixed(0)} DEF)`);
    console.groupEnd();

    console.groupEnd(); // ปิด BATTLE SETUP
    // ==========================================

    return {
        allEffects,
        bonusStats,
        baseEffectiveAtk,
        baseEffectiveDef,
        baseEffectiveMaxHp,
        pElementMult,
        mElementMult,
        constantSkillLogs,
        mastery,
        playerClass
    };
};