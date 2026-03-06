import type { MonsterData } from '../types/game';

// Monster Role Enum with Multipliers
// 1. เปลี่ยน Enum เป็น Object ปกติ
export const MonsterRole = {
    NORMAL: 'NORMAL',
    TANK: 'TANK',
    GLASS_CANNON: 'GLASS_CANNON',
    BOSS: 'BOSS'
} as const;

// สร้าง Type จาก Object เพื่อให้ยังใช้ Type Safety ได้
export type MonsterRoleType = typeof MonsterRole[keyof typeof MonsterRole];

export const ROLE_MULTIPLIERS: Record<MonsterRoleType, {
    hp: number;
    atk: number;
    def: number;
    exp: number;
    critChance: number;   // ✨ เพิ่ม Type
    critDamage: number;   // ✨ เพิ่ม Type
}> = {
    [MonsterRole.NORMAL]: {
        hp: 1.0, atk: 1.0, def: 1.0, exp: 1.0,
        critChance: 0.05, critDamage: 1.3
    },
    [MonsterRole.TANK]: {
        hp: 2.0, atk: 0.8, def: 1.6, exp: 1.4,
        critChance: 0.02, critDamage: 1.2
    },
    [MonsterRole.GLASS_CANNON]: {
        hp: 0.8, atk: 1.7, def: 0.7, exp: 1.3,
        critChance: 0.15, critDamage: 1.8 // 🎯 คริบ่อยและแรงมาก!
    },
    [MonsterRole.BOSS]: {
        hp: 3.0, atk: 1.4, def: 1.6, exp: 4.0,
        critChance: 0.10, critDamage: 1.5 // 👑 น่าเกรงขามสมเป็นบอส
    }
};

export const calculateBaseStats = (level: number) => {
    return {
        // เลเวล 1: 150 | เลเวล 50: ~5,500 (ผู้เล่นเวล 50 มี ~6,000)
        // มอนสเตอร์จะเลือดน้อยกว่าผู้เล่นนิดหน่อย แต่จะได้ตัวคูณ Role มาช่วย
        hp: Math.floor(40 + (level * 110)),

        // เลเวล 1: 15 | เลเวล 50: ~650 (ผู้เล่นเวล 50 มี ~650)
        // พลังโจมตีพื้นฐานจะพอๆ กับผู้เล่น
        atk: Math.floor(5 + (level * 13)),

        // เลเวล 1: 5 | เลเวล 50: ~350 (ผู้เล่นเวล 50 มี ~330)
        // ป้องกันใกล้เคียงผู้เล่น เพื่อให้การสู้กันกินเวลานิดนึง
        def: Math.floor(0 + (level * 7)),

        // EXP: ให้สัมพันธ์กับ MaxExp ผู้เล่น (ที่ใช้สูตร 1.2 ยกกำลัง)
        // เลเวล 1: 40 | เลเวล 10: 220 | เลเวล 50: 1020
        // หมายความว่าช่วงแรกตบ 2-3 ตัวเวลอัป ช่วงหลังต้องตบเยอะขึ้นมาก
        exp: Math.floor(20 + (level * 20))
    };
};

// Initialize monster with calculated stats
export const initializeMonster = (monsterData: MonsterData) => {
    const baseStats = calculateBaseStats(monsterData.level);
    const multipliers = ROLE_MULTIPLIERS[monsterData.role as MonsterRoleType];

    return {
        ...monsterData,
        hp: Math.floor(baseStats.hp * multipliers.hp),
        maxHp: Math.floor(baseStats.hp * multipliers.hp),
        atk: Math.floor(baseStats.atk * multipliers.atk),
        def: Math.floor(baseStats.def * multipliers.def),
        exp: Math.floor(baseStats.exp * multipliers.exp),

        // ✅ ใช้ค่าจาก Multiplier ถ้าไม่มีค่อยใช้ Default
        critChance: monsterData.critChance || multipliers.critChance,
        critDamage: monsterData.critDamage || multipliers.critDamage,
    };
};

