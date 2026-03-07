import i18next from 'i18next';
import type { BattleLogEntry } from '../types/game';

/**
 * ใช้ i18next.t โดยตรงแทนการรอรับฟังก์ชันจาก Component 
 * เพื่อป้องกันปัญหาแปลภาษาไม่ทำงานในช่วงเริ่มต้นเกม
 */

export const BattleLogger = {
    // --- การเริ่มต้น ---
    start: (name: string, hp: number): BattleLogEntry => ({
        type: 'start',
        text: i18next.t('battleLog.start', { name, hp: hp.toLocaleString() })
    }),

    turn: (num: number): BattleLogEntry => ({
        type: 'turn',
        text: i18next.t('battleLog.turn', { num })
    }),

    elementalNotice: (mult: number, pElem: string = 'Neutral', mElem: string = 'Neutral'): BattleLogEntry | null => {
        const playerType = pElem || 'Neutral';
        const monsterType = mElem || 'Neutral';

        if (mult !== 1) {
            return {
                type: 'elemental',
                playerElem: playerType,
                monsterElem: monsterType,
                text: i18next.t('battleLog.elementalNotice', { playerType, mult, monsterType })
            };
        }
        return null;
    },

    // --- ระบบสกิลและสถานะ ---
    regen: (amt: number, currentHp: number): BattleLogEntry => ({
        type: 'regen',
        text: i18next.t('battleLog.regen', { amt: Math.floor(amt).toLocaleString(), currentHp: Math.floor(currentHp).toLocaleString() })
    }),

    skill: (icon: string, name: string, effect: string): BattleLogEntry => ({
        type: 'skill',
        icon,
        text: i18next.t('battleLog.skill', { name, effect })
    }),

    attack: (attacker: string, target: string, dmg: number, hpLeft: number): BattleLogEntry => ({
        type: 'attack',
        text: i18next.t('battleLog.attack', { attacker, target, dmg: Math.floor(dmg).toLocaleString(), hpLeft: Math.max(0, Math.floor(hpLeft)).toLocaleString() })
    }),

    playerStatus: (currentHp: number, maxHp: number): BattleLogEntry => ({
        type: 'info',
        text: i18next.t('battleLog.playerStatus', { currentHp: Math.floor(currentHp).toLocaleString(), maxHp: maxHp.toLocaleString() })
    }),

    // --- ระบบเลเวลอัป (Level Up) ---
    levelUp: (lv: number): BattleLogEntry => ({
        type: 'levelup',
        text: i18next.t('battleLog.levelUp', { level: lv })
    }),

    statBonus: (hp: number, atk: number, def: number): BattleLogEntry => ({
        type: 'levelup',
        text: i18next.t('battleLog.statusUp', { hp, atk, def })
    }),

    // --- ระบบ Critical ---
    critical: (attacker: string, target: string, dmg: number, mult: number, hpLeft: number): BattleLogEntry => ({
        type: 'critical',
        text: i18next.t('battleLog.criticalHit', { attacker, target, dmg: Math.floor(dmg), mult, hpLeft: Math.max(0, Math.floor(hpLeft)) }),
        isCrit: true
    }),

    doubleAttack: (attacker: string, target: string, dmg: number, hpLeft: number): BattleLogEntry => ({
        type: 'synergy',
        text: i18next.t('battleLog.doubleAttack', { attacker, target, dmg: Math.floor(dmg), hpLeft: Math.max(0, Math.floor(hpLeft)) })
    }),

    // ระบบหลบหลีก (Dodge)
    dodge: (target: string): BattleLogEntry => ({
        type: 'dodge',
        text: i18next.t('battleLog.miss', { target })
    }),

    // ระบบโต้กลับ (Counter)
    counter: (attacker: string, target: string, dmg: number, hpLeft: number): BattleLogEntry => ({
        type: 'counter',
        text: i18next.t('battleLog.counterStrike', { attacker, target, dmg: Math.floor(dmg), hpLeft: Math.max(0, Math.floor(hpLeft)) })
    }),

    // ระบบดูดเลือด (Lifesteal)
    lifesteal: (sourceName: string, amt: number, currentHp: number): BattleLogEntry => ({
        type: 'lifesteal',
        text: i18next.t('battleLog.lifesteal', { sourceName, amt: Math.floor(amt), currentHp: Math.floor(currentHp) })
    }),

    // --- ✨ เพิ่มใหม่: ระบบสกิลและพาสซีฟของบอส (Boss Special) ---
    bossSkill: (bossName: string, skillName: string, effect: string): BattleLogEntry => ({
        type: 'boss_skill',
        text: i18next.t('battleLog.bossSkill', {
            name: bossName,
            skill: `[${skillName}]`,
            effect
        })
    }),

    bossPassive: (bossName: string, passiveName: string, effect: string, value: string = ""): BattleLogEntry => ({
        type: 'boss_passive',
        text: i18next.t('battleLog.bossPassive', {
            name: bossName,
            passive: `[${passiveName}]`,
            effect: effect,
            value: value // 👈 ส่งตัวแปรนี้เข้าไป เพื่อแทนที่ {{value}} ใน JSON
        })
    }),

    reflect: (bossName: string, dmg: number): BattleLogEntry => ({
        type: 'reflect',
        text: i18next.t('battleLog.reflect', { name: bossName, dmg: Math.floor(dmg).toLocaleString() })
    }),

    // --- สรุปผล ---
    win: (name: string, gold: number, exp: number, hpLeft: number): BattleLogEntry => ({
        type: 'win',
        text: i18next.t('battleLog.victory', { name, gold, hpLeft: Math.floor(hpLeft), exp })
    }),

    lose: (name: string, monsterHpLeft: number): BattleLogEntry => ({
        type: 'lose',
        text: i18next.t('battleLog.defeat', { name, monsterHpLeft: Math.floor(monsterHpLeft) })
    })
};