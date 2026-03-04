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

    // 1. Check Dodge / Counter (ระบบหลบหลีกและสวนกลับ)
    const { extraValue: counterDmg, actions, triggerLogs } =
        processTriggerSkills('on-defend', allEffects, player, monster, monsterAtk);

    if ((actions as string[]).includes('counter')) {
        turnLogs.push(...triggerLogs);
        turnLogs.push(Log.dodge('คุณ'));
        currentMHp -= counterDmg;
        turnLogs.push(Log.counter('คุณ', monster.name, counterDmg, currentMHp));
    } else {
        // 2. Normal Damage (คำนวณดาเมจปกติ)

        // 🎲 เพิ่ม Damage Variance ±10% (สุ่มค่าระหว่าง 0.9 ถึง 1.1)
        const variance = 0.9 + (Math.random() * 0.2);

        // คำนวณดาเมจพื้นฐาน (ATK - DEF) โดยมีค่าขั้นต่ำคือ 1
        const baseDmg = Math.max(monsterAtk - currentDef, 1);

        // คำนวณดาเมจสุดท้ายหลังรวมความไม่แน่นอน
        const finalMDmg = Math.max(Math.round(baseDmg * variance), 1);

        currentPHp -= finalMDmg;

        // ส่งค่า finalMDmg เข้า Log เพื่อแสดงผลตัวเลขที่แกว่งจริงในเกม
        turnLogs.push(Log.attack(monster.name, 'คุณ', finalMDmg, currentPHp));
    }

    return { p_hp: currentPHp, m_hp: currentMHp, logs: turnLogs };
};