import { BattleLogger as Log } from "../../battleLogger";
import { processTriggerSkills } from '../skillProcessor';
import { initializeMonster } from '../../../data/monsters';
import type { BattleLogEntry } from '../../../types/game';

export const handlePlayerTurn = (
    p_hp: number,
    m_hp: number,
    currentAtk: number,
    player: any,
    monster: any,
    allEffects: any[],
    bonusStats: any,
    maxHp: number,
    turn: number,
    playerClass: any
) => {
    const turnLogs: BattleLogEntry[] = [];
    let currentPHp = p_hp;
    let currentMHp = m_hp;

    const initializedMonster = initializeMonster(monster);

    // 1. Regen (ระบบใหม่ % Max HP)
    const regenRate = bonusStats.regen_percent || 0;
    if (regenRate > 0 && currentPHp < maxHp) {
        // คำนวณเลือดที่จะฮีลจาก % ของ Max HP
        const healAmt = Math.floor(maxHp * regenRate);
        const actualHeal = Math.min(maxHp - currentPHp, healAmt);

        if (actualHeal > 0) {
            currentPHp += actualHeal;
            // ใช้ Log.regen เหมือนเดิม หรือเขียน Text เองก็ได้ครับ
            turnLogs.push(Log.regen(actualHeal, currentPHp));
        }
    }

    // 2. Trigger Skills (on-hit)
    const { extraValue: pExtraAtk, triggerLogs, actions } =
        processTriggerSkills('on-hit', allEffects, player, monster, currentAtk);
    turnLogs.push(...triggerLogs);

    const bloodlustActive = playerClass?.specialEffect?.id === 'bloodlust' && (currentPHp / Math.max(1, maxHp)) < 0.3;
    const bloodlustAtk = bloodlustActive ? (currentAtk * 0.2) : 0;
    if (bloodlustActive) {
        turnLogs.push({ type: 'skill', text: `🔥 Bloodlust Activated! ATK +20%` } as any);
    }

    // 3. Damage Calculation & Elemental System
    // 🎲 เพิ่ม Damage Variance ±10%
    const getVariance = () => 0.9 + (Math.random() * 0.2);
    const elementMult = 1;

    const effectiveMonsterDef = Math.floor(initializedMonster.def * (1 - bonusStats.armor_pen));
    const rawDmg = Math.max(((currentAtk + bloodlustAtk) + pExtraAtk) - effectiveMonsterDef, 1);

    // คำนวณดาเมจพื้นฐานที่รวม Variance แล้ว
    const calculateFinalHit = () => Math.floor(rawDmg * elementMult * getVariance());

    let pDmg = calculateFinalHit();
    const baseDmgForDouble = pDmg; // เก็บค่าไว้สำหรับ Double Attack (หรือจะสุ่มใหม่ก็ได้)

    const arcaneEchoActive = playerClass?.specialEffect?.id === 'arcane-echo' && turn % 3 === 0;
    const arcaneEchoMult = 1.3;
    if (arcaneEchoActive) {
        pDmg = Math.max(1, Math.floor(pDmg * arcaneEchoMult));
        turnLogs.push({ type: 'skill', text: `✨ Arcane Echo Damage! (x${arcaneEchoMult})` } as any);
    }

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
        const heal = Math.round(pDmg * bonusStats.lifesteal_percent);
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