import type { Entity, MonsterData } from '../../types/game';
import { getMasteryBonus } from '../../utils/gameHelpers';
import { getElementMultiplier } from '../elementalLogic';

export const calculateInitialStats = (player: Entity, monster: MonsterData, killCount: number) => {
    const mastery = getMasteryBonus(monster, killCount);

    // ตรงนี้เก็บไว้เพื่อแสดง Log ในหน้าต่อสู้เฉยๆ 
    // แต่เราจะไม่เอาไปบวกเพิ่มใน simulateBattle อีกรอบ (เพราะ Dashboard บวกให้แล้ว)
    const masteryBonusStats = {
        atk: mastery.type === 'atk' ? mastery.value : 0,
        def: mastery.type === 'def' ? mastery.value : 0,
        hp: mastery.type === 'maxHp' ? mastery.value : 0,
    };

    const pElementMult = getElementMultiplier(player.element, monster.element);
    const mElementMult = getElementMultiplier(monster.element, player.element);

    return { mastery, masteryBonusStats, pElementMult, mElementMult };
};