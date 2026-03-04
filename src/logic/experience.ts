// src/logic/experience.ts
import type { Entity } from '../types/game';

interface LevelUpResult {
    updatedPlayer: Entity;
    isLevelUp: boolean;
    levelGained: number;
    statsGained: { hp: number; atk: number; def: number };
}

export const calculateLevelUp = (player: Entity): LevelUpResult => {
    // ใช้ Deep Copy เพื่อไม่ให้กระทบ State เดิมโดยตรงก่อนคำนวณเสร็จ
    let updatedPlayer = { ...player, skills: [...player.skills] };
    let isLevelUp = false;
    let levelGained = 0;

    let totalStatsGained = { hp: 0, atk: 0, def: 0 };

    // ตรวจสอบว่า EXP ปัจจุบัน เกินเพดานที่กำหนดไว้หรือไม่
    while (updatedPlayer.exp >= updatedPlayer.maxExp) {

        if (updatedPlayer.level >= 50) {
            updatedPlayer.exp = 0;
            break;
        }

        isLevelUp = true;
        levelGained++;

        // 1. หัก EXP ตามเพดานปัจจุบัน
        updatedPlayer.exp -= updatedPlayer.maxExp;

        // 2. อัปเลเวล
        updatedPlayer.level += 1;

        // 3. พลังที่เพิ่มขึ้น (Base Stats เท่านั้น)
        const hpGain = 30 + (updatedPlayer.level * 5);  // เพิ่มทีละเยอะหน่อย ให้หลอดเลือดดูยาวขึ้น
        const atkGain = 5 + Math.floor(updatedPlayer.level / 2); // ให้ ATK นำหน้า DEF มอนสเตอร์เสมอ
        const defGain = 2 + Math.floor(updatedPlayer.level / 4); // ป้องกันได้พอสมควรแต่ไม่ถึงกับอมตะ

        totalStatsGained.hp += hpGain;
        totalStatsGained.atk += atkGain;
        totalStatsGained.def += defGain;

        updatedPlayer.maxHp += hpGain;
        updatedPlayer.hp = updatedPlayer.maxHp; // Heal เต็มเมื่อเลเวลอัป
        updatedPlayer.atk += atkGain;
        updatedPlayer.def += defGain;


        updatedPlayer.maxExp = Math.floor(100 * Math.pow(1.15, updatedPlayer.level - 1));
    }

    return { updatedPlayer, isLevelUp, levelGained, statsGained: totalStatsGained };
};