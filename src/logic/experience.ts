import type { Entity } from '../types/game';

interface LevelUpResult {
    updatedPlayer: Entity;
    isLevelUp: boolean;
    levelGained: number;
    statsGained: { hp: number; atk: number; def: number };
}

export const calculateLevelUp = (player: Entity): LevelUpResult => {
    let updatedPlayer = { ...player, skills: [...player.skills] };
    let isLevelUp = false;
    let levelGained = 0;
    let totalStatsGained = { hp: 0, atk: 0, def: 0 };

    // --- ⚙️ Tuning Parameters ---
    // อัตราการเติบโต 14% ต่อเลเวล (เพื่อให้ไล่เลี่ยกับมอนสเตอร์ที่โต 20% แต่ผู้เล่นมีไอเทมช่วย)
    const GROWTH_RATE = 0.14;

    while (updatedPlayer.exp >= updatedPlayer.maxExp) {
        if (updatedPlayer.level >= 50) {
            updatedPlayer.exp = 0;
            break;
        }

        isLevelUp = true;
        levelGained++;

        // 1. หัก EXP
        updatedPlayer.exp -= updatedPlayer.maxExp;

        // 2. อัปเลเวล
        updatedPlayer.level += 1;

        // 3. คำนวณ Stats Gained (Hybrid Formula)
        // สูตร: (ค่าปัจจุบัน * %) + ค่าคงที่พื้นฐาน
        // การมีค่าคงที่ (เช่น +30, +5, +2) ช่วยให้ช่วงเลเวล 1-10 ไม่ดูนิ่งจนเกินไป
        const hpGain = Math.floor(updatedPlayer.maxHp * GROWTH_RATE) + 30;
        const atkGain = Math.floor(updatedPlayer.atk * GROWTH_RATE) + 5;
        const defGain = Math.floor(updatedPlayer.def * GROWTH_RATE) + 2;

        // สะสมค่าที่เพิ่มขึ้นเพื่อแจ้ง UI
        totalStatsGained.hp += hpGain;
        totalStatsGained.atk += atkGain;
        totalStatsGained.def += defGain;

        // อัปเดตค่าจริงลงตัวละคร
        updatedPlayer.maxHp += hpGain;
        updatedPlayer.hp = updatedPlayer.maxHp; // Heal เต็ม
        updatedPlayer.atk += atkGain;
        updatedPlayer.def += defGain;

        // 4. คำนวณ MaxExp สำหรับเลเวลถัดไป
        updatedPlayer.maxExp = Math.floor(100 * Math.pow(1.15, updatedPlayer.level - 1));
    }

    return { updatedPlayer, isLevelUp, levelGained, statsGained: totalStatsGained };
};