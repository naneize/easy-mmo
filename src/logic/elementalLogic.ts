import type { ElementType } from '../types/game';

export const ELEMENT_CHART: Record<ElementType, Partial<Record<ElementType, number>>> = {
    Fire: { Wind: 1.5, Water: 0.5 },
    Water: { Fire: 1.5, Earth: 0.5 },
    Earth: { Water: 1.5, Wind: 0.5 },
    Wind: { Earth: 1.5, Fire: 0.5 },
    // แสงชนะมืด มืดชนะแสง (High Risk, High Reward)
    Light: { Dark: 2.0, Fire: 1.1, Water: 1.1, Earth: 1.1, Wind: 1.1 },
    Dark: { Light: 2.0, Fire: 1.1, Water: 1.1, Earth: 1.1, Wind: 1.1 },
    Neutral: {},
};

export const getElementMultiplier = (attacker: ElementType, defender: ElementType): number => {
    return ELEMENT_CHART[attacker]?.[defender] || 1.0;
};