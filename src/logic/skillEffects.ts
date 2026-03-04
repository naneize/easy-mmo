import type { Entity, MonsterData } from '../types/game';

interface SkillContext {
    player: Entity;
    monster: MonsterData | Entity;
    baseValue: number;
    level: number;
}

interface SkillResult {
    value: number;
    chance?: number;
    log?: string;
    atkMod?: number;
    atkPercent?: number;
    defMod?: number;
    defPercent?: number;
    hpMod?: number;
    hpPercent?: number;
    lifesteal?: number;
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
        // คำนวณเพื่อแสดงใน Log เฉยๆ แต่ส่งค่าจริงผ่าน atkPercent
        const displayAtkBonus = Math.floor(player.atk * atkPercent);

        return {
            value: 0,
            atkPercent: atkPercent,
            log: `${isSynergy ? '⚪ [Neutral Synergy] ' : ''}⚔️ Blade Dance Lv.${level} ATK +${displayAtkBonus} (${Math.round(atkPercent * 100)}%)`,
        };
    },

    'calm-focus': ({ player, level }) => {
        const isSynergy = player.element === 'Neutral';
        const baseHeal = isSynergy ? 10 : 5;
        const healAmt = baseHeal + ((level - 1) * 2);
        const hpPercent = ((healAmt / player.maxHp) * 100).toFixed(1);

        return {
            value: healAmt,
            log: `${isSynergy ? '⚪ [Neutral Synergy] ' : ''}✨ Calm Focus Lv.${level} ฟื้นฟู +${healAmt} HP (${hpPercent}%)`
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
            // ส่งค่าเปรียบเทียบไปให้ UI
            displayStats: {
                atk: normalAtk,
                synergyAtk: synergyAtk,
                isSynergy: isSynergy
            },
            log: `${isSynergy ? '🔥 [Blazing Synergy]' : '🔥 [Blazing Soul]'} Lv.${level} » ATK +${Math.floor(player.atk * bonusMult)} (+${(bonusMult * 100).toFixed(1)}%)`
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
        const scalingBonus = Math.floor((level - 1) * 4);
        const defBonus = (isSynergy ? 25 : 10) + scalingBonus;

        return {
            value: 0,
            defMod: defBonus,
            log: `${isSynergy ? '🌱 [Stone Synergy]' : '🌱 [Stone Skin]'} Lv.${level} DEF +${defBonus}`
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
        const atkBonus = 30 + ((level - 1) * 5);
        const defPenalty = !isSynergy ? -(10 + (level - 1) * 2) : 0;

        return {
            value: 0,
            atkMod: atkBonus,
            defMod: defPenalty,
            log: `${isSynergy ? '🌙 [Dark Synergy]' : '🌙 [Dark Pact]'} Lv.${level} ATK +${atkBonus}${!isSynergy ? ` (DEF ${defPenalty})` : ''}`
        };
    },

    // #endregion

    // #region --- Common Tier Skills ---

    'vitality-boost': ({ player, level }) => {
        const isSynergy = player.element === 'Neutral';
        const baseHp = 15 + ((level - 1) * 10);
        const hpBonus = isSynergy ? (baseHp * 2) : baseHp;

        return {
            value: 0,
            hpMod: hpBonus,
            log: `❤️ Vitality Boost Lv.${level} Max HP +${hpBonus}${isSynergy ? ' (Neutral Bonus!)' : ''}`
        };
    },

    'gold-finder': ({ level }) => {
        const goldBonus = 0.10 + ((level - 1) * 0.02);
        return {
            value: Math.floor(100 * goldBonus),
            log: `⭐ Gold Finder Lv.${level} ได้รับ Gold +${Math.round(goldBonus * 100)}%`
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
            hpMod: 0, // ปรับเป็น 0 เพราะเป็นการ Heal ไม่ใช่เพิ่ม MaxHP ถาวร
            log: `${isSynergy ? '💧 [Water Synergy]' : '💧 [Water Purify]'} Lv.${level} ฟื้นฟู +${healAmount} HP และลบสถานะผิดปกติ`
        };
    },

    'earth-wall': ({ player, level }) => {
        const isSynergy = player.element === 'Earth';
        const defPercent = 0.20 + ((level - 1) * 0.02);
        const displayDefBonus = Math.floor(player.def * defPercent);
        const atkPenaltyPercent = !isSynergy ? 0.05 : 0;

        return {
            value: 0,
            defPercent: defPercent,
            atkPercent: -atkPenaltyPercent,
            log: `${isSynergy ? '🌱 [Earth Synergy]' : '🌱 [Earth Wall]'} Lv.${level} DEF +${displayDefBonus}${!isSynergy ? ` (ATK -${Math.floor(player.atk * 0.05)})` : ''}`
        };
    },

    'wind-dash': ({ player, level }) => {
        const isSynergy = player.element === 'Wind';
        const baseChance = isSynergy ? 0.30 : 0.20;
        const chance = baseChance + ((level - 1) * 0.02);
        const counterDamage = Math.floor(player.atk * 0.50);

        return {
            action: 'counter',
            chance: chance,
            value: counterDamage,
            log: `${isSynergy ? '🌪️ [Wind Synergy]' : '🌪️ [Wind Dash]'} Lv.${level} โอกาสหลบ ${Math.round(chance * 100)}% | สวนกลับ ${Math.round(0.50 * 100)}% ATK`
        };
    },

    'light-blessing': ({ player, level }) => {
        const isSynergy = player.element === 'Light';
        const healPercent = 0.05 + ((level - 1) * 0.01);
        const atkPercent = (isSynergy ? 0.15 : 0.10) + ((level - 1) * 0.01);
        const healAmount = Math.floor(player.maxHp * healPercent);
        const displayAtkBonus = Math.floor(player.atk * atkPercent);

        return {
            value: healAmount,
            atkPercent: atkPercent,
            log: `${isSynergy ? '☀️ [Light Synergy]' : '☀️ [Light Blessing]'} Lv.${level} ฟื้นฟู +${healAmount} HP/เทิร์น ATK +${displayAtkBonus}`
        };
    },

    'dark-corruption': ({ player, level }) => {
        const isSynergy = player.element === 'Dark';
        const enemyDefReduction = 0.15 + ((level - 1) * 0.01);
        const hpPenaltyPercent = !isSynergy ? (0.03 + (level - 1) * 0.01) : 0;
        const hpPenaltyFlat = Math.floor(player.maxHp * hpPenaltyPercent);

        return {
            value: -enemyDefReduction,
            hpMod: -hpPenaltyFlat,
            log: `${isSynergy ? '🌙 [Dark Synergy]' : '🌙 [Dark Corruption]'} Lv.${level} ลด DEF ศัตรู ${Math.round(enemyDefReduction * 100)}%${!isSynergy ? ` (เสีย HP -${hpPenaltyFlat}/เทิร์น)` : ''}`
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

    'lifesteal-vamp': ({ level }) => {
        const lifestealPercent = 0.15 + ((level - 1) * 0.02);
        const triggerChance = 0.30;

        return {
            chance: triggerChance,
            value: lifestealPercent * 100,
            log: `🩸 Vampiric Touch Lv.${level} (โอกาส ${triggerChance * 100}%) ดูดเลือดคืน ${Math.round(lifestealPercent * 100)}%`
        };
    },

    'armor-penetration': ({ player, level }) => {
        const penetrationPercent = 0.30 + ((level - 1) * 0.02);
        const atkPenaltyPercent = 0.10;
        const displayAtkPenalty = Math.floor(player.atk * atkPenaltyPercent);

        return {
            value: penetrationPercent * 100,
            atkPercent: -atkPenaltyPercent,
            log: `⚔️ Armor Penetration Lv.${level} ทะลุ DEF ${Math.round(penetrationPercent * 100)}% (ATK -${displayAtkPenalty})`
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
                log: `👑 [Elemental Mastery] = (Neutral): พลังไร้ธาตุขั้นสุดยอด! (ATK +${Math.round(nAtk * 100)}% / DEF +${Math.round(nDef * 100)}% / HP +${Math.round(nHp * 100)}%)`
            };
        }

        return {
            value: 0,
            atkPercent: atkPercent,
            defPercent: defPercent,
            hpPercent: hpPercent,
            log: `👑 [Elemental Mastery] (${player.element}): ATK +${Math.round(atkPercent * 100)}% | DEF +${Math.round(defPercent * 100)}% | HP +${Math.round(hpPercent * 100)}%`
        };
    },

    // #endregion
}; // <-- ตรวจสอบให้แน่ใจว่ามีปีกกาปิดอันนี้อยู่ที่ท้ายไฟล์สุดๆ

