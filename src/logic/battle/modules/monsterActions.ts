import { BattleLogger as Log } from "../../battleLogger";
import { processTriggerSkills } from '../skillProcessor';

export const handleMonsterTurn = (
    p_hp: number,
    m_hp: number,
    monsterAtk: number,
    currentDef: number,
    player: any,
    monster: any,
    allEffects: any[]

) => {
    const turnLogs: any[] = [];
    let currentPHp = p_hp;
    let currentMHp = m_hp;

    // 1. Check Dodge / Counter
    const { extraValue: counterDmg, actions, triggerLogs } =
        processTriggerSkills('on-defend', allEffects, player, monster, monsterAtk);

    if ((actions as string[]).includes('counter')) {
        turnLogs.push(...triggerLogs);
        turnLogs.push(Log.dodge('คุณ'));
        currentMHp -= counterDmg;
        turnLogs.push(Log.counter('คุณ', monster.name, counterDmg, currentMHp));
    } else {
        // 2. Normal Damage
        const mDmg = Math.max(Math.floor(monsterAtk - currentDef), 1);
        currentPHp -= mDmg;
        turnLogs.push(Log.attack(monster.name, 'คุณ', mDmg, currentPHp));
    }

    return { p_hp: currentPHp, m_hp: currentMHp, logs: turnLogs };
};