export const MONSTERS: MonsterData[] = [
    // --- โซนเริ่มต้น (Level 1-3) ---
    // เป้าหมาย: เลเวลอัปทุกๆ 3-5 การต่อสู้
    {
        id: 'm-01',
        name: 'สไลม์สดใส',
        nameKey: 'monsters.m-01.name',
        description: 'ก้อนเยลลี่สีฟ้าที่ดูเป็นมิตร แต่ถ้าเผลอก็เจ็บได้',
        descriptionKey: 'monsters.m-01.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 1,
        role: MonsterRole.NORMAL,
        gold: 20, exp: 0, // exp will be calculated
        element: 'Water',
        masteryBonus: { type: 'maxHp', valuePerTier: 8 },
        droppedSkills: ['sturdy-body', 'vitality-boost', 'calm-focus']
    },
    {
        id: 'm-02',
        name: 'กระต่ายขี้โมโห',
        nameKey: 'monsters.m-02.name',
        description: 'พุ่งชนด้วยความเร็วสูงจนโล่สะเทือน',
        descriptionKey: 'monsters.m-02.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 3,
        role: MonsterRole.NORMAL,
        gold: 50, exp: 0, // exp will be calculated
        element: 'Wind',
        masteryBonus: { type: 'atk', valuePerTier: 5 },
        droppedSkills: ['brute-force', 'gold-finder', 'tailwind-strike']
    },
    {
        id: 'm-04',
        name: 'หนอนลาวา',
        nameKey: 'monsters.m-04.name',
        description: 'ความร้อนระอุที่ทะลุการป้องกัน',
        descriptionKey: 'monsters.m-04.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 4,
        role: MonsterRole.NORMAL,
        gold: 70, exp: 0, // exp will be calculated
        element: 'Fire',
        masteryBonus: { type: 'def', valuePerTier: 5 },
        droppedSkills: ['battle-focus', 'blazing-soul', 'fire-ember']
    },

    // --- โซนกลาง (Level 5-8) ---
    // เป้าหมาย: ต้องใช้ไอเทมช่วย และเริ่มเห็นผลของสูตร 1.25
    {
        id: 'm-03',
        name: 'ผึ้งนักรบ',
        nameKey: 'monsters.m-03.name',
        description: 'เหล็กไนรัวเร็วที่ต้องใช้ Aegis ป้องกันให้ทัน',
        descriptionKey: 'monsters.m-03.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 6,
        role: MonsterRole.GLASS_CANNON,
        gold: 70, exp: 0, // exp will be calculated
        element: 'Wind',
        masteryBonus: { type: 'atk', valuePerTier: 5 },
        droppedSkills: ['aegis-guard', 'wind-dash']
    },
    {
        id: 'm-06',
        name: 'จอมเวทวารี',
        nameKey: 'monsters.m-06.name',
        description: 'ควบคุมกระแสน้ำเพื่อลดพลังป้องกันและฟื้นฟูตัวเอง',
        descriptionKey: 'monsters.m-06.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 6,
        role: MonsterRole.NORMAL,
        gold: 100, exp: 0, // exp will be calculated
        element: 'Water',
        masteryBonus: { type: 'maxHp', valuePerTier: 15 },
        droppedSkills: ['water-purify', 'tidal-grace']
    },
    {
        id: 'm-05',
        name: 'โกเลมหินผา',
        nameKey: 'monsters.m-05.name',
        description: 'กำแพงเดินได้ที่การโจมตีธรรมดาแทบไม่ระคายผิว',
        descriptionKey: 'monsters.m-05.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 7,
        role: MonsterRole.TANK,
        gold: 150, exp: 0, // exp will be calculated
        element: 'Earth',
        masteryBonus: { type: 'def', valuePerTier: 8 },
        droppedSkills: ['stone-skin', 'earth-wall']
    },
    {
        id: 'm-07',
        name: 'สไลม์เพลิงคลั่ง',
        nameKey: 'monsters.m-07.name',
        description: 'โจมตีด้วยความร้อนแรงที่เผาไหม้ทุกอย่าง',
        descriptionKey: 'monsters.m-07.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 7,
        role: MonsterRole.GLASS_CANNON,
        gold: 180, exp: 0, // exp will be calculated
        element: 'Fire',
        masteryBonus: { type: 'atk', valuePerTier: 8 },
        droppedSkills: ['fire-ember', 'blazing-soul']
    },
    {
        id: 'm-09',
        name: 'อัศวินโลหะโบราณ',
        nameKey: 'monsters.m-09.name',
        description: 'เกราะหนักที่ถูกทิ้งไว้ในซากปรากหักพัง โจมตีช้าแต่รุนแรง',
        descriptionKey: 'monsters.m-09.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 8,
        role: MonsterRole.TANK,
        gold: 450, exp: 0, // exp will be calculated
        element: 'Neutral',
        masteryBonus: { type: 'atk', valuePerTier: 5 },
        droppedSkills: ['spark-burst', 'blade-dance']
    },

    // --- โซนธาตุพิเศษ (Light & Dark) ---
    {
        id: 'm-10',
        name: 'วิญญาณหลงทาง',
        nameKey: 'monsters.m-10.name',
        description: 'การโจมตีที่รุนแรงและคาดเดาไม่ได้',
        descriptionKey: 'monsters.m-10.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 8,
        role: MonsterRole.GLASS_CANNON,
        gold: 250, exp: 0, // exp will be calculated
        element: 'Dark',
        masteryBonus: { type: 'maxHp', valuePerTier: 60 },
        droppedSkills: ['dark-pact', 'dark-corruption']
    },
    {
        id: 'm-11',
        name: 'อัศวินศักดิ์สิทธิ์',
        nameKey: 'monsters.m-11.name',
        description: 'สมดุลทั้งรุกและรับด้วยพลังแห่งแสง',
        descriptionKey: 'monsters.m-11.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 10,
        role: MonsterRole.NORMAL,
        gold: 500, exp: 0, // exp will be calculated
        element: 'Light',
        masteryBonus: { type: 'def', valuePerTier: 10 },
        droppedSkills: ['holy-aura', 'light-blessing']
    },

    // --- โซนกลาง (Level 12-20) ---
    {
        id: 'm-12',
        name: 'นักธนูแห่งเงา',
        nameKey: 'monsters.m-12.name',
        description: 'ยิงศรพิษที่สามารถทะลุเกราะได้',
        descriptionKey: 'monsters.m-12.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 12,
        role: MonsterRole.GLASS_CANNON,
        gold: 600, exp: 0, // exp will be calculated
        element: 'Dark',
        masteryBonus: { type: 'atk', valuePerTier: 10 },
        droppedSkills: ['armor-penetration', 'dark-corruption']
    },
    {
        id: 'm-13',
        name: 'เสือธาตุ',
        nameKey: 'monsters.m-13.name',
        description: 'สัตว์อสูรที่เร็วและดุร้ายด้วยพลังลม',
        descriptionKey: 'monsters.m-13.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 14,
        role: MonsterRole.NORMAL,
        gold: 800, exp: 0, // exp will be calculated
        element: 'Wind',
        masteryBonus: { type: 'atk', valuePerTier: 12 },
        droppedSkills: ['tailwind-strike', 'blade-dance']
    },

    {
        id: 'm-14',
        name: 'ทหารมังกร',
        nameKey: 'monsters.m-14.name',
        description: 'ทหารรับจ้างที่ถูกครอบงำด้วยพลังไฟ',
        descriptionKey: 'monsters.m-14.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 16,
        role: MonsterRole.TANK,
        gold: 1000, exp: 0, // exp will be calculated
        element: 'Fire',
        masteryBonus: { type: 'def', valuePerTier: 12 },
        droppedSkills: ['fire-ember', 'blazing-soul']
    },
    {
        id: 'm-15',
        name: 'แม่มดน้ำแข็ง',
        nameKey: 'monsters.m-15.name',
        description: 'ผู้ควบคุมน้ำแข็งที่แช่แข็งทุกสิ่ง',
        descriptionKey: 'monsters.m-15.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 18,
        role: MonsterRole.NORMAL,
        gold: 1200, exp: 0, // exp will be calculated
        element: 'Water',
        masteryBonus: { type: 'maxHp', valuePerTier: 90 },
        droppedSkills: ['water-purify', 'tidal-grace']
    },
    {
        id: 'm-16',
        name: 'ยักษ์หิน',
        nameKey: 'monsters.m-16.name',
        description: 'ยักษ์โบราณที่มีพลังทำลายล้างสูง',
        descriptionKey: 'monsters.m-16.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 20,
        role: MonsterRole.TANK,
        gold: 1500, exp: 0, // exp will be calculated
        element: 'Earth',
        masteryBonus: { type: 'def', valuePerTier: 15 },
        droppedSkills: ['earth-wall', 'stone-skin']
    },

    // --- โซนหลัง (Level 21-30) ---
    {
        id: 'm-17',
        name: 'จอมเวทย์แห่งความมืด',
        nameKey: 'monsters.m-17.name',
        description: 'ผู้ใช้เวทมนตร์ด้านมืดที่ทรงพลัง',
        descriptionKey: 'monsters.m-17.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 22,
        role: MonsterRole.GLASS_CANNON,
        gold: 1800, exp: 0, // exp will be calculated
        element: 'Dark',
        masteryBonus: { type: 'atk', valuePerTier: 20 },
        droppedSkills: ['dark-pact', 'dark-corruption']
    },
    {
        id: 'm-18',
        name: 'นางพญาพายุ',
        nameKey: 'monsters.m-18.name',
        description: 'ผู้ควบคุมพายุที่รุนแรง',
        descriptionKey: 'monsters.m-18.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 24,
        role: MonsterRole.NORMAL,
        gold: 2200, exp: 0, // exp will be calculated
        element: 'Wind',
        masteryBonus: { type: 'maxHp', valuePerTier: 120 },
        droppedSkills: ['wind-dash', 'tailwind-strike']
    },
    {
        id: 'm-19',
        name: 'ราชาซาลาแมนเดอร์',
        nameKey: 'monsters.m-19.name',
        description: 'สัตว์อสูรไฟที่เผาไหม้ทุกอย่าง',
        descriptionKey: 'monsters.m-19.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 26,
        role: MonsterRole.NORMAL,
        gold: 2800, exp: 0, // exp will be calculated
        element: 'Fire',
        masteryBonus: { type: 'atk', valuePerTier: 22 },
        droppedSkills: ['fire-ember', 'blazing-soul']
    },
    {
        id: 'm-20',
        name: 'ไททันน้ำ',
        nameKey: 'monsters.m-20.name',
        description: 'ยักษ์น้ำที่มีพลังฟื้นฟูสูง',
        descriptionKey: 'monsters.m-20.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 28,
        role: MonsterRole.TANK,
        gold: 3500, exp: 0, // exp will be calculated
        element: 'Water',
        masteryBonus: { type: 'def', valuePerTier: 15 },
        droppedSkills: ['water-purify', 'tidal-grace']
    },
    {
        id: 'm-21',
        name: 'เทพผู้พิทักษ์',
        nameKey: 'monsters.m-21.name',
        description: 'ผู้พิทักษ์โบราณที่มีพลังป้องกันสูง',
        descriptionKey: 'monsters.m-21.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 30,
        role: MonsterRole.TANK,
        gold: 4500, exp: 0, // exp will be calculated
        element: 'Light',
        masteryBonus: { type: 'def', valuePerTier: 22 },
        droppedSkills: ['holy-aura', 'light-blessing']
    },

    // --- โซนเอนด์เกม (Level 31-40) ---
    {
        id: 'm-22',
        name: 'จอมเวทย์แห่งความตาย',
        nameKey: 'monsters.m-22.name',
        description: 'ผู้ใช้เวทมนตร์มรณะที่อันตรายที่สุด',
        descriptionKey: 'monsters.m-22.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 32,
        role: MonsterRole.GLASS_CANNON,
        gold: 5000, exp: 0, // exp will be calculated
        element: 'Dark',
        masteryBonus: { type: 'atk', valuePerTier: 30 },
        droppedSkills: ['armor-penetration', 'dark-pact']
    },
    {
        id: 'm-23',
        name: 'เทพแห่งสายลม',
        nameKey: 'monsters.m-23.name',
        description: 'เทพแห่งลมที่เร็วกว่าสายตา',
        descriptionKey: 'monsters.m-23.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 34,
        role: MonsterRole.GLASS_CANNON,
        gold: 6000, exp: 0, // exp will be calculated
        element: 'Wind',
        masteryBonus: { type: 'atk', valuePerTier: 32 },
        droppedSkills: ['critical-strike', 'wind-dash']
    },
    {
        id: 'm-24',
        name: 'จอมเวทย์แห่งไฟ',
        nameKey: 'monsters.m-24.name',
        description: 'ผู้ควบคุมไฟที่เผาทำลายทุกสิ่ง',
        descriptionKey: 'monsters.m-24.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 36,
        role: MonsterRole.NORMAL,
        gold: 7000, exp: 0, // exp will be calculated
        element: 'Fire',
        masteryBonus: { type: 'maxHp', valuePerTier: 220 },
        droppedSkills: ['fire-ember', 'lifesteal-vamp']
    },
    {
        id: 'm-25',
        name: 'ราชามหาสมุทร',
        nameKey: 'monsters.m-25.name',
        description: 'ผู้ควบคุมมหาสมุทรที่กว้างใหญ่',
        descriptionKey: 'monsters.m-25.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 38,
        role: MonsterRole.TANK,
        gold: 9000, exp: 0, // exp will be calculated
        element: 'Water',
        masteryBonus: { type: 'maxHp', valuePerTier: 280 },
        droppedSkills: ['water-purify', 'lifesteal-vamp']
    },
    {
        id: 'm-26',
        name: 'ยักษ์พฤกษาโบราณ',
        nameKey: 'monsters.m-26.name',
        description: 'ยักษ์พฤกษาที่มีพลังป้องกันสูงสุด',
        descriptionKey: 'monsters.m-26.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 40,
        role: MonsterRole.TANK,
        gold: 12000, exp: 0, // exp will be calculated
        element: 'Earth',
        masteryBonus: { type: 'def', valuePerTier: 28 },
        droppedSkills: ['earth-wall', 'armor-penetration']
    },

    // --- โซนหลังเอนด์เกม (Level 41-50) ---
    {
        id: 'm-27',
        name: 'จอมเวทย์แห่งความว่าง',
        nameKey: 'monsters.m-27.name',
        description: 'ผู้ใช้พลังความว่างที่ทำลายทุกสิ่ง',
        descriptionKey: 'monsters.m-27.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 42,
        role: MonsterRole.GLASS_CANNON,
        gold: 15000, exp: 0, // exp will be calculated
        element: 'Dark',
        masteryBonus: { type: 'atk', valuePerTier: 35 },
        droppedSkills: ['elemental-mastery', 'dark-pact']
    },
    {
        id: 'm-28',
        name: 'เทพแห่งพายุ',
        nameKey: 'monsters.m-28.name',
        description: 'เทพแห่งพายุที่ควบคุมสภาพอากาศ',
        descriptionKey: 'monsters.m-28.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 44,
        role: MonsterRole.GLASS_CANNON,
        gold: 18000, exp: 0, // exp will be calculated
        element: 'Wind',
        masteryBonus: { type: 'atk', valuePerTier: 38 },
        droppedSkills: ['elemental-mastery', 'critical-strike']
    },
    {
        id: 'm-29',
        name: 'จอมเวทย์แห่งนรก',
        nameKey: 'monsters.m-29.name',
        description: 'ผู้ควบคุมไฟนรกที่เผาทำลายทุกสิ่ง',
        descriptionKey: 'monsters.m-29.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 46,
        role: MonsterRole.GLASS_CANNON,
        gold: 22000, exp: 0, // exp will be calculated
        element: 'Fire',
        masteryBonus: { type: 'atk', valuePerTier: 42 },
        droppedSkills: ['elemental-mastery', 'fire-ember']
    },
    {
        id: 'm-30',
        name: 'ราชามหาสมุทรลึก',
        nameKey: 'monsters.m-30.name',
        description: 'ผู้ควบคุมมหาสมุทรลึกที่อุดมสมบูรณ์',
        descriptionKey: 'monsters.m-30.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 48,
        role: MonsterRole.TANK,
        gold: 28000, exp: 0, // exp will be calculated
        element: 'Water',
        masteryBonus: { type: 'maxHp', valuePerTier: 350 },
        droppedSkills: ['elemental-mastery', 'water-purify']
    },
    {
        id: 'm-31',
        name: 'ยักษ์พฤกษาศักดิ์สิทธิ์',
        nameKey: 'monsters.m-31.name',
        description: 'ยักษ์พฤกษาที่มีพลังป้องกันสูงสุด',
        descriptionKey: 'monsters.m-31.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 50,
        role: MonsterRole.TANK,
        gold: 35000, exp: 0, // exp will be calculated
        element: 'Light',
        masteryBonus: { type: 'def', valuePerTier: 50 },
        droppedSkills: ['elemental-mastery', 'holy-aura']
    },

    // --- บอสประจำเขต (Boss) ---
    {
        id: 'boss-02',
        name: 'จอมเวทย์แห่งความตาย',
        nameKey: 'monsters.boss-02.name',
        description: 'บอสแห่งความตายที่มีพลังทำลายล้างสูง',
        descriptionKey: 'monsters.boss-02.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 25,
        role: MonsterRole.BOSS,
        gold: 8000, exp: 0, // exp will be calculated
        element: 'Dark',
        masteryBonus: { type: 'atk', valuePerTier: 20 },
        droppedSkills: ['lifesteal-vamp', 'dark-corruption']
    },
    {
        id: 'boss-03',
        name: 'จอมเวทย์แห่งไฟ',
        nameKey: 'monsters.boss-03.name',
        description: 'บอสแห่งไฟที่เผาทำลายทุกสิ่ง',
        descriptionKey: 'monsters.boss-03.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 35,
        role: MonsterRole.BOSS,
        gold: 18000, exp: 0, // exp will be calculated
        element: 'Fire',
        masteryBonus: { type: 'atk', valuePerTier: 30 },
        droppedSkills: ['lifesteal-vamp', 'fire-ember']
    },
    {
        id: 'boss-04',
        name: 'จอมเวทย์แห่งนรก',
        nameKey: 'monsters.boss-04.name',
        description: 'บอสแห่งนรกที่อันตรายที่สุด',
        descriptionKey: 'monsters.boss-04.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 45,
        role: MonsterRole.BOSS,
        gold: 25000, exp: 0, // exp will be calculated
        element: 'Fire',
        masteryBonus: { type: 'atk', valuePerTier: 50 },
        droppedSkills: ['elemental-mastery', 'fire-ember']
    },
    {
        id: 'boss-05',
        name: 'จอมเวทย์แห่งความว่างเปล่า',
        nameKey: 'monsters.boss-05.name',
        description: 'บอสสุดท้ายที่มีพลังทำลายล้างสูงสุด',
        descriptionKey: 'monsters.boss-05.description',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        critChance: 0, critDamage: 0, // Will be calculated by initializeMonster()
        level: 50,
        role: MonsterRole.BOSS,
        gold: 35000, exp: 0, // exp will be calculated
        element: 'Dark',
        masteryBonus: { type: 'atk', valuePerTier: 80 },
        droppedSkills: ['elemental-mastery', 'dark-pact']
    }
];