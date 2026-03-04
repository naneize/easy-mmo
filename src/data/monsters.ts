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

export const ROLE_MULTIPLIERS: Record<MonsterRoleType, { hp: number; atk: number; def: number; exp: number }> = {
    [MonsterRole.NORMAL]: { hp: 1.0, atk: 1.0, def: 1.0, exp: 1.0 },
    [MonsterRole.TANK]: { hp: 1.8, atk: 0.7, def: 1.5, exp: 1.3 },
    [MonsterRole.GLASS_CANNON]: { hp: 0.7, atk: 1.6, def: 0.6, exp: 1.2 },
    [MonsterRole.BOSS]: { hp: 3.0, atk: 1.4, def: 1.8, exp: 4.0 }
};

// Base stat formulas (Linear Growth)
export const calculateBaseStats = (level: number) => ({
    hp: 100 + (level * 50),
    atk: 10 + (level * 5),
    def: 5 + (level * 3),
    exp: 20 + (level * 15)
});

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
        exp: Math.floor(baseStats.exp * multipliers.exp)
    };
};

export const MONSTERS: MonsterData[] = [
    // --- โซนเริ่มต้น (Level 1-3) ---
    // เป้าหมาย: เลเวลอัปทุกๆ 3-5 การต่อสู้
    {
        id: 'm-01',
        name: 'สไลม์สดใส',
        description: 'ก้อนเยลลี่สีฟ้าที่ดูเป็นมิตร แต่ถ้าเผลอก็เจ็บได้',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated by initializeMonster()
        level: 1,
        role: MonsterRole.NORMAL,
        gold: 15, exp: 0, // exp will be calculated
        element: 'Water',
        masteryBonus: { type: 'maxHp', valuePerTier: 5 },
        droppedSkills: ['vitality-boost', 'calm-focus',]
    },
    {
        id: 'm-02',
        name: 'กระต่ายขี้โมโห',
        description: 'พุ่งชนด้วยความเร็วสูงจนโล่สะเทือน',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        level: 3,
        role: MonsterRole.NORMAL,
        gold: 40, exp: 0, // exp will be calculated
        element: 'Wind',
        masteryBonus: { type: 'atk', valuePerTier: 1 },
        droppedSkills: ['tailwind-strike', 'blade-dance']
    },
    {
        id: 'm-04',
        name: 'หนอนลาวา',
        description: 'ความร้อนระอุที่ทะลุการป้องกัน',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        level: 4,
        role: MonsterRole.NORMAL,
        gold: 50, exp: 0, // exp will be calculated
        element: 'Fire',
        masteryBonus: { type: 'def', valuePerTier: 1 },
        droppedSkills: ['blazing-soul', 'fire-ember']
    },

    // --- โซนกลาง (Level 5-8) ---
    // เป้าหมาย: ต้องใช้ไอเทมช่วย และเริ่มเห็นผลของสูตร 1.25
    {
        id: 'm-03',
        name: 'ผึ้งนักรบ',
        description: 'เหล็กไนรัวเร็วที่ต้องใช้ Aegis ป้องกันให้ทัน',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        level: 5,
        role: MonsterRole.GLASS_CANNON,
        gold: 80, exp: 0, // exp will be calculated
        element: 'Wind',
        masteryBonus: { type: 'atk', valuePerTier: 3 },
        droppedSkills: ['aegis-guard', 'wind-dash']
    },
    {
        id: 'm-06',
        name: 'จอมเวทวารี',
        description: 'ควบคุมกระแสน้ำเพื่อลดพลังป้องกันและฟื้นฟูตัวเอง',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        level: 6,
        role: MonsterRole.NORMAL,
        gold: 120, exp: 0, // exp will be calculated
        element: 'Water',
        masteryBonus: { type: 'maxHp', valuePerTier: 15 },
        droppedSkills: ['water-purify', 'tidal-grace']
    },
    {
        id: 'm-05',
        name: 'โกเลมหินผา',
        description: 'กำแพงเดินได้ที่การโจมตีธรรมดาแทบไม่ระคายผิว',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        level: 7,
        role: MonsterRole.TANK,
        gold: 180, exp: 0, // exp will be calculated
        element: 'Earth',
        masteryBonus: { type: 'def', valuePerTier: 3 },
        droppedSkills: ['stone-skin', 'earth-wall']
    },
    {
        id: 'm-07',
        name: 'สไลม์เพลิงคลั่ง',
        description: 'โจมตีด้วยความร้อนแรงที่เผาไหม้ทุกอย่าง',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        level: 7,
        role: MonsterRole.GLASS_CANNON,
        gold: 200, exp: 0, // exp will be calculated
        element: 'Fire',
        masteryBonus: { type: 'atk', valuePerTier: 4 },
        droppedSkills: ['fire-ember', 'blazing-soul']
    },
    {
        id: 'm-09',
        name: 'อัศวินโลหะโบราณ',
        description: 'เกราะหนักที่ถูกทิ้งไว้ในซากปรากหักพัง โจมตีช้าแต่รุนแรง',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        level: 8,
        role: MonsterRole.TANK,
        gold: 550, exp: 0, // exp will be calculated
        element: 'Neutral',
        masteryBonus: { type: 'atk', valuePerTier: 5 },
        droppedSkills: ['spark-burst', 'blade-dance']
    },

    // --- โซนธาตุพิเศษ (Light & Dark) ---
    {
        id: 'm-10',
        name: 'วิญญาณหลงทาง',
        description: 'การโจมตีที่รุนแรงและคาดเดาไม่ได้',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        level: 8,
        role: MonsterRole.GLASS_CANNON,
        gold: 300, exp: 0, // exp will be calculated
        element: 'Dark',
        masteryBonus: { type: 'maxHp', valuePerTier: 50 },
        droppedSkills: ['dark-pact', 'dark-corruption']
    },
    {
        id: 'm-11',
        name: 'อัศวินศักดิ์สิทธิ์',
        description: 'สมดุลทั้งรุกและรับด้วยพลังแห่งแสง',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        level: 10,
        role: MonsterRole.NORMAL,
        gold: 600, exp: 0, // exp will be calculated
        element: 'Light',
        masteryBonus: { type: 'def', valuePerTier: 6 },
        droppedSkills: ['holy-aura', 'light-blessing']
    },

    // --- โซนกลาง (Level 12-20) ---
    {
        id: 'm-12',
        name: 'นักธนูแห่งเงา',
        description: 'ยิงศรพิษที่สามารถทะลุเกราะได้',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        level: 12,
        role: MonsterRole.GLASS_CANNON,
        gold: 750, exp: 0, // exp will be calculated
        element: 'Dark',
        masteryBonus: { type: 'atk', valuePerTier: 6 },
        droppedSkills: ['armor-penetration', 'dark-corruption']
    },
    {
        id: 'm-13',
        name: 'เสือธาตุ',
        description: 'สัตว์อสูรที่เร็วและดุร้ายด้วยพลังลม',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated
        level: 14,
        role: MonsterRole.NORMAL,
        gold: 900, exp: 0, // exp will be calculated
        element: 'Wind',
        masteryBonus: { type: 'atk', valuePerTier: 7 },
        droppedSkills: ['tailwind-strike', 'blade-dance']
    },

    {
        id: 'm-14',
        name: 'ทหารมังกร',
        description: 'ทหารรับจ้างที่ถูกครอบงำด้วยพลังไฟ',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated by initializeMonster()
        level: 16,
        role: MonsterRole.TANK,
        gold: 1200, exp: 0, // exp will be calculated
        element: 'Fire',
        masteryBonus: { type: 'def', valuePerTier: 8 },
        droppedSkills: ['fire-ember', 'blazing-soul']
    },
    {
        id: 'm-15',
        name: 'แม่มดน้ำแข็ง',
        description: 'ผู้ควบคุมน้ำแข็งที่แช่แข็งทุกสิ่ง',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated by initializeMonster()
        level: 18,
        role: MonsterRole.NORMAL,
        gold: 1500, exp: 0, // exp will be calculated
        element: 'Water',
        masteryBonus: { type: 'maxHp', valuePerTier: 80 },
        droppedSkills: ['water-purify', 'tidal-grace']
    },
    {
        id: 'm-16',
        name: 'ยักษ์หิน',
        description: 'ยักษ์โบราณที่มีพลังทำลายล้างสูง',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated by initializeMonster()
        level: 20,
        role: MonsterRole.TANK,
        gold: 2000, exp: 0, // exp will be calculated
        element: 'Earth',
        masteryBonus: { type: 'def', valuePerTier: 12 },
        droppedSkills: ['earth-wall', 'stone-skin']
    },

    // --- โซนหลัง (Level 21-30) ---
    {
        id: 'm-17',
        name: 'จอมเวทย์แห่งความมืด',
        description: 'ผู้ใช้เวทมนตร์ด้านมืดที่ทรงพลัง',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated by initializeMonster()
        level: 22,
        role: MonsterRole.GLASS_CANNON,
        gold: 2500, exp: 0, // exp will be calculated
        element: 'Dark',
        masteryBonus: { type: 'atk', valuePerTier: 15 },
        droppedSkills: ['dark-pact', 'dark-corruption']
    },
    {
        id: 'm-18',
        name: 'นางพญาพายุ',
        description: 'ผู้ควบคุมพายุที่รุนแรง',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated by initializeMonster()
        level: 24,
        role: MonsterRole.NORMAL,
        gold: 3000, exp: 0, // exp will be calculated
        element: 'Wind',
        masteryBonus: { type: 'maxHp', valuePerTier: 100 },
        droppedSkills: ['wind-dash', 'tailwind-strike']
    },
    {
        id: 'm-19',
        name: 'ราชาซาลาแมนเดอร์',
        description: 'สัตว์อสูรไฟที่เผาไหม้ทุกอย่าง',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated by initializeMonster()
        level: 26,
        role: MonsterRole.NORMAL,
        gold: 3500, exp: 0, // exp will be calculated
        element: 'Fire',
        masteryBonus: { type: 'atk', valuePerTier: 18 },
        droppedSkills: ['fire-ember', 'blazing-soul']
    },
    {
        id: 'm-20',
        name: 'ไททันน้ำ',
        description: 'ยักษ์น้ำที่มีพลังฟื้นฟูสูง',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated by initializeMonster()
        level: 28,
        role: MonsterRole.TANK,
        gold: 4500, exp: 0, // exp will be calculated
        element: 'Water',
        masteryBonus: { type: 'def', valuePerTier: 15 },
        droppedSkills: ['water-purify', 'tidal-grace']
    },
    {
        id: 'm-21',
        name: 'เทพผู้พิทักษ์',
        description: 'ผู้พิทักษ์โบราณที่มีพลังป้องกันสูง',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated by initializeMonster()
        level: 30,
        role: MonsterRole.TANK,
        gold: 6000, exp: 0, // exp will be calculated
        element: 'Light',
        masteryBonus: { type: 'def', valuePerTier: 20 },
        droppedSkills: ['holy-aura', 'light-blessing']
    },

    // --- โซนเอนด์เกม (Level 31-40) ---
    {
        id: 'm-22',
        name: 'จอมเวทย์แห่งความตาย',
        description: 'ผู้ใช้เวทมนตร์มรณะที่อันตรายที่สุด',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated by initializeMonster()
        level: 32,
        role: MonsterRole.GLASS_CANNON,
        gold: 8000, exp: 0, // exp will be calculated
        element: 'Dark',
        masteryBonus: { type: 'atk', valuePerTier: 25 },
        droppedSkills: ['armor-penetration', 'dark-pact']
    },
    {
        id: 'm-23',
        name: 'เทพแห่งสายลม',
        description: 'เทพแห่งลมที่เร็วกว่าสายตา',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated by initializeMonster()
        level: 34,
        role: MonsterRole.GLASS_CANNON,
        gold: 10000, exp: 0, // exp will be calculated
        element: 'Wind',
        masteryBonus: { type: 'atk', valuePerTier: 28 },
        droppedSkills: ['critical-strike', 'wind-dash']
    },
    {
        id: 'm-24',
        name: 'จอมเวทย์แห่งไฟ',
        description: 'ผู้ควบคุมไฟที่เผาทำลายทุกสิ่ง',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated by initializeMonster()
        level: 36,
        role: MonsterRole.NORMAL,
        gold: 12000, exp: 0, // exp will be calculated
        element: 'Fire',
        masteryBonus: { type: 'maxHp', valuePerTier: 200 },
        droppedSkills: ['fire-ember', 'lifesteal-vamp']
    },
    {
        id: 'm-25',
        name: 'ราชามหาสมุทร',
        description: 'ผู้ควบคุมมหาสมุทรที่กว้างใหญ่',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated by initializeMonster()
        level: 38,
        role: MonsterRole.TANK,
        gold: 15000, exp: 0, // exp will be calculated
        element: 'Water',
        masteryBonus: { type: 'maxHp', valuePerTier: 250 },
        droppedSkills: ['water-purify', 'lifesteal-vamp']
    },
    {
        id: 'm-26',
        name: 'ยักษ์พฤกษาโบราณ',
        description: 'ยักษ์พฤกษาที่มีพลังป้องกันสูงสุด',
        hp: 2800, maxHp: 2800, atk: 400, def: 200,
        level: 40, gold: 20000, exp: 25000,
        role: MonsterRole.TANK,
        element: 'Earth',
        masteryBonus: { type: 'def', valuePerTier: 35 },
        droppedSkills: ['earth-wall', 'armor-penetration']
    },

    // --- โซนหลังเอนด์เกม (Level 41-50) ---
    {
        id: 'm-27',
        name: 'จอมเวทย์แห่งความว่าง',
        description: 'ผู้ใช้พลังความว่างที่ทำลายทุกสิ่ง',
        hp: 1800, maxHp: 1800, atk: 520, def: 180,
        level: 42, gold: 28000, exp: 35000,
        role: MonsterRole.GLASS_CANNON,
        element: 'Dark',
        masteryBonus: { type: 'atk', valuePerTier: 40 },
        droppedSkills: ['elemental-mastery', 'dark-pact']
    },
    {
        id: 'm-28',
        name: 'เทพแห่งพายุ',
        description: 'เทพแห่งพายุที่ควบคุมสภาพอากาศ',
        hp: 2200, maxHp: 2200, atk: 560, def: 200,
        level: 44, gold: 35000, exp: 45000,
        role: MonsterRole.GLASS_CANNON,
        element: 'Wind',
        masteryBonus: { type: 'atk', valuePerTier: 45 },
        droppedSkills: ['elemental-mastery', 'critical-strike']
    },
    {
        id: 'm-29',
        name: 'จอมเวทย์แห่งนรก',
        description: 'ผู้ควบคุมไฟนรกที่เผาทำลายทุกสิ่ง',
        hp: 2600, maxHp: 2600, atk: 600, def: 220,
        level: 46, gold: 45000, exp: 60000,
        role: MonsterRole.GLASS_CANNON,
        element: 'Fire',
        masteryBonus: { type: 'atk', valuePerTier: 50 },
        droppedSkills: ['elemental-mastery', 'fire-ember']
    },
    {
        id: 'm-30',
        name: 'ราชามหาสมุทรลึก',
        description: 'ผู้ควบคุมมหาสมุทรลึกที่อุดมสมบูรณ์',
        hp: 3200, maxHp: 3200, atk: 580, def: 260,
        level: 48, gold: 60000, exp: 80000,
        role: MonsterRole.TANK,
        element: 'Water',
        masteryBonus: { type: 'maxHp', valuePerTier: 400 },
        droppedSkills: ['elemental-mastery', 'water-purify']
    },
    {
        id: 'm-31',
        name: 'ยักษ์พฤกษาศักดิ์สิทธิ์',
        description: 'ยักษ์พฤกษาที่มีพลังป้องกันสูงสุด',
        hp: 4000, maxHp: 4000, atk: 640, def: 300,
        level: 50, gold: 80000, exp: 100000,
        role: MonsterRole.TANK,
        element: 'Light',
        masteryBonus: { type: 'def', valuePerTier: 60 },
        droppedSkills: ['elemental-mastery', 'holy-aura']
    },

    // --- บอสประจำเขต (Boss) ---
    {
        id: 'boss-01',
        name: 'พญามังกรทมิฬ',
        description: 'หายนะแห่งผืนป่า หากป้องกันไม่ดีอาจตายในเทิร์นเดียว',
        hp: 2500, maxHp: 2500, atk: 110, def: 65,
        level: 15, gold: 5000, exp: 8000,
        role: MonsterRole.BOSS,
        element: 'Dark',
        masteryBonus: { type: 'atk', valuePerTier: 10 },
        droppedSkills: ['dark-pact', 'armor-penetration']
    },
    {
        id: 'boss-02',
        name: 'จอมเวทย์แห่งความตาย',
        description: 'บอสแห่งความตายที่มีพลังทำลายล้างสูง',
        hp: 3500, maxHp: 3500, atk: 280, def: 120,
        level: 25, gold: 15000, exp: 20000,
        role: MonsterRole.BOSS,
        element: 'Dark',
        masteryBonus: { type: 'atk', valuePerTier: 20 },
        droppedSkills: ['lifesteal-vamp', 'dark-corruption']
    },
    {
        id: 'boss-03',
        name: 'จอมเวทย์แห่งไฟ',
        description: 'บอสแห่งไฟที่เผาทำลายทุกสิ่ง',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated by initializeMonster()
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
        description: 'บอสแห่งนรกที่อันตรายที่สุด',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated by initializeMonster()
        level: 45,
        role: MonsterRole.BOSS,
        gold: 25000, exp: 0, // exp will be calculated
        element: 'Fire',
        masteryBonus: { type: 'atk', valuePerTier: 50 },
        droppedSkills: ['elemental-mastery', 'fire-ember']
    },
    {
        id: 'boss-05',
        name: 'จอมเวทย์แห่งความว่าง',
        description: 'บอสสุดท้ายที่มีพลังทำลายล้างสูงสุด',
        hp: 0, maxHp: 0, atk: 0, def: 0, // Will be calculated by initializeMonster()
        level: 50,
        role: MonsterRole.BOSS,
        gold: 35000, exp: 0, // exp will be calculated
        element: 'Dark',
        masteryBonus: { type: 'atk', valuePerTier: 80 },
        droppedSkills: ['elemental-mastery', 'dark-pact']
    }
];