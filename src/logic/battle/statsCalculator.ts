import type { Entity, MonsterData } from '../../types/game';
import { getMasteryBonus, calculatePlayerClass } from '../../utils/gameHelpers';
import { getElementMultiplier } from '../elementalLogic';

export const calculateInitialStats = (
    player: Entity,
    monster: MonsterData,
    killCount: number,
    equippedSkills: Array<{ id: string }> = []
) => {
    const mastery = getMasteryBonus(monster, killCount);

    const playerClass = calculatePlayerClass(equippedSkills);
    const classBonus = playerClass?.bonus || {};

    // ตรงนี้เก็บไว้เพื่อแสดง Log ในหน้าต่อสู้เฉยๆ 
    // แต่เราจะไม่เอาไปบวกเพิ่มใน simulateBattle อีกรอบ (เพราะ Dashboard บวกให้แล้ว)
    const masteryBonusStats = {
        atk: mastery.type === 'atk' ? mastery.value : 0,
        def: mastery.type === 'def' ? mastery.value : 0,
        hp: mastery.type === 'maxHp' ? mastery.value : 0,
    };

    // สำหรับการคำนวณจริง - แยก flat และ percent
    const masteryBonusForCalc = {
        atk_flat: mastery.type === 'atk' && !mastery.isPercent ? mastery.value : 0,
        atk_percent: mastery.type === 'atk' && mastery.isPercent ? mastery.value : 0,
        def_flat: mastery.type === 'def' && !mastery.isPercent ? mastery.value : 0,
        def_percent: mastery.type === 'def' && mastery.isPercent ? mastery.value : 0,
        hp_flat: mastery.type === 'maxHp' && !mastery.isPercent ? mastery.value : 0,
        hp_percent: mastery.type === 'maxHp' && mastery.isPercent ? mastery.value : 0,
    };

    let pElementMult = getElementMultiplier(player.element, monster.element, playerClass);
    let mElementMult = getElementMultiplier(monster.element, player.element);

    const affinity = (playerClass as any)?.elementAffinity as
        | { advantageMultiplier?: number; disadvantageDamageTakenMultiplier?: number }
        | undefined;

    if (affinity?.disadvantageDamageTakenMultiplier && mElementMult > 1) {
        mElementMult = mElementMult * affinity.disadvantageDamageTakenMultiplier;
    }

    return { mastery, masteryBonusStats, masteryBonusForCalc, pElementMult, mElementMult, playerClass, classBonus };
};