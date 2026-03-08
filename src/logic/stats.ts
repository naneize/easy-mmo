import { ITEMS } from '../data/items';
import { MONSTERS } from '../data/monsters';
import { getMasteryBonus, calculatePlayerClass } from '../utils/gameHelpers';
import type { Entity, Skill } from '../types/game';
import { SKILL_EFFECTS } from './skillEffects';

/**
 * ฟังก์ชันหลักสำหรับคำนวณค่าพลังสุทธิ (Final Stats)
 * รองรับ: Base Stats + Equipment + Monster Mastery + Passive Skills
 */
export const calculateFinalStats = (
    player: Entity,
    equippedIds: { weapon: string | null; armor: string | null; accessory: string | null },
    monsterKills: Record<string, number>,
    equippedSkills: Skill[] = []
) => {

    const playerClass = calculatePlayerClass(equippedSkills);
    const classBonus = playerClass?.bonus || {};

    const baseAtk = player.atk;
    const baseDef = player.def;
    const baseMaxHp = player.maxHp;
    const baseCritChance = player.critChance || 0.05; // Default 5%
    const baseCritDamage = player.critDamage || 1.5; // Default 1.5x

    // 1. ตัวแปรเก็บค่าสะสม (Accumulators)
    let atkFlat = 0;
    let defFlat = 0;
    let maxHpFlat = 0;
    let critChanceFlat = baseCritChance;
    let critDamageFlat = baseCritDamage;

    let atkPercent = 0; // เก็บเป็นส่วนต่าง เช่น 0.1 = +10%
    let defPercent = 0;
    let maxHpPercent = 0;
    let lifesteal = 0;
    let critChancePercent = 0;
    let critDamagePercent = 0;

    let skillAtkMod = 0;
    let skillDefMod = 0;
    let skillMaxHpMod = 0;

    // 2. คำนวณจากอุปกรณ์สวมใส่ (Gear)
    Object.values(equippedIds).forEach(id => {
        if (!id) return;
        const item = ITEMS[id];
        if (!item) return;

        // บวกค่า Status พื้นฐาน (Flat) จากไอเทม
        if (item.stats) {
            atkFlat += item.stats.atk || 0;
            defFlat += item.stats.def || 0;
            maxHpFlat += item.stats.maxHp || 0;
            // กรณีไอเทมมี field hp ให้ถือเป็น maxHp
            if ('hp' in item.stats) maxHpFlat += (item.stats as any).hp || 0;
        }

        // บวกค่า Passive จากไอเทม (รองรับ StatTarget ใหม่ๆ)
        if (item.passive) {
            const p = item.passive;
            const val = p.value;

            if (p.target === 'atk_flat') atkFlat += val;
            if (p.target === 'def_flat') defFlat += val;
            if (p.target === 'maxHp_flat') maxHpFlat += val;

            // หาร 100 สำหรับพวก Percent (ตามที่เราตกลงกันไว้)
            if (p.target === 'atk_percent') atkPercent += (val / 100);
            if (p.target === 'def_percent') defPercent += (val / 100);
            if (p.target === 'maxHp_percent') maxHpPercent += (val / 100);

            if (p.target === 'lifesteal') lifesteal += (val / 100);

            // Critical Strike support
            if (p.target === 'crit_chance') critChanceFlat += (val / 100);
            if (p.target === 'crit_multi') critDamageFlat += (val / 100);
        }
    });

    // 5. คำนวณจาก Class Bonus
    atkFlat += classBonus.atk_flat || 0;
    atkPercent += classBonus.atk_percent || 0;

    defFlat += classBonus.def_flat || 0;
    defPercent += classBonus.def_percent || 0;

    maxHpFlat += classBonus.hp_mod || 0;
    maxHpPercent += classBonus.hp_percent || 0;

    lifesteal += classBonus.lifesteal_percent || 0;

    // Critical Strike class bonuses
    critChanceFlat += classBonus.crit_chance || 0;
    critDamageFlat += classBonus.crit_multi || 0;

    // 3. คำนวณจาก Mastery (โบนัสถาวรจากการล่ามอนสเตอร์)
    Object.entries(monsterKills).forEach(([monsterId, kills]) => {
        const monster = MONSTERS.find(m => m.id === monsterId);
        if (monster && kills >= 1) { // เริ่มคิดตั้งแต่ 1 ตัวตาม Logic Mastery
            const bonus = getMasteryBonus(monster, kills);
            if (bonus.type === 'atk') atkFlat += bonus.value;
            if (bonus.type === 'def') defFlat += bonus.value;
            if (bonus.type === 'maxHp') maxHpFlat += bonus.value;
        }
    });

    // 4. คำนวณจาก Passive Skills
    equippedSkills.forEach(skill => {
        if (skill.type !== 'constant') return;

        let appliedFromEffect = false; // ตัวแปรเช็คว่ามีการใช้ค่าจาก EffectFn ไปหรือยัง

        const effectFn = SKILL_EFFECTS[skill.id];
        if (typeof effectFn === 'function') {
            const result = effectFn({
                player,
                monster: {} as any,
                baseValue: skill.value ?? 0,
                level: skill.level || 1
            });

            if (result.value !== undefined) {
                // --- ATK Group ---
                if (skill.targetStat === 'atk_flat' || skill.targetStat === 'atk_percent') {
                    skillAtkMod += result.value;
                }

                // --- DEF Group ---
                if (skill.targetStat === 'def_flat' || skill.targetStat === 'def_percent') {
                    skillDefMod += result.value;
                }

                // --- HP Group ---
                if (skill.targetStat === 'maxHp_flat' || skill.targetStat === 'maxHp_percent') {
                    skillMaxHpMod += result.value;
                }

                appliedFromEffect = true;
            }

            // รับค่า Modifiers แฝง (เช่น Dark Pact ที่ลด DEF หรือระบบ Percent ใหม่)
            if (result.atkMod) { skillAtkMod += result.atkMod; appliedFromEffect = true; }
            if (result.defMod) { skillDefMod += result.defMod; appliedFromEffect = true; }
            if (result.hpMod) { skillMaxHpMod += result.hpMod; appliedFromEffect = true; }

            // รับค่าจากระบบ Percent ใหม่ (atkPercent, defPercent, hpPercent)
            if (result.atkPercent) { atkPercent += result.atkPercent; appliedFromEffect = true; }
            if (result.defPercent) { defPercent += result.defPercent; appliedFromEffect = true; }
            if (result.hpPercent) { maxHpPercent += result.hpPercent; appliedFromEffect = true; }

            // 3. รับค่าสถานะพิเศษอื่นๆ
            if (result.lifesteal) lifesteal += result.lifesteal;
            if (result.critChance) critChanceFlat += result.critChance;
            if (result.critDamage) critDamageFlat += result.critDamage;
        }
    });

    // สูตร: (Base + FlatSkill) * (1 + PercentSum)
    const finalAtk = Math.max(0, Math.floor((player.atk + atkFlat + skillAtkMod) * (1 + atkPercent)));
    const finalDef = Math.max(0, Math.floor((player.def + defFlat + skillDefMod) * (1 + defPercent)));
    const finalMaxHp = Math.max(1, Math.floor((player.maxHp + maxHpFlat + skillMaxHpMod) * (1 + maxHpPercent)));
    const finalCritChance = Math.min(1, Math.max(0, critChanceFlat + critChancePercent)); // Cap between 0-100%
    const finalCritDamage = Math.max(1, critDamageFlat + critDamagePercent); // Minimum 1x

    return {
        atk: finalAtk,
        def: finalDef,
        maxHp: finalMaxHp,
        critChance: finalCritChance,
        critDamage: finalCritDamage,

        // เพิ่ม Property ใหม่เพื่อรองรับ Dashboard StatCard
        baseAtk: baseAtk,
        baseDef: baseDef,
        baseMaxHp: baseMaxHp,
        baseCritChance: baseCritChance,
        baseCritDamage: baseCritDamage,

        lifesteal: Math.min(0.5, lifesteal), // ไม่ให้เกิน 100%

        // คำนวณ Bonus สุทธิ (ส่วนต่างที่จะแสดงเป็นเลขสีเขียว/ส้ม)
        bonusAtk: finalAtk - baseAtk,
        bonusDef: finalDef - baseDef,
        bonusHp: finalMaxHp - baseMaxHp,
        bonusCritChance: finalCritChance - baseCritChance,
        bonusCritDamage: finalCritDamage - baseCritDamage,

        isAtkReduced: skillAtkMod < 0 || atkPercent < 0,
        isDefReduced: skillDefMod < 0 || defPercent < 0,
        isHpReduced: skillMaxHpMod < 0 || maxHpPercent < 0,
        defPenalty: 0
    };
};