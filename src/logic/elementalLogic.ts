import type { ElementType } from '../types/game';
import type { ClassDefinition } from '../data/classes';

// ✅ ประกาศค่ากลางไว้ที่นี่ เพื่อให้แก้จุดเดียวจบ
const ADVANTAGE_BASE = 1.25;      // จากเดิม 1.5 (ปรับลดลงมาหน่อยแต่ยังรู้สึกว่าชนะธาตุอยู่)
const DISADVANTAGE_BASE = 0.75;   // จากเดิม 0.5 (ไม่ให้ตีเบาจนน่าเกลียด)
const HIGH_REWARD = 1.5;         // จากเดิม 2.0 (สำหรับ Light/Dark)
const SLIGHT_ADVANTAGE = 1.1;    // สำหรับ Light/Dark ชนะธาตุปกติ

export const ELEMENT_CHART: Record<ElementType, Partial<Record<ElementType, number>>> = {
    Fire: { Wind: ADVANTAGE_BASE, Water: DISADVANTAGE_BASE },
    Water: { Fire: ADVANTAGE_BASE, Earth: DISADVANTAGE_BASE },
    Earth: { Water: ADVANTAGE_BASE, Wind: DISADVANTAGE_BASE },
    Wind: { Earth: ADVANTAGE_BASE, Fire: ADVANTAGE_BASE },

    // ปรับ Light/Dark จาก 2.0 -> 1.5 เพื่อไม่ให้ One-shot กันเกินไป
    Light: {
        Dark: HIGH_REWARD,
        Fire: SLIGHT_ADVANTAGE,
        Water: SLIGHT_ADVANTAGE,
        Earth: SLIGHT_ADVANTAGE,
        Wind: SLIGHT_ADVANTAGE
    },
    Dark: {
        Light: HIGH_REWARD,
        Fire: SLIGHT_ADVANTAGE,
        Water: SLIGHT_ADVANTAGE,
        Earth: SLIGHT_ADVANTAGE,
        Wind: SLIGHT_ADVANTAGE
    },
    Neutral: {},
};

export const getElementMultiplier = (
    attacker: ElementType,
    defender: ElementType,
    playerClass?: ClassDefinition
): number => {
    const baseMultiplier = ELEMENT_CHART[attacker]?.[defender] || 1.0;

    // Mage advantage: if player is Mage and has elemental advantage, use 1.8x instead of base
    if (
        playerClass?.id === 'mage' &&
        baseMultiplier > 1.0 &&
        typeof playerClass.elementAffinity?.advantageMultiplier === 'number'
    ) {
        return playerClass.elementAffinity.advantageMultiplier;
    }

    return baseMultiplier;
};