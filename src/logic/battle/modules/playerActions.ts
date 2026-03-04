import { BattleLogger as Log } from "../../battleLogger";
import { processTriggerSkills } from '../skillProcessor';
import { initializeMonster } from '../../../data/monsters';

export const handlePlayerTurn = (
    p_hp: number,
    m_hp: number,
    currentAtk: number, // ค่านี้อาจจะ x3 มาแล้วถ้า Frenzy ทำงาน
    player: any,
    monster: any,
    allEffects: any[],
    bonusStats: any,
    maxHp: number
) => {
    const turnLogs = [];
    let currentPHp = p_hp;
    let currentMHp = m_hp;

    // คำนวณ stats จากระบบใหม่
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

    // 3. Damage Calculation
    const effectiveMonsterDef = Math.floor(initializedMonster.def * (1 - bonusStats.armor_pen));
    let pDmg = Math.max(Math.floor((currentAtk + pExtraAtk) - effectiveMonsterDef), 1);
    const baseDmg = pDmg;

    // 4. Critical
    let isCrit = Math.random() < bonusStats.crit_chance;
    if (isCrit) {
        pDmg = Math.floor(pDmg * bonusStats.crit_multi);
        turnLogs.push(Log.critical('คุณ', monster.name, pDmg, bonusStats.crit_multi, currentMHp - pDmg));
    } else {
        turnLogs.push(Log.attack('คุณ', monster.name, pDmg, currentMHp - pDmg));
    }
    currentMHp -= pDmg;

    // 5. Life Steal
    if (bonusStats.lifesteal_percent > 0 && Math.random() <= (bonusStats.lifesteal_chance || 0)) {
        const heal = Math.round(pDmg * (bonusStats.lifesteal_percent / 100));
        const actualHeal = Math.min(heal, maxHp - currentPHp);
        currentPHp += actualHeal;
        if (actualHeal > 0) {
            turnLogs.push({ type: 'lifesteal', text: `🩸 ดูดเลือดฟื้นฟู +${actualHeal} HP` });
        }
    }

    // 6. Double Attack
    if (actions.includes('double-attack') && currentMHp > 0) {
        currentMHp -= baseDmg;
        turnLogs.push(Log.doubleAttack('คุณ', monster.name, baseDmg, currentMHp));
    }

    return { p_hp: currentPHp, m_hp: currentMHp, logs: turnLogs };
};