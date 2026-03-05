import i18next from 'i18next';
import { BattleLogger as Log } from "../../battleLogger";
import { processTriggerSkills } from '../skillProcessor';
import { initializeMonster } from '../../../data/monsters';
import type { BattleLogEntry } from '../../../types/game';

// ประกาศตัวแปร t ให้ดึงค่าจาก i18next โดยตรง
const t = (key: string, params?: Record<string, any>) => i18next.t(key, params) as string;

export const handleMonsterTurn = (
    p_hp: number,
    m_hp: number,
    monsterAtk: number,
    currentDef: number,
    player: any,
    monster: any,
    allEffects: any[],
    bonusStats: any,
    baseEffectiveMaxHp: number,
    turn: number,
    playerClass: string
): { p_hp: number; m_hp: number; logs: BattleLogEntry[] } => {

    const turnLogs: BattleLogEntry[] = [];
    let currentPHp = p_hp;
    let currentMHp = m_hp;

    const initializedMonster = initializeMonster(monster);

    // เตรียมชื่อที่แปลแล้ว
    const monsterName = t(`monsters.${monster.id}.name`);
    const playerName = t('battleLog.you');

    // 1. Check Dodge / Counter
    const { extraValue: counterDmg, actions, triggerLogs } =
        processTriggerSkills('on-defend', allEffects, player, monster, monsterAtk);

    if ((actions as string[]).includes('counter')) {
        turnLogs.push(...triggerLogs);
        turnLogs.push(Log.dodge(playerName)); // ✅ เปลี่ยนจาก 'คุณ'
        currentMHp -= counterDmg;
        turnLogs.push(Log.counter(playerName, monsterName, counterDmg, currentMHp)); // ✅ ใช้ชื่อที่แปลแล้ว
    } else {
        // 2. Normal Damage
        const variance = 0.9 + (Math.random() * 0.2);
        const baseDmg = Math.max(monsterAtk - currentDef, 1);
        const variedDmg = Math.max(Math.round(baseDmg * variance), 1);

        const dmgReduction = typeof bonusStats?.dmgReduction === 'number' ? bonusStats.dmgReduction : 0;
        const reducedDmg = variedDmg * (1 - dmgReduction);
        let finalMDmg = Math.max(Math.floor(reducedDmg), 1);

        if (dmgReduction > 0) {
            const reducedAmount = Math.max(0, variedDmg - finalMDmg);
            if (reducedAmount > 0) {
                turnLogs.push({
                    type: 'skill',
                    text: t('battleLog.damageReduction', { percent: Math.round(dmgReduction * 100), amount: reducedAmount })
                });
            }
        }

        // 3. Monster Critical
        const critChance = initializedMonster.critChance ?? 0;
        const critDamage = initializedMonster.critDamage ?? 1;
        const isCrit = Math.random() < critChance;
        if (isCrit) {
            finalMDmg = Math.max(1, Math.floor(finalMDmg * critDamage));
        }

        currentPHp -= finalMDmg;

        if (isCrit) {
            // ✅ ใช้ monsterName และ playerName
            turnLogs.push(Log.critical(monsterName, playerName, finalMDmg, critDamage, currentPHp));
        } else {
            // ✅ ใช้ monsterName และ playerName
            turnLogs.push(Log.attack(monsterName, playerName, finalMDmg, currentPHp));
        }

        // ระบบสะท้อนหนาม (Thorns Reflected)
        if (playerClass && (playerClass === 'guardian') && Math.random() < 0.1 && finalMDmg > 0) {
            const reflected = Math.max(1, Math.floor(finalMDmg * 0.3));
            currentMHp -= reflected;
            turnLogs.push({
                type: 'skill',
                text: t('battleLog.thornsReflected', { dmg: reflected })
            });
        }
    }

    return { p_hp: currentPHp, m_hp: currentMHp, logs: turnLogs };
};