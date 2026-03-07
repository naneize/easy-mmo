import type { Entity, MonsterData, BattleEffect } from '../../../types/game';
import { ITEMS, type GameItem } from '../../../data/items';
import { calculateInitialStats } from '../statsCalculator';
import { processConstantSkills } from '../skillProcessor';
import { initializeMonster } from '../../../data/monsters';



export const prepareBattleContext = (
    player: Entity,
    monsterData: MonsterData,
    equippedSkills: BattleEffect[],
    allKills: Record<string, number>,
    allMonsters: MonsterData[]
) => {

    console.log('🔍 Player Data Structure:', player);

    const monster = initializeMonster(monsterData);



    // รวมรายการ Effects ทั้งหมด
    const equipmentList = Object.values(player.equipment).filter((item): item is GameItem => item !== null);

    const rawCombined: BattleEffect[] = [...equippedSkills, ...equipmentList];

    const allEffects: BattleEffect[] = Array.from(
        new Map(rawCombined.map(eff => [eff.id, eff])).values()
    );

    // คำนวณค่า Mastery และธาตุ
    const { mastery, masteryBonusForCalc, pElementMult, mElementMult, playerClass, classBonus }
        = calculateInitialStats(player, monster, allKills, allMonsters, equippedSkills as Array<{ id: string }>);

    console.log('🛡️ Detected Class:', playerClass?.id);

    // 3. ✨ เช็คเงื่อนไขอาวุธ (ย้ายมาไว้ตรงนี้ เพื่อให้ playerClass มีค่าแล้ว)
    // 1. ดึง Object อาวุธออกมาตรงๆ (มันเป็น GameItem อยู่แล้วตาม Type ของ Entity)
    const equippedWeapon = player.equipment.weapon;

    // 2. เช็คข้อมูลจาก Object นั้นได้เลย
    console.log('⚔️ Debug Weapon:', {
        name: equippedWeapon?.name,
        wType: (equippedWeapon as any)?.weaponType // ใช้ as any กันเหนียวถ้าใน interface GameItem ยังไม่มี weaponType
    });

    let weaponMasteryMultiplier = 1.0;

    // 3. ตรวจสอบเงื่อนไข (ใช้ข้อมูลจาก Object ที่อยู่ในมือแล้ว)
    if (playerClass?.id === 'mercenary' && (equippedWeapon as any)?.weaponType === 'sword') {
        weaponMasteryMultiplier = 1.15;
        console.log('✅ Sword Mastery Active! Multiplier set to 1.15');
    }

    console.log('🛡️ Detected Class:', playerClass?.id);
    const skillOnly = equippedSkills.filter(s => s.type !== 'weapon' && s.type !== 'armor');

    console.log('🎒 Equipped Skills (No Weapons):', skillOnly.map(s => s.id));

    // 1. กรองไอเทม/สกิลที่มี ID ซ้ำกันออกให้เหลืออย่างละ 1 (ป้องกันดาบไม้เบิ้ล)
    const uniqueEffects = Array.from(
        new Map(allEffects.map(eff => [eff.id, eff])).values()
    );

    // ประมวลผล Passive/Constant
    const { bonusStats, skillLogs: constantSkillLogs } = processConstantSkills(uniqueEffects, player, monster, 0);


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

    const baseEffectiveMaxHp = (baseMaxHp + (bonusStats.hp_mod || 0) + (masteryBonusForCalc.maxHp_flat || 0)) * (1 + (bonusStats.hp_percent || 0) + (masteryBonusForCalc.maxHp_percent || 0));
    const baseEffectiveAtk = (baseAtk + (bonusStats.atk_flat || 0) + (masteryBonusForCalc.atk_flat || 0))
        * (1 + (bonusStats.atk_percent || 0) + (masteryBonusForCalc.atk_percent || 0)) // คำนวณโบนัสเปอร์เซ็นต์ปกติก่อน
        * weaponMasteryMultiplier; // แล้วค่อยคูณด้วยตัวคูณอาวุธ (Multiplicative)
    const baseEffectiveDef = (baseDef + (bonusStats.def_flat || 0) + (masteryBonusForCalc.def_flat || 0)) * (1 + (bonusStats.def_percent || 0) + (masteryBonusForCalc.def_percent || 0));

    // --- 🔍 จุดเช็คของเถื่อน (วางไว้ก่อน console.group) ---
    console.log("🛠️ Raw Effects Audit:", allEffects.map(e => ({ id: e.id, type: (e as any).type, atk: (e as any).atk })));




    const atkFromEffects = uniqueEffects.reduce((sum, e) => {
        // เช็คทั้งสองที่ เผื่อบางอันอยู่ข้างนอก บางอันอยู่ใน stats
        const val = (e as any).stats?.atk || (e as any).atk || 0;
        if (val > 0) console.log(`  -> Found ATK ${val} from ID: ${e.id}`);
        return sum + val;
    }, 0);
    console.log(`📏 Total Flat ATK calculated: ${atkFromEffects}`);

    // ==========================================
    // 🔥 DETAILED DEBUG LOGS (Updated for Global Mastery & Correct Stats)
    // ==========================================
    console.group(`⚔️ BATTLE SETUP: ${player.name} vs ${monster.name}`);

    // --- 🛡️ PLAYER SECTION ---
    console.group("👤 Hero Stats (Real Time)");

    // คำนวณค่า Battle Focus ล่วงหน้าเพื่อใช้โชว์ใน Log
    const bfSkill = uniqueEffects.find(eff => eff.id === 'battle-focus');
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
        finalDmgMult: `x${bfMult.toFixed(3)} (Battle Focus)`
    });

    console.group("🧩 Modifiers Breakdown");
    // แสดง Mastery เฉพาะของมอนสเตอร์ตัวนี้ (เพื่อเช็ค Tier ปัจจุบัน)
    const currentMonsterKills = allKills[monster.id] || 0;

    console.log(`- Current Monster Mastery: Tier ${mastery?.tier || 0} (Kills: ${currentMonsterKills + 1})`);

    // แสดงโบนัส Mastery รวมทั้งหมดจากมอนสเตอร์ทุกตัว (Global Stats)
    console.log(`- Global Mastery Stats (Total):`, masteryBonusForCalc);
    console.log(`- Skill/Item BonusStats:`, bonusStats);
    console.groupEnd();

    console.log(`- Passive Effects:`, constantSkillLogs.map(log => log.skillName || (log as any).name || 'Unnamed Effect')); console.groupEnd();

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
    // ✨ เพิ่มส่วนเช็ค Weapon Mastery โดยเฉพาะ
    if (weaponMasteryMultiplier > 1) {
        console.log(`%c⚔️ WEAPON MASTERY ACTIVE: +${((weaponMasteryMultiplier - 1) * 100).toFixed(0)}% ATK`,
            "color: #fb7185; font-weight: bold; background: #fff1f2; padding: 2px 5px; border-radius: 4px;");
        console.log(`   └─ Reason: [${playerClass?.id}] using [${(player as any).equippedWeaponType || 'Sword'}]`);
    } else {
        console.log(`%c⚪ No Weapon Mastery Bonus`, "color: #94a3b8; italic");
    }

    // ฝั่ง Player ตี Monster
    console.log(`- Elemental Matchup: x${pElementMult.toFixed(2)} ${pElementMult > 1 ? '🔥 Advantage' : pElementMult < 1 ? '❄️ Disadvantage' : '⚖️ Neutral'}`);
    console.log(`- Final Dmg Multiplier (Battle Focus): x${bfMult.toFixed(3)}`);

    // แก้ไขสูตรการแสดงผล ATK ให้ใช้ชื่อ maxHp_flat/percent ให้ถูกต้อง
    const pAtkFormula = `(${baseAtk} + stats) * (1 + bonus + mastery + weaponBonus:${weaponMasteryMultiplier})`;
    console.log(`- Player Final ATK: ${baseEffectiveAtk.toFixed(2)} (Formula: ${pAtkFormula})`);

    // คำนวณ Damage ที่คาดหวัง
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