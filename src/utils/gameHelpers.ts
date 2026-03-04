import type { MonsterData } from '../types/game';
export const getMasteryBonus = (monster: MonsterData, killCount: number) => {
    // บังคับให้ killCount เป็นตัวเลขแน่นอน
    const kills = Number(killCount || 0);
    const config = monster?.masteryBonus;

    if (!config) return { type: 'none' as const, value: 0, tier: 0 };

    // คำนวณ Tier
    let tier = 0;
    if (kills >= 100) tier = 3;
    else if (kills >= 50) tier = 2;
    else if (kills >= 10) tier = 1;

    return {
        type: config.type,
        // ใช้ชื่อ valuePerTier ให้ตรงกับ Interface
        value: (config.valuePerTier || 0) * tier,
        tier: tier
    };
};