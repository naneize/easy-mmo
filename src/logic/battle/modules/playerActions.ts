import i18next from 'i18next';
import { processTriggerSkills } from '../skillProcessor';
import { initializeMonster } from '../../../data/monsters';
import type { BattleLogEntry } from '../../../types/game';
import { BattleLogger as Log } from "../../battleLogger";

// ประกาศตัวแปร t ให้เรียกใช้ i18next.t ได้เลย
const t = (key: string, params?: Record<string, any>) => i18next.t(key, params) as string;

export const handlePlayerTurn = (
    p_hp: number,
    m_hp: number,
    currentAtk: number,
    player: any,
    monster: any,
    allEffects: any[],
    bonusStats: any,
    baseEffectiveMaxHp: number,
    turn: number,
    playerClass: string,
    pElementMult: number
): { p_hp: number; m_hp: number; logs: BattleLogEntry[] } => {

    const turnLogs: BattleLogEntry[] = [];
    let currentPHp = p_hp;
    let currentMHp = m_hp;

    const initializedMonster = initializeMonster(monster);

    // เตรียมชื่อที่แปลแล้ว
    const monsterName = t(`monsters.${monster.id}.name`);
    const playerName = t('battleLog.you');

    // 1. Regen
    const regenRate = bonusStats.regen_percent || 0;
    if (regenRate > 0 && currentPHp < baseEffectiveMaxHp) {
        const healAmt = Math.floor(baseEffectiveMaxHp * regenRate);
        const actualHeal = Math.min(baseEffectiveMaxHp - currentPHp, healAmt);

        if (actualHeal > 0) {
            currentPHp += actualHeal;
            turnLogs.push(Log.regen(actualHeal, currentPHp));
        }
    }

    // 2. Trigger Skills (on-hit)
    const { extraValue: pExtraAtk, triggerLogs, actions } =
        processTriggerSkills('on-hit', allEffects, player, monster, currentAtk);
    turnLogs.push(...triggerLogs);

    const bloodlustActive = playerClass && (playerClass === 'berserker') && (currentPHp / Math.max(1, baseEffectiveMaxHp)) < 0.3;
    const bloodlustAtk = bloodlustActive ? (currentAtk * 0.2) : 0;
    if (bloodlustActive) {
        turnLogs.push({ type: 'skill', text: t('battleLog.bloodlustActivated') });
    }

    // 3. Damage Calculation
    const getVariance = () => 0.9 + (Math.random() * 0.2);
    const elementMult = 1;

    const effectiveMonsterDef = Math.floor(initializedMonster.def * (1 - bonusStats.armor_pen));
    const rawDmg = Math.max(((currentAtk + bloodlustAtk) + pExtraAtk) - effectiveMonsterDef, 1);

    const calculateFinalHit = () => Math.floor(rawDmg * elementMult * getVariance());

    let pDmg = calculateFinalHit();

    const arcaneEchoActive = playerClass && (playerClass === 'mage') && turn % 3 === 0;
    const arcaneEchoMult = 1.3;
    if (arcaneEchoActive) {
        pDmg = Math.max(1, Math.floor(pDmg * arcaneEchoMult));
        turnLogs.push({ type: 'skill', text: t('battleLog.arcaneEchoDamage', { mult: arcaneEchoMult }) });
    }

    // 4. Critical Calculation (คำนวณเลขเบื้องต้น)
    let isCrit = Math.random() < bonusStats.crit_chance;
    if (isCrit) {
        pDmg = Math.floor(pDmg * bonusStats.crit_multi);
    }

    // 🚩 [FINAL CALCULATION] รวมร่าง Final Damage และ ธาตุ
    const battleFocus = allEffects.find(eff => eff.id === 'battle-focus');
    const bfMultiplier = (battleFocus && 'level' in battleFocus)
        ? 1 + (0.05 + (battleFocus.level - 1) * 0.005)
        : 1;

    // คำนวณดาเมจสุดท้ายที่รวมทุกอย่างแล้ว (คริ + ธาตุ + Battle Focus)
    pDmg = Math.floor(pDmg * (pElementMult || 1) * bfMultiplier);

    // 5. Update Monster HP and Logs (หักเลือดและแสดงผลแค่ "ครั้งเดียว" ตรงนี้)
    currentMHp -= pDmg;
    if (isCrit) {
        turnLogs.push(Log.critical(playerName, monsterName, pDmg, bonusStats.crit_multi, Math.max(0, currentMHp)));
    } else {
        turnLogs.push(Log.attack(playerName, monsterName, pDmg, Math.max(0, currentMHp)));
    }

    // 5. Life Steal (✅ แก้ไขชื่อแหล่งที่มา)
    if (bonusStats.lifesteal_percent > 0 && Math.random() <= (bonusStats.lifesteal_chance || 0)) {
        const heal = Math.round(pDmg * bonusStats.lifesteal_percent);
        const actualHeal = Math.min(heal, baseEffectiveMaxHp - currentPHp);
        currentPHp += actualHeal;
        if (actualHeal > 0) {
            turnLogs.push(Log.lifesteal(playerName, actualHeal, currentPHp));
        }
    }

    // 6. Double Attack (✅ แก้ไขชื่อผู้เล่นและมอนสเตอร์)
    if (actions.includes('double-attack') && currentMHp > 0) {
        const secondHitDmg = Math.floor(rawDmg * elementMult * getVariance());
        currentMHp -= secondHitDmg;
        turnLogs.push(Log.doubleAttack(playerName, monsterName, secondHitDmg, Math.max(0, currentMHp)));
    }

    return { p_hp: currentPHp, m_hp: currentMHp, logs: turnLogs };
};