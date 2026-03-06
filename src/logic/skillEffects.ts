import i18next from 'i18next'; // 1. นำเข้า i18next
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
    multiplier?: number;
}

// Helper สำหรับแปลภาษาภายในไฟล์นี้
const t = (key: string, params?: Record<string, any>) => i18next.t(key, params) as string;

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
            log: (isSynergy ? t('battleLog.synergyPrefix') : '') +
                t('skills.spark-burst.log', { level, dmg: scaledValue }),
        };
    },

    'aegis-guard': ({ player, baseValue, level }) => {
        const isSynergy = player.element === 'Neutral';
        const reductionBase = isSynergy ? 0.55 : 0.50;
        const finalReduction = reductionBase + ((level - 1) * 0.015);

        return {
            chance: 0.35,
            value: Math.floor(baseValue * finalReduction),
            log: (isSynergy ? t('battleLog.synergyPrefix') : '') +
                t('skills.aegis-guard.log', { level, percent: Math.round(finalReduction * 100) }),
        };
    },

    'blade-dance': ({ player, level }) => {
        const isSynergy = player.element === 'Neutral';
        const baseAtkPercent = isSynergy ? 0.35 : 0.20;
        const atkPercent = baseAtkPercent + ((level - 1) * 0.03);
        const addedAtkValue = Math.floor(player.atk * atkPercent);

        return {
            value: 0,
            atkPercent: atkPercent,
            log: (isSynergy ? t('battleLog.synergyPrefix') : '') +
                t('skills.blade-dance.log', { level, percent: Math.round(atkPercent * 100), atk: addedAtkValue })
        };
    },

    'calm-focus': ({ player, level }) => {
        const isSynergy = player.element === 'Neutral';
        const basePercent = isSynergy ? 0.02 : 0.01;
        const regenPercent = basePercent + ((level - 1) * 0.005);

        return {
            value: 0,
            regen_percent: regenPercent,
            log: (isSynergy ? t('battleLog.synergyPrefix') : '') +
                t('skills.calm-focus.log', { level, percent: (regenPercent * 100).toFixed(1) })
        };
    },

    // #region --- Passive Synergy ---

    'blazing-soul': ({ player, level }) => {
        const isSynergy = player.element === 'Fire';
        const levelBonus = (level - 1) * 0.015;
        const bonusMult = isSynergy ? (0.20 + levelBonus) : (0.10 + levelBonus);

        return {
            value: 0,
            atkPercent: bonusMult,
            log: (isSynergy ? `🔥 ${t('battleLog.synergyPrefix')} ` : '🔥 ') +
                t('skills.blazing-soul.log', { level, percent: Math.round(bonusMult * 100) })
        };
    },

    'tidal-grace': ({ player, level }) => {
        const isSynergy = player.element === 'Water';
        const hpPercent = (isSynergy ? 0.05 : 0.02) + ((level - 1) * 0.003);
        const healAmt = Math.floor(player.maxHp * hpPercent);

        return {
            value: healAmt,
            log: (isSynergy ? `💧 ${t('battleLog.synergyPrefix')} ` : '💧 ') +
                t('skills.tidal-grace.log', { level, heal: healAmt, percent: (hpPercent * 100).toFixed(1) })
        };
    },

    'stone-skin': ({ player, level }) => {
        const isSynergy = player.element === 'Earth';
        const baseDefPercent = isSynergy ? 0.25 : 0.10;
        const defPercent = baseDefPercent + ((level - 1) * 0.03);

        return {
            value: 0,
            defPercent: defPercent,
            log: (isSynergy ? `🌱 ${t('battleLog.synergyPrefix')} ` : '🛡️ ') +
                t('skills.stone-skin.log', { level, percent: Math.round(defPercent * 100) })
        };
    },

    'tailwind-strike': ({ player, level }) => {
        const isSynergy = player.element === 'Wind';
        const chance = (isSynergy ? 0.30 : 0.10) + ((level - 1) * 0.01);

        return {
            action: 'double-attack',
            value: 0,
            chance: chance,
            log: (isSynergy ? `🌪️ ${t('battleLog.synergyPrefix')} ` : '🌪️ ') +
                t('skills.tailwind-strike.log', { chance: Math.round(chance * 100) })
        };
    },

    'holy-aura': ({ player, level }) => {
        const isSynergy = player.element === 'Light';
        const dmgReduction = (isSynergy ? 0.25 : 0.10) + ((level - 1) * 0.015);

        return {
            chance: 1.0,
            value: dmgReduction,
            log: (isSynergy ? `☀️ ${t('battleLog.synergyPrefix')} ` : '☀️ ') +
                t('skills.holy-aura.log', { level, percent: Math.round(dmgReduction * 100) })
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
            log: (isSynergy ? `🌙 ${t('battleLog.synergyPrefix')} ` : '🌙 ') +
                t('skills.dark-pact.log', {
                    level,
                    atk: Math.round(atkPercent * 100),
                    def: Math.round(defPenaltyPercent * 100),
                    isSynergy
                })
        };
    },

    'vitality-boost': ({ player, level }) => {
        const isSynergy = player.element === 'Neutral';
        const baseHpPercent = 0.15 + ((level - 1) * 0.02);
        const hpPercent = isSynergy ? baseHpPercent * 2 : baseHpPercent;

        return {
            value: 0,
            hpPercent: hpPercent,
            log: (isSynergy ? `⚪ ${t('battleLog.synergyPrefix')} ` : '❤️ ') +
                t('skills.vitality-boost.log', { level, percent: Math.round(hpPercent * 100) })
        };
    },

    'gold-finder': ({ level }) => {
        const goldBonusPercent = 0.10 + ((level - 1) * 0.02);
        return {
            multiplier: 1 + goldBonusPercent,
            value: Math.round(goldBonusPercent * 100),
            log: `⭐ ` + t('skills.gold-finder.log', { level, percent: Math.round(goldBonusPercent * 100) })
        };
    },

    'fire-ember': ({ player, level }) => {
        const isSynergy = player.element === 'Fire';
        const baseChance = isSynergy ? 0.25 : 0.15;
        const chance = baseChance + ((level - 1) * 0.02);
        const bonusDamage = Math.floor(player.atk * 0.50);

        return {
            chance: chance,
            value: bonusDamage,
            log: (isSynergy ? `🔥 ${t('battleLog.synergyPrefix')} ` : '🔥 ') +
                t('skills.fire-ember.log', { level, chance: Math.round(chance * 100), dmg: bonusDamage })
        };
    },

    'water-purify': ({ player, level }) => {
        const isSynergy = player.element === 'Water';
        const healPercent = (isSynergy ? 0.12 : 0.08) + ((level - 1) * 0.01);
        const healAmount = Math.floor(player.maxHp * healPercent);

        return {
            value: healAmount,
            log: (isSynergy ? `💧 ${t('battleLog.synergyPrefix')} ` : '💧 ') +
                t('skills.water-purify.log', { level, heal: healAmount, percent: Math.round(healPercent * 100) })
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
            log: (isSynergy ? `🌱 ${t('battleLog.synergyPrefix')} ` : '🛡️ ') +
                t('skills.earth-wall.log', {
                    level,
                    def: Math.round(defPercent * 100),
                    atk: Math.round(atkPenaltyPercent * 100),
                    isSynergy
                })
        };
    },

    'wind-dash': ({ player, level }) => {
        const isSynergy = player.element === 'Wind';
        const chance = (isSynergy ? 0.30 : 0.20) + ((level - 1) * 0.02);
        const counterDamagePercent = 0.50;

        return {
            action: 'counter',
            chance: chance,
            value: counterDamagePercent * 100,
            log: (isSynergy ? `🌪️ ${t('battleLog.synergyPrefix')} ` : '💨 ') +
                t('skills.wind-dash.log', { level, chance: Math.round(chance * 100), counter: Math.round(counterDamagePercent * 100) })
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
            log: (isSynergy ? `☀️ ${t('battleLog.synergyPrefix')} ` : '☀️ ') +
                t('skills.light-blessing.log', { level, heal: healAmount, atk: Math.round(atkPercent * 100) })
        };
    },

    'dark-corruption': ({ player, level }) => {
        const isSynergy = player.element === 'Dark';
        const enemyDefReduction = 0.15 + ((level - 1) * 0.01);
        const hpPenaltyPercent = !isSynergy ? (0.03 + (level - 1) * 0.01) : 0;

        return {
            value: -enemyDefReduction * 100,
            hpPercent: -hpPenaltyPercent,
            log: (isSynergy ? `🌙 ${t('battleLog.synergyPrefix')} ` : '🌙 ') +
                t('skills.dark-corruption.log', {
                    level,
                    def: Math.round(enemyDefReduction * 100),
                    hp: Math.round(hpPenaltyPercent * 100),
                    isSynergy
                })
        };
    },

    'critical-strike': ({ level }) => {
        const chance = 0.08 + ((level - 1) * 0.01);
        return {
            value: chance * 100,
            log: `🎯 ` + t('skills.critical-strike.log', { level, chance: Math.round(chance * 100) })
        };
    },

    'critical-mastery': ({ level }) => {
        const damageBonus = 0.20 + ((level - 1) * 0.05);
        return {
            value: damageBonus * 100,
            log: `⚡ ` + t('skills.critical-mastery.log', { level, bonus: Math.round(damageBonus * 100) })
        };
    },

    'lifesteal-vamp': ({ player, level }) => {
        const lifestealPercent = 0.15 + ((level - 1) * 0.02);
        const triggerChance = 0.30;
        const estHeal = Math.floor(player.atk * lifestealPercent);

        return {
            chance: triggerChance,
            value: lifestealPercent * 100,
            log: `🩸 ` + t('skills.lifesteal-vamp.log', { level, chance: triggerChance * 100, percent: Math.round(lifestealPercent * 100), heal: estHeal })
        };
    },

    'armor-penetration': ({ level }) => {
        const penetrationPercent = 0.30 + ((level - 1) * 0.02);
        const atkPenaltyPercent = 0.10;

        return {
            value: penetrationPercent * 100,
            atkPercent: -atkPenaltyPercent,
            log: `⚔️ ` + t('skills.armor-penetration.log', { level, pen: Math.round(penetrationPercent * 100), atk: Math.round(atkPenaltyPercent * 100) })
        };
    },

    'elemental-mastery': ({ player, level }) => {
        const hasElementalAffinity = player.element !== 'Neutral';

        if (!hasElementalAffinity) {
            const nAtk = 0.30 + ((level - 1) * 0.04);
            const nDef = 0.25 + ((level - 1) * 0.03);
            const nHp = 0.20 + ((level - 1) * 0.03);
            return {
                atkPercent: nAtk, defPercent: nDef, hpPercent: nHp,
                log: `👑 ` + t('skills.elemental-mastery.neutralLog', { atk: Math.round(nAtk * 100), def: Math.round(nDef * 100), hp: Math.round(nHp * 100) })
            };
        }

        const atk = 0.25 + ((level - 1) * 0.03);
        const def = 0.20 + ((level - 1) * 0.02);
        const hp = 0.15 + ((level - 1) * 0.02);
        return {
            atkPercent: atk, defPercent: def, hpPercent: hp,
            log: `👑 ` + t('skills.elemental-mastery.elementalLog', { element: player.element, atk: Math.round(atk * 100), def: Math.round(def * 100), hp: Math.round(hp * 100) })
        };
    },

    // #region --- Mercenary Path Skills ---

    'sturdy-body': ({ level }) => {
        const defPercent = 0.08 + ((level - 1) * 0.01);
        const percentValue = Math.round(defPercent * 100);
        return {
            value: 0,
            defPercent: defPercent,
            // ส่งทั้ง level, percent (สำหรับข้อความหลัก) และ def (สำหรับตัวเลขบวก)
            log: `🛡️ ` + t('skills.sturdy-body.log', {
                level,
                percent: percentValue,
                def: percentValue // ส่งค่าเปอร์เซ็นต์ไปโชว์ในช่อง {{def}}
            })
        };
    },

    'brute-force': ({ level }) => {
        const atkPercent = 0.08 + ((level - 1) * 0.01);
        const percentValue = Math.round(atkPercent * 100);
        return {
            value: 0,
            atkPercent: atkPercent,
            log: `⚔️ ` + t('skills.brute-force.log', {
                level,
                percent: percentValue,
                atk: percentValue // ส่งค่าเปอร์เซ็นต์ไปโชว์ในช่อง {{atk}}
            })
        };
    },

    'battle-focus': ({ level }) => {
        // ไม่ต้องส่ง atkPercent กลับไป เพื่อให้มันไปคำนวณที่ handlePlayerTurn ที่เดียว
        return {
            value: 0,
            // atkPercent: 0, // ลบทิ้ง หรือใส่เป็น 0
            log: `🎯 ` + t('skills.battle-focus.log', {
                level,
                percent: 5 + ((level - 1) * 0.5) // แค่ส่งไปโชว์ใน Log
            })
        };
    },
    // #endregion
};