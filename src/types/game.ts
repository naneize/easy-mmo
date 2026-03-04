export type ElementType = 'Neutral' | 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Light' | 'Dark';
export type SkillType = 'on-hit' | 'on-defend' | 'constant';
export type SkillTier = 'common' | 'rare' | 'epic' | 'legendary';


// --- สเตตัสเป้าหมาย ---
export type StatTarget =
    | 'atk_percent' | 'atk_flat' | 'def_flat' | 'def_percent'
    | 'hp_percent' | 'maxHp_flat' | 'maxHp_percent' | 'regen_flat'
    | 'dmg_reduction' | 'lifesteal' | 'lifesteal_percent'
    | 'chance_boost' | 'crit_chance' | 'crit_multi' | 'armor_pen';

// --- ระบบไอเทม ---
export type ItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
export type ItemType = 'consumable' | 'weapon' | 'armor' | 'accessory' | 'material';

export interface GameItem {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    rarity: ItemRarity;
    price: number;
    icon: string;
    minLevel: number;
    stats?: {
        atk?: number;
        def?: number;
        hp?: number;
        maxHp?: number;
    };
    effect?: {
        type: 'hp' | 'atk_buff';
        value: number;
    };
    passive?: {
        name: string;
        description: string;
        target: StatTarget;
        value: number;
    };
}

// --- ระบบสกิล ---
export interface Skill {
    id: string;
    name: string;
    description: string;
    type: SkillType;
    tier: SkillTier;
    Icon: any;
    targetStat: StatTarget;
    element?: ElementType;
    value: number;
    bonusValue?: number;
    chance?: number;
    level: number;
    maxLevel?: number;
    unlocked: boolean;
    action?: string;
    actions?: string[];
}


export interface TriggerLog {
    type: 'skill';
    text: string;
    extraValue?: number;
    actions?: any;
}
// --- ตัวละครพื้นฐาน ---
interface BaseEntity {
    name: string;
    hp: number;
    maxHp: number;
    atk: number;
    def: number;
    level: number;
    element: ElementType;
}

// --- ผู้เล่น (Entity) ---
export interface Entity extends BaseEntity {
    gold: number;
    exp: number;
    maxExp: number;
    skills: Skill[];
    lastElementChange: number;

    // ✨ เพิ่มส่วนนี้เข้าไปเพื่อแก้ Error Property 'equipment' does not exist
    equipment: {
        weapon: GameItem | null;
        armor: GameItem | null;
        accessory: GameItem | null;
    };
}

// --- มอนสเตอร์ ---
export interface MonsterData extends BaseEntity {
    id: string;
    description?: string;
    role: import('../data/monsters').MonsterRoleType
    gold: number;
    exp: number;
    masteryBonus?: {
        type: 'maxHp' | 'atk' | 'def';
        valuePerTier: number;
    };
    droppedSkills?: string[];
}

// --- ระบบการต่อสู้และบันทึก ---
export interface BattleLogEntry {
    type: string;
    text: string;
    icon?: string;
}

// ✨ เพิ่ม Union Type เพื่อใช้ใน Engine แทน any[]
export type BattleEffect = Skill | GameItem;

export interface BattleResult {
    playerHp: number;
    monsterHp: number;
    logs: BattleLogEntry[];
    won: boolean;
    goldEarned: number;
    expEarned: number;
    monsterId: string;
    monsterName: string;
    droppedSkillIds?: string[];
}

// --- แผนที่ ---
export interface GameMap {
    id: string;
    name: string;
    description: string;
    minLevel: number;
    bgEmoji: string;
    monsters: MonsterData[];
}