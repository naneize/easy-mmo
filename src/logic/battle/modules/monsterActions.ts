import { BattleLogger as Log } from "../../battleLogger";
import { processTriggerSkills } from '../skillProcessor';
import { initializeMonster } from '../../../data/monsters';

export const handleMonsterTurn = (
    p_hp: number,
    m_hp: number,
    monsterAtk: number,
    currentDef: number,
    player: any,
    monster: any,
    allEffects: any[],
    bonusStats: any,
    playerClass: any
) => {
    const turnLogs: any[] = [];
    let currentPHp = p_hp;
    let currentMHp = m_hp;

    const initializedMonster = initializeMonster(monster);

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

        // เพิ่ม Damage Variance ±10% (สุ่มค่าระหว่าง 0.9 ถึง 1.1)
        const variance = 0.9 + (Math.random() * 0.2);

        // คำนวณดาเมจพื้นฐาน (ATK - DEF) โดยมีค่าขั้นต่ำคือ 1
        const baseDmg = Math.max(monsterAtk - currentDef, 1);

        // คำนวณดาเมจสุดท้ายหลังรวมความไม่แน่นอน
        const variedDmg = Math.max(Math.round(baseDmg * variance), 1);

        const dmgReduction = typeof bonusStats?.dmgReduction === 'number' ? bonusStats.dmgReduction : 0;
        const reducedDmg = variedDmg * (1 - dmgReduction);
        let finalMDmg = Math.max(Math.floor(reducedDmg), 1);

        if (dmgReduction > 0) {
            const reducedAmount = Math.max(0, variedDmg - finalMDmg);
            if (reducedAmount > 0) {
                turnLogs.push({
                    type: 'skill',
                    text: `🛡️ ลดความเสียหาย ${Math.round(dmgReduction * 100)}% (-${reducedAmount})`
                } as any);
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
            turnLogs.push(Log.critical(monster.name, 'คุณ', finalMDmg, critDamage, currentPHp));
        } else {
            // ส่งค่า finalMDmg เข้า Log เพื่อแสดงผลตัวเลขที่แกว่งจริงในเกม
            turnLogs.push(Log.attack(monster.name, 'คุณ', finalMDmg, currentPHp));
        }

        if (playerClass?.specialEffect?.id === 'thorns' && Math.random() < 0.1 && finalMDmg > 0) {
            const reflected = Math.max(1, Math.floor(finalMDmg * 0.3));
            currentMHp -= reflected;
            turnLogs.push({ type: 'skill', text: `🌿 Thorns Reflected! สะท้อน ${reflected} DMG` } as any);
        }
    }

    return { p_hp: currentPHp, m_hp: currentMHp, logs: turnLogs };
};