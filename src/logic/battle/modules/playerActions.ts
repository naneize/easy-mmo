import { BattleLogger as Log } from "../../battleLogger";
import { processTriggerSkills } from '../skillProcessor';
import { initializeMonster } from '../../../data/monsters';
import { getElementMultiplier } from '../../elementalLogic'; // อย่าลืม Import ฟังก์ชันธาตุมานะครับ
import type { BattleLogEntry } from '../../../types/game';

export const handlePlayerTurn = (
    p_hp: number,
    m_hp: number,
    currentAtk: number,
    player: any,
    monster: any,
    allEffects: any[],
    bonusStats: any,
    maxHp: number
) => {
    const turnLogs: BattleLogEntry[] = [];
    let currentPHp = p_hp;
    let currentMHp = m_hp;

    const initializedMonster = initializeMonster(monster);

    // 1. Regen
    if (bonusStats.regen_flat > 0 && currentPHp < maxHp) {
        const heal = Math.min(maxHp - currentPHp, bonusStats.regen_flat);
        currentPHp += heal;
        turnLogs.push(Log.regen(heal, currentPHp));
    }

    // 2. Trigger Skills (on-hit)
    const { extraValue: pExtraAtk, triggerLogs, actions } =
        processTriggerSkills('on-hit', allEffects, player, monster, currentAtk);
    turnLogs.push(...triggerLogs);

    // 3. Damage Calculation & Elemental System
    // 🎲 เพิ่ม Damage Variance ±10%
    const getVariance = () => 0.9 + (Math.random() * 0.2);
    const elementMult = getElementMultiplier(player.element, monster.element);

    const effectiveMonsterDef = Math.floor(initializedMonster.def * (1 - bonusStats.armor_pen));
    const rawDmg = Math.max((currentAtk + pExtraAtk) - effectiveMonsterDef, 1);

    // คำนวณดาเมจพื้นฐานที่รวมธาตุและ Variance แล้ว
    const calculateFinalHit = () => Math.floor(rawDmg * elementMult * getVariance());

    let pDmg = calculateFinalHit();
    const baseDmgForDouble = pDmg; // เก็บค่าไว้สำหรับ Double Attack (หรือจะสุ่มใหม่ก็ได้)

    // 4. Critical
    let isCrit = Math.random() < bonusStats.crit_chance;
    if (isCrit) {
        pDmg = Math.floor(pDmg * bonusStats.crit_multi);
        currentMHp -= pDmg;
        turnLogs.push(Log.critical('คุณ', monster.name, pDmg, bonusStats.crit_multi, Math.max(0, currentMHp)));
    } else {
        currentMHp -= pDmg;
        turnLogs.push(Log.attack('คุณ', monster.name, pDmg, Math.max(0, currentMHp)));
    }

    // 5. Life Steal (อิงจากดาเมจจริงที่ทำได้)
    if (bonusStats.lifesteal_percent > 0 && Math.random() <= (bonusStats.lifesteal_chance || 0)) {
        const heal = Math.round(pDmg * (bonusStats.lifesteal_percent / 100));
        const actualHeal = Math.min(heal, maxHp - currentPHp);
        currentPHp += actualHeal;
        if (actualHeal > 0) {
            turnLogs.push({ type: 'lifesteal', text: `🩸 ดูดเลือดฟื้นฟู +${actualHeal} HP` } as any);
        }
    }

    // 6. Double Attack
    if (actions.includes('double-attack') && currentMHp > 0) {
        // สุ่ม Variance ใหม่สำหรับการโจมตีครั้งที่สองเพื่อให้ดูสมจริง
        const secondHitDmg = Math.floor(rawDmg * elementMult * getVariance());
        currentMHp -= secondHitDmg;
        turnLogs.push(Log.doubleAttack('คุณ', monster.name, secondHitDmg, Math.max(0, currentMHp)));
    }

    return { p_hp: currentPHp, m_hp: currentMHp, logs: turnLogs };
};