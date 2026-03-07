import type { Entity, MonsterData } from '../../types/game';
import { getMasteryBonus, calculatePlayerClass, getAllMasteryStats } from '../../utils/gameHelpers';
import { getElementMultiplier } from '../elementalLogic';

export const calculateInitialStats = (
    player: Entity,
    monster: MonsterData,
    allKills: Record<string, number>,
    allMonsters: MonsterData[],
    equippedSkills: Array<{ id: string }> = []
) => {
    const globalMasteryCalc = getAllMasteryStats(allKills, allMonsters);
    const currentMonsterKills = allKills[monster.id] || 0;
    const currentMastery = getMasteryBonus(monster, currentMonsterKills);

    const playerClass = calculatePlayerClass(equippedSkills);
    const classBonus = playerClass?.bonus || {};

    // ตรงนี้เก็บไว้เพื่อแสดง Log ในหน้าต่อสู้เฉยๆ 
    // แต่เราจะไม่เอาไปบวกเพิ่มใน simulateBattle อีกรอบ (เพราะ Dashboard บวกให้แล้ว)
    const masteryBonusStats = {
        atk: currentMastery.type === 'atk' ? currentMastery.value : 0,
        def: currentMastery.type === 'def' ? currentMastery.value : 0,
        hp: currentMastery.type === 'maxHp' ? currentMastery.value : 0,
    };



    let pElementMult = getElementMultiplier(player.element, monster.element, playerClass);
    let mElementMult = getElementMultiplier(monster.element, player.element);

    const affinity = (playerClass as any)?.elementAffinity as
        | { advantageMultiplier?: number; disadvantageDamageTakenMultiplier?: number }
        | undefined;

    if (affinity?.disadvantageDamageTakenMultiplier && mElementMult > 1) {
        mElementMult = mElementMult * affinity.disadvantageDamageTakenMultiplier;
    }

    return {
        mastery: currentMastery, // ส่ง Tier ปัจจุบันไปโชว์ Log
        masteryBonusStats,       // ส่งค่าเฉพาะตัวไปโชว์ Log
        masteryBonusForCalc: globalMasteryCalc, // 🔥 ส่ง "ก้อนรวม" ไปใช้คำนวณจริง!
        pElementMult,
        mElementMult,
        playerClass,
        classBonus
    };
};