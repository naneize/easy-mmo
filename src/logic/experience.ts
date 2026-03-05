import type { Entity } from '../types/game';

interface LevelUpResult {
    updatedPlayer: Entity;
    isLevelUp: boolean;
    levelGained: number;
    statsGained: { hp: number; atk: number; def: number };
}

export const calculateLevelUp = (player: Entity): LevelUpResult => {
    // ใช้คำสั่งกระจาย (Spread) เพื่อไม่ให้กระทบกับ Object เดิม
    let updatedPlayer = { ...player, skills: [...player.skills] };
    let isLevelUp = false;
    let levelGained = 0;
    let totalStatsGained = { hp: 0, atk: 0, def: 0 };

    // --- ⚙️ The Balanced Set (Target: Lv.50 @ HP ~6,000 | ATK ~600 | DEF ~350) ---
    const HP_GAIN_BASE = 110;  // เลเวล 2 จะมี HP ~610 (เพิ่มขึ้น ~20% ในช่วงแรก และจะค่อยๆ ลดสัดส่วนลง)
    const ATK_GAIN_BASE = 12;  // เลเวล 2 จะมี ATK ~62 (เพิ่มขึ้น ~20% จาก 50)
    const DEF_GAIN_BASE = 6;   // เลเวล 2 จะมี DEF ~36 (เพิ่มขึ้น ~20% จาก 30)

    // ทำงานเมื่อ EXP ปัจจุบันมากกว่าหรือเท่ากับที่ต้องการ และเลเวลยังไม่ตัน
    while (updatedPlayer.exp >= updatedPlayer.maxExp && updatedPlayer.level < 50) {
        isLevelUp = true;
        levelGained++;

        // 1. หัก EXP
        updatedPlayer.exp -= updatedPlayer.maxExp;

        // 2. อัปเลเวล
        updatedPlayer.level += 1;

        // 3. สุ่มบวกค่าพลัง (Flat + Random นิดหน่อยให้ดูมีชีวิตชีวา)
        const hpGain = HP_GAIN_BASE + Math.floor(Math.random() * 21); // +150 ถึง 170
        const atkGain = ATK_GAIN_BASE + Math.floor(Math.random() * 6); // +25 ถึง 30
        const defGain = DEF_GAIN_BASE + Math.floor(Math.random() * 4); // +15 ถึง 18

        // สะสมค่าเพื่อส่งไปโชว์ใน UI
        totalStatsGained.hp += hpGain;
        totalStatsGained.atk += atkGain;
        totalStatsGained.def += defGain;

        // อัปเดต Stats ลงในตัวละคร
        updatedPlayer.maxHp += hpGain;
        updatedPlayer.hp = updatedPlayer.maxHp; // เลเวลอัปแล้ว Heal เต็ม
        updatedPlayer.atk += atkGain;
        updatedPlayer.def += defGain;

        // 4. คำนวณ MaxExp สำหรับเลเวลถัดไป (ใช้สูตร Exponential 1.2 เพื่อความหนืด)
        // เลเวล 1 => 100
        // เลเวล 10 => ~515
        // เลเวล 30 => ~19,700
        // เลเวล 49 => ~783,000 (เริ่มท้าทายในช่วงท้าย)
        updatedPlayer.maxExp = Math.floor(100 * Math.pow(1.2, updatedPlayer.level - 1));
    }

    // ถ้าเลเวลตันที่ 50 แล้ว ให้เซ็ต EXP เป็น 0 เพื่อความสวยงาม
    if (updatedPlayer.level >= 50) {
        updatedPlayer.exp = 0;
    }

    return {
        updatedPlayer,
        isLevelUp,
        levelGained,
        statsGained: totalStatsGained
    };
};