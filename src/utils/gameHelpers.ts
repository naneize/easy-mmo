import type { MonsterData } from '../types/game';
import { CLASS_DEFINITIONS } from '../data/classes';

export const getMasteryBonus = (monster: MonsterData, killCount: number) => {
    const kills = Number(killCount || 0);
    const config = monster?.masteryBonus;

    if (!config) return { type: 'none' as const, value: 0, tier: 0, isPercent: false };

    let tier = 0;
    let finalValue = 0;
    let isPercent = false;

    // คำนวณ Tier
    if (kills >= 100) tier = 3;
    else if (kills >= 50) tier = 2;
    else if (kills >= 10) tier = 1;

    // --- ระบบ Balance Logic ---
    if (tier === 3) {
        isPercent = true;
        // สูตร: (ค่าพื้นฐาน / 1000) 
        // ตัวอย่าง: ถ้า valuePerTier คือ 100 จะได้ 0.1 (หรือ 10%)
        // ตัวอย่าง: ถ้าสไลม์คือ 5 จะได้ 0.005 (หรือ 0.5%) ซึ่งสมดุลกับมอนสเตอร์เลเวลต่ำ
        finalValue = config.valuePerTier / 1000;
    } else {
        isPercent = false;
        // Tier 1 และ 2 ยังคงเป็น Flat เพื่อช่วยช่วงต้นเกม
        finalValue = config.valuePerTier * tier;
    }

    return {
        type: config.type,
        value: finalValue,
        tier: tier,
        isPercent: isPercent
    };
};

export const calculatePlayerClass = (equippedSkills: Array<{ id: string }> = []) => {
    const equippedIds = new Set(equippedSkills.map(s => s.id));

    for (const cls of CLASS_DEFINITIONS) {
        const ok = cls.requiredSkills.every(id => equippedIds.has(id));
        if (ok) return cls;
    }

    return null;
};

// --- ฟังก์ชันใหม่สำหรับรวมโบนัสทั้งหมดจากมอนสเตอร์ทุกตัวที่เคยฆ่า ---
export const getAllMasteryStats = (allKills: Record<string, number>, allMonsters: MonsterData[]) => {
    const total = {
        atk_flat: 0, atk_percent: 0,
        def_flat: 0, def_percent: 0,
        maxHp_flat: 0, maxHp_percent: 0
    };

    // วนลูปตามรายชื่อมอนสเตอร์ทั้งหมดในเกม
    allMonsters.forEach(monster => {
        const count = allKills[monster.id] || 0;
        if (count === 0) return; // ถ้าไม่เคยฆ่าตัวนี้เลย ให้ข้ามไป

        // เรียกใช้ฟังก์ชัน getMasteryBonus เดิมเพื่อคำนวณโบนัสของมอนสเตอร์ตัวนั้นๆ
        const bonus = getMasteryBonus(monster, count);

        // แยกบวกค่าเข้าตามประเภท (Flat หรือ Percent)
        if (bonus.type === 'atk') {
            if (bonus.isPercent) total.atk_percent += bonus.value;
            else total.atk_flat += bonus.value;
        } else if (bonus.type === 'def') {
            if (bonus.isPercent) total.def_percent += bonus.value;
            else total.def_flat += bonus.value;
        } else if (bonus.type === 'maxHp') {
            if (bonus.isPercent) total.maxHp_percent += bonus.value;
            else total.maxHp_flat += bonus.value;
        }
    });

    return total;
};