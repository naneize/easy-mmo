import type { Entity, MonsterData } from '../types/game';

interface SkillContext {
    player: Entity;
    monster: MonsterData | Entity;
    baseValue: number;
    level: number;
}

interface SkillResult {
    value?: number;
    chance?: number;
    log?: string;
    atkMod?: number;
    atkPercent?: number;
    defMod?: number;
    defPercent?: number;
    hpMod?: number;
    hpPercent?: number;
    regen_percent?: number;
    lifesteal?: number;
    critChance?: number;
    critDamage?: number;
    action?: string;
}


export const SKILL_EFFECTS: Record<string, (ctx: SkillContext) => SkillResult> = {


    // #region --- Active Skills ---

    'spark-burst': ({ player, baseValue, level }) => {
        const isSynergy = player.element === 'Neutral';
        const baseChance = isSynergy ? 0.40 : 0.25;
        const chance = baseChance + ((level - 1) * 0.02);
        const scaledValue = Math.floor(baseValue * (1 + (level - 1) * 0.03));

        return {
            chance: chance,
            value: scaledValue,
            log: `${isSynergy ? '⚪ [Neutral Synergy] ' : ''}⚡ Spark Burst Lv.${level} สายฟ้าฟาด! (Base Dmg: ${scaledValue})`,
        };
    },

    'aegis-guard': ({ player, baseValue, level }) => {
        const isSynergy = player.element === 'Neutral';
        const reductionBase = isSynergy ? 0.55 : 0.50;
        const finalReduction = reductionBase + ((level - 1) * 0.015);

        return {
            chance: 0.35,
            value: Math.floor(baseValue * finalReduction),
            log: `${isSynergy ? '⚪ [Neutral Synergy] ' : ''}🛡️ Aegis Guard Lv.${level} ป้องกันความเสียหาย ${Math.round(finalReduction * 100)}%!`,
        };
    },

    'blade-dance': ({ player, level }) => {
        const isSynergy = player.element === 'Neutral';
        const baseAtkPercent = isSynergy ? 0.35 : 0.20;
        const atkPercent = baseAtkPercent + ((level - 1) * 0.03);

        return {
            value: 0,
            atkPercent: atkPercent,
            log: `${isSynergy ? '⚪ [Synergy] ' : ''}⚔️ Blade Dance Lv.${level} ATK +${Math.round(atkPercent * 100)}%`
        };
    },

    'calm-focus': ({ player, level }) => {
        const isSynergy = player.element === 'Neutral';
        const basePercent = isSynergy ? 0.02 : 0.01;
        const regenPercent = basePercent + ((level - 1) * 0.005);

        // เราไม่คำนวณ healAmt ในนี้แล้ว แต่ส่ง % ออกไปให้ระบบจัดการ
        return {
            value: 0,
            regen_percent: regenPercent, // ส่งค่า 0.02 หรือ 0.015 ออกไป
            log: `${isSynergy ? '⚪ [Neutral Synergy] ' : ''}✨ Calm Focus Lv.${level} ฟื้นฟู ${(regenPercent * 100).toFixed(1)}% ของ HP สูงสุด`
        };
    },

    // #endregion

    // #region --- Passive Synergy ---

    'blazing-soul': ({ player, level }) => {
        const isSynergy = player.element === 'Fire';
        const levelBonus = (level - 1) * 0.015;

        // คำนวณแยก 2 ค่าชัดเจน
        const normalAtk = 0.10 + levelBonus;
        const synergyAtk = 0.20 + levelBonus;

        // เลือกใช้ค่าจริงตามเงื่อนไข
        const bonusMult = isSynergy ? synergyAtk : normalAtk;

        return {
            value: 0,
            atkPercent: bonusMult,
            log: `${isSynergy ? '🔥 [Synergy] ' : ''}🔥 Blazing Soul Lv.${level} ATK +${Math.round(bonusMult * 100)}%`
        };
    },

    'tidal-grace': ({ player, level }) => {
        const isSynergy = player.element === 'Water';
        const hpPercent = (isSynergy ? 0.05 : 0.02) + ((level - 1) * 0.003);
        const healAmt = Math.floor(player.maxHp * hpPercent);

        return {
            value: healAmt, // Regen ใช้ค่า flat ในแต่ละเทิร์น
            log: `${isSynergy ? '💧 [Tidal Synergy]' : '💧 [Tidal Grace]'} Lv.${level} ฟื้นฟู +${healAmt} HP (${(hpPercent * 100).toFixed(1)}%)`
        };
    },

    'stone-skin': ({ player, level }) => {
        const isSynergy = player.element === 'Earth';
        const baseDefPercent = isSynergy ? 0.25 : 0.10;
        const defPercent = baseDefPercent + ((level - 1) * 0.03);

        return {
            value: 0,
            defPercent: defPercent,
            log: `${isSynergy ? '🌱 [Synergy] ' : ''}🛡️ Stone Skin Lv.${level} DEF +${Math.round(defPercent * 100)}%`
        };
    },

    'tailwind-strike': ({ player, level }) => {
        const isSynergy = player.element === 'Wind';
        const chance = (isSynergy ? 0.30 : 0.10) + ((level - 1) * 0.01);
        const displayChance = Math.round(chance * 100);
        const synergyText = isSynergy ? ' + โบนัสธาตุลม' : '';

        return {
            action: 'double-attack',
            value: 0,
            chance: chance,
            log: `${isSynergy ? '🌪️ [Tailwind Synergy]' : '🌪️ [Tailwind]'} เตรียมโจมตีต่อเนื่อง! (โอกาส ${displayChance}%)`
        };
    },

    'holy-aura': ({ player, level }) => {
        const isSynergy = player.element === 'Light';
        const dmgReduction = (isSynergy ? 0.25 : 0.10) + ((level - 1) * 0.015);

        return {
            chance: 1.0,
            value: dmgReduction,
            log: `${isSynergy ? '☀️ [Holy Synergy]' : '☀️ [Holy Aura]'} Lv.${level} ลดความเสียหาย ${Math.round(dmgReduction * 100)}%`
        };
    },

    'dark-pact': ({ player, level }) => {
        const isSynergy = player.element === 'Dark';
        const atkPercent = 0.30 + ((level - 1) * 0.03);
        const defPenaltyPercent = !isSynergy ? 0.10 + ((level - 1) * 0.02) : 0;

        return {
            value: 0,
            atkPercent: atkPercent,
            defPercent: -defPenaltyPercent,
            log: `${isSynergy ? '🌙 [Synergy] ' : ''}🌙 Dark Pact Lv.${level} ATK +${Math.round(atkPercent * 100)}%${!isSynergy ? ` (DEF -${Math.round(defPenaltyPercent * 100)}%)` : ''}`
        };
    },

    // #endregion

    // #region --- Common Tier Skills ---

    'vitality-boost': ({ player, level }) => {
        const isSynergy = player.element === 'Neutral';
        const baseHpPercent = 0.15 + ((level - 1) * 0.02);
        const hpPercent = isSynergy ? baseHpPercent * 2 : baseHpPercent;

        return {
            value: 0,
            hpPercent: hpPercent,
            log: `${isSynergy ? '⚪ [Synergy] ' : ''}❤️ Vitality Boost Lv.${level} Max HP +${Math.round(hpPercent * 100)}%`
        };
    },

    'gold-finder': ({ level }) => {
        // level 1 = 10%, level 2 = 12% ...
        const goldBonusPercent = 0.10 + ((level - 1) * 0.02);

        return {
            // ส่งค่า multiplier ไปเลย (เช่น 1.10) เพื่อเอาไปคูณกับ gold ได้ทันที
            multiplier: 1 + goldBonusPercent,
            value: Math.round(goldBonusPercent * 100), // ส่งค่า 10, 12 ไปโชว์ใน UI
            log: `⭐ Gold Finder Lv.${level}: รับทองเพิ่ม +${Math.round(goldBonusPercent * 100)}%`
        };
    },

    // #endregion

    // #region --- Rare Tier Skills ---

    'fire-ember': ({ player, level }) => {
        const isSynergy = player.element === 'Fire';
        const baseChance = isSynergy ? 0.25 : 0.15;
        const chance = baseChance + ((level - 1) * 0.02);
        const dmgMultiplier = 0.50;
        const bonusDamage = Math.floor(player.atk * dmgMultiplier);

        return {
            chance: chance,
            value: bonusDamage,
            log: `${isSynergy ? '🔥 [Fire Synergy]' : '🔥 [Fire Ember]'} Lv.${level} โอกาส ${Math.round(chance * 100)}% ทำความเสียหายเพิ่ม +${bonusDamage}`
        };
    },

    'water-purify': ({ player, level }) => {
        const isSynergy = player.element === 'Water';
        const healPercent = (isSynergy ? 0.12 : 0.08) + ((level - 1) * 0.01);
        const healAmount = Math.floor(player.maxHp * healPercent);

        return {
            value: healAmount,
            log: `${isSynergy ? '💧 [Synergy] ' : ''}💧 Water Purify Lv.${level} ฟื้นฟู +${healAmount} HP (${Math.round(healPercent * 100)}%) และลบสถานะผิดปกติ`
        };
    },

    'earth-wall': ({ player, level }) => {
        const isSynergy = player.element === 'Earth';
        const defPercent = 0.20 + ((level - 1) * 0.02);
        const atkPenaltyPercent = !isSynergy ? 0.05 : 0;

        return {
            value: 0,
            defPercent: defPercent,
            atkPercent: -atkPenaltyPercent,
            log: `${isSynergy ? '🌱 [Synergy] ' : ''}🛡️ Earth Wall Lv.${level} DEF +${Math.round(defPercent * 100)}%${!isSynergy ? ` (ATK -${Math.round(atkPenaltyPercent * 100)}%)` : ''}`
        };
    },

    'wind-dash': ({ player, level }) => {
        const isSynergy = player.element === 'Wind';
        const baseChance = isSynergy ? 0.30 : 0.20;
        const chance = baseChance + ((level - 1) * 0.02);
        const counterDamagePercent = 0.50;

        return {
            action: 'counter',
            chance: chance,
            value: counterDamagePercent * 100,
            log: `${isSynergy ? '🌪️ [Synergy] ' : ''}💨 Wind Dash Lv.${level} โอกาสหลบ ${Math.round(chance * 100)}% | สวนกลับ ${Math.round(counterDamagePercent * 100)}% ATK`
        };
    },

    'light-blessing': ({ player, level }) => {
        const isSynergy = player.element === 'Light';
        const healPercent = 0.05 + ((level - 1) * 0.01);
        const atkPercent = (isSynergy ? 0.15 : 0.10) + ((level - 1) * 0.01);
        const healAmount = Math.floor(player.maxHp * healPercent);

        return {
            value: healAmount,
            atkPercent: atkPercent,
            log: `${isSynergy ? '☀️ [Synergy] ' : ''}☀️ Light Blessing Lv.${level} ฟื้นฟู +${healAmount} HP/เทิร์น ATK +${Math.round(atkPercent * 100)}%`
        };
    },

    'dark-corruption': ({ player, level }) => {
        const isSynergy = player.element === 'Dark';
        const enemyDefReduction = 0.15 + ((level - 1) * 0.01);
        const hpPenaltyPercent = !isSynergy ? (0.03 + (level - 1) * 0.01) : 0;

        return {
            value: -enemyDefReduction * 100,
            hpPercent: -hpPenaltyPercent,
            log: `${isSynergy ? '🌙 [Synergy] ' : ''}🌙 Dark Corruption Lv.${level} ลด DEF ศัตรู ${Math.round(enemyDefReduction * 100)}%${!isSynergy ? ` (เสีย HP -${Math.round(hpPenaltyPercent * 100)}%/เทิร์น)` : ''}`
        };
    },

    // #endregion

    // #region --- Epic Tier Skills ---

    'critical-strike': ({ level }) => {
        const chance = 0.08 + ((level - 1) * 0.01);
        return {
            value: chance * 100,
            log: `🎯 Critical Strike Lv.${level} โอกาส ${Math.round(chance * 100)}% ทำความเสียหาย 200%`
        };
    },

    'critical-mastery': ({ level }) => {
        const damageBonus = 0.20 + ((level - 1) * 0.05);
        return {
            value: damageBonus * 100,
            log: `⚡ Critical Mastery Lv.${level} เพิ่มความเสียหาย Critical +${Math.round(damageBonus * 100)}%`
        };
    },

    'lifesteal-vamp': ({ level }) => {
        const lifestealPercent = 0.15 + ((level - 1) * 0.02);
        const triggerChance = 0.30;

        return {
            chance: triggerChance,
            value: lifestealPercent * 100,
            log: `🩸 Vampiric Touch Lv.${level} (โอกาส ${triggerChance * 100}%) ดูดเลือดคืน ${Math.round(lifestealPercent * 100)}%`
        };
    },

    'armor-penetration': ({ level }) => {
        const penetrationPercent = 0.30 + ((level - 1) * 0.02);
        const atkPenaltyPercent = 0.10;

        return {
            value: penetrationPercent * 100,
            atkPercent: -atkPenaltyPercent,
            log: `⚔️ Armor Penetration Lv.${level} ทะลุ DEF ${Math.round(penetrationPercent * 100)}% (ATK -${Math.round(atkPenaltyPercent * 100)}%)`
        };
    },

    // #endregion

    // #region --- Legendary Tier Skills ---

    'elemental-mastery': ({ player, level }) => {
        const atkPercent = 0.25 + ((level - 1) * 0.03);
        const defPercent = 0.20 + ((level - 1) * 0.02);
        const hpPercent = 0.15 + ((level - 1) * 0.02);
        const hasElementalAffinity = player.element !== 'Neutral';

        if (!hasElementalAffinity) {
            const nAtk = 0.30 + ((level - 1) * 0.04);
            const nDef = 0.25 + ((level - 1) * 0.03);
            const nHp = 0.20 + ((level - 1) * 0.03);
            return {
                value: 0,
                atkPercent: nAtk,
                defPercent: nDef,
                hpPercent: nHp,
                log: `👑[Elemental Mastery] (Neutral): พลังไร้ธาตุขั้นสุดยอด!(ATK + ${Math.round(nAtk * 100)} % / DEF +${Math.round(nDef * 100)}% / HP + ${Math.round(nHp * 100)} %)`
            };
        }

        return {
            value: 0,
            atkPercent: atkPercent,
            defPercent: defPercent,
            hpPercent: hpPercent,
            log: `👑[Elemental Mastery](${player.element}): ATK + ${Math.round(atkPercent * 100)}% | DEF + ${Math.round(defPercent * 100)}% | HP + ${Math.round(hpPercent * 100)}% `
        };
    },

    // #endregion
}; // <-- ตรวจสอบให้แน่ใจว่ามีปีกกาปิดอันนี้อยู่ที่ท้ายไฟล์สุดๆ

