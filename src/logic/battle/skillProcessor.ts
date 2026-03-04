import type { Entity, MonsterData, BattleEffect } from '../../types/game';
import type { Skill } from '../../store/skills';
import { SKILL_EFFECTS } from '../skillEffects';

export const processConstantSkills = (
    effects: BattleEffect[],
    player: Entity,
    monster: MonsterData,
    initialDef: number
) => {
    const bonusStats = {
        atk_percent: 0, atk_flat: 0, def_percent: 0, hp_mod: 0,
        hp_percent: 0, regen_flat: 0, lifesteal_percent: 0,
        lifesteal_chance: 0, def_flat: initialDef,
        crit_chance: 0, crit_multi: 2.0, armor_pen: 0,
        lifesteal_source: ""
    };
    const skillLogs: any[] = [];

    effects.forEach(effect => {
        // --- [1] จัดการกรณีเป็น "SKILL" ---
        if ('id' in effect && !('passive' in effect)) {
            const skill = effect as any;
            const effectFn = SKILL_EFFECTS[skill.id];

            if (typeof effectFn === 'function') {
                const result = effectFn({
                    player,
                    monster,
                    baseValue: skill.value ?? 0,
                    level: skill.level || 1
                });

                const val = result.value || 0;

                // --- A. Logic พิเศษตาม ID (Hardcoded) ---
                if (skill.id === 'dark-corruption') {
                    bonusStats.armor_pen += (Math.abs(val) / 100);
                }

                // --- B. จัดการตาม Target Stat (Fallback) ---
                else if (skill.targetStat) {
                    if (skill.targetStat === 'atk_percent') bonusStats.atk_percent += (val / 100);
                    if (skill.targetStat === 'def_percent') bonusStats.def_percent += (val / 100);
                    if (skill.targetStat === 'hp_percent') bonusStats.hp_percent += (val / 100);
                    if (skill.targetStat === 'atk_flat') bonusStats.atk_flat += val;
                    if (skill.targetStat === 'def_flat') bonusStats.def_flat += val;
                    if (skill.targetStat === 'regen_flat') bonusStats.regen_flat += val;
                    if (skill.targetStat === 'crit_chance') bonusStats.crit_chance += (val / 100);
                    if (skill.targetStat === 'crit_multi') bonusStats.crit_multi += val;
                    if (skill.targetStat === 'armor_pen') bonusStats.armor_pen += (val / 100);

                    if (skill.targetStat === 'lifesteal_percent') {
                        bonusStats.lifesteal_percent += (val / 100);
                        bonusStats.lifesteal_chance = Math.max(bonusStats.lifesteal_chance, result.chance || 1);
                    }
                }

                // --- C. ✨ Universal Modifiers (ตัวรับค่าที่ยืดหยุ่นที่สุด) ---

                // 1. จัดการ ATK (เปลี่ยนจาก atkModPercent เป็น atkPercent)
                if (result.atkPercent) {
                    bonusStats.atk_percent += result.atkPercent;
                }
                if (result.atkMod) {
                    bonusStats.atk_flat += result.atkMod;
                }
                // Fallback เดิมของคุณ
                else if (val !== 0 && !skill.targetStat) {
                    bonusStats.atk_flat += val;
                }

                // 2. จัดการ DEF (เปลี่ยนจาก defModPercent เป็น defPercent)
                if (result.defPercent) {
                    bonusStats.def_percent += result.defPercent;
                }
                if (result.defMod) {
                    bonusStats.def_flat += result.defMod;
                }

                // 3. จัดการ HP (เปลี่ยนจาก hpModPercent เป็น hpPercent)
                if (result.hpPercent) {
                    bonusStats.hp_percent += result.hpPercent;
                }
                if (result.hpMod) {
                    bonusStats.hp_mod += result.hpMod;
                }

                // --- D. การบันทึก Log ---
                if (result.log) {
                    skillLogs.push({
                        type: 'skill',
                        text: result.log,
                        // ✨ ดึงชื่อจาก skill object หรือ fallback ไปที่ id
                        skillName: skill.name || skill.id
                    });
                }
            }
        }

        // --- [2] จัดการกรณีเป็น "ITEM" (Passive) ---
        if ('passive' in effect && effect.passive) {
            const p = effect.passive;
            const val = p.value || 0;

            if (p.target === 'atk_flat') bonusStats.atk_flat += val;
            if (p.target === 'def_flat') bonusStats.def_flat += val;
            if (p.target === 'maxHp_flat') bonusStats.hp_mod += val;
            if (p.target === 'atk_percent') bonusStats.atk_percent += (val / 100);
            if (p.target === 'lifesteal') bonusStats.lifesteal_percent += (val / 100);

            // ✨ เพิ่มการบันทึก Log ให้ Item ด้วย ชื่อจะได้ไม่หาย
            skillLogs.push({
                type: 'item',
                text: `📦 [${effect.name}] ${p.target} +${val}`,
                skillName: effect.name // ใส่ชื่อไอเทมตรงนี้
            });
        }


    });

    return { bonusStats, skillLogs };

};

export const processTriggerSkills = (
    type: 'on-hit' | 'on-defend',
    skills: any[],
    player: Entity,
    monster: MonsterData,
    baseValue: number
) => {
    let extraValue = 0;
    const triggerLogs: any[] = [];
    const actions: string[] = [];

    // กรองเอาเฉพาะสกิลที่เป็นประเภท Trigger (on-hit/on-defend)
    skills.filter(s => s.type === type).forEach(skill => {
        const effectFn = SKILL_EFFECTS[skill.id];

        if (typeof effectFn === 'function') {
            const result = effectFn({
                player,
                monster,
                baseValue: baseValue,
                level: skill.level || 1
            });

            // คำนวณโอกาสติด (Chance)
            if (Math.random() <= (result.chance ?? 1)) {
                if (type === 'on-hit') extraValue += result.value;
                if (type === 'on-defend') extraValue -= result.value;

                if (result.action) actions.push(result.action);
                if (result.log) triggerLogs.push({ type: 'skill', text: result.log });
            }
        }
    });

    return { extraValue, triggerLogs, actions };
};