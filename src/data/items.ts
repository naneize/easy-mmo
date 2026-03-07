
import type { StatTarget } from '../types/game';

export type ItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
export type ItemType = 'consumable' | 'weapon' | 'armor' | 'accessory' | 'material';
export type WeaponSubtype = 'sword' | 'dagger' | 'axe' | 'staff' | 'bow';

export interface GameItem {
    id: string;
    weaponType?: WeaponSubtype;
    name: string;
    description: string;
    type: ItemType;
    rarity: ItemRarity;
    price: number;

    icon: string;
    minLevel: number;
    // สำหรับไอเทมสวมใส่ (Stats ถาวร)
    stats?: {
        atk?: number;
        def?: number;
        hp?: number;
        maxHp?: number;
    };
    // สำหรับไอเทมกดใช้ (Effect ทันที)
    effect?: {
        type: 'hp' | 'atk_buff' | 'hp_percent';
        value: number;
    };
    // สำหรับไอเทมระดับสูง (Passive พิเศษ)
    passive?: {
        name: string;
        description: string;
        target: StatTarget;
        value: number; // เช่น 0.10 คือเพิ่ม 10%
    };
}

export const ITEMS: Record<string, GameItem> = {
    // --- CONSUMABLES (ไอเทมฟื้นฟู) ---
    'hp_potion_s': {
        id: 'hp_potion_s',
        name: 'Small HP Potion',
        description: 'ฟื้นฟู 20% ของ HP สูงสุด', // ปรับคำอธิบาย
        type: 'consumable',
        rarity: 'Common',
        price: 50,
        icon: '🧪',
        minLevel: 1,
        effect: { type: 'hp_percent', value: 0.20 } // 20%
    },
    'hp_potion_m': {
        id: 'hp_potion_m',
        name: 'Medium HP Potion',
        description: 'ฟื้นฟู 40% ของ HP สูงสุด',
        type: 'consumable',
        rarity: 'Common',
        price: 100,
        icon: '⚗️',
        minLevel: 1,
        effect: { type: 'hp_percent', value: 0.40 } // 40%
    },
    'hp_potion_l': {
        id: 'hp_potion_l',
        name: 'Mega HP Potion',
        description: 'ฟื้นฟู 75% ของ HP สูงสุด',
        type: 'consumable',
        rarity: 'Rare',
        price: 200,
        icon: '🍶',
        minLevel: 1,
        effect: { type: 'hp_percent', value: 0.75 } // 75%
    },

    // --- WEAPONS (อาวุธ) ---
    'w_wooden_sword': {
        id: 'w_wooden_sword',
        name: 'Wooden Sword',
        description: 'ดาบไม้เก่าๆ เพิ่มพลังโจมตีเล็กน้อย',
        type: 'weapon',
        weaponType: 'sword',
        rarity: 'Common', price: 100, icon: '🗡️', minLevel: 1,
        stats: { atk: 7 }
    },
    'w_iron_blade': {
        id: 'w_iron_blade',
        name: 'Iron Blade',
        description: 'ดาบเหล็กมาตรฐานสำหรับนักผจญภัย',
        type: 'weapon',
        weaponType: 'sword',
        rarity: 'Rare', price: 500, icon: '⚔️', minLevel: 5,
        stats: { atk: 15 }
    },
    'w_sanguine_dagger': {
        id: 'w_sanguine_dagger', // ID ตรงกับ Key
        name: 'Sanguine Dagger',
        description: 'เขี้ยวแวมไพร์ที่ยังมีความกระหายเลือด',
        type: 'weapon',
        weaponType: 'dagger',
        rarity: 'Epic', price: 2500, icon: '🗡️', minLevel: 8,
        stats: { atk: 20 },
        passive: {
            name: 'Essence Reaping',
            description: 'ดูดซับ HP 15% จากความเสียหายที่ทำได้',
            target: 'lifesteal',
            value: 15 // หมายถึง 15% (เพราะเราแก้ processor ให้หาร 100 แล้ว)
        }
    },

    // --- ARMOR (ชุดเกราะ) ---
    'a_leather_armor': {
        id: 'a_leather_armor',
        name: 'Leather Armor',
        description: 'เกราะหนังน้ำหนักเบา เพิ่มพลังป้องกัน',
        type: 'armor', rarity: 'Common', price: 200, icon: '👕', minLevel: 1,
        stats: { def: 5, maxHp: 15 }
    },
    'a_steel_plate': { // ✨ ไอเทมใหม่: ทดสอบ def_percent
        id: 'a_steel_plate',
        name: 'Steel Plate',
        description: 'เกราะเหล็กกล้า แข็งแกร่งและหนักอึ้ง',
        type: 'armor', rarity: 'Rare', price: 1200, icon: '🛡️', minLevel: 7,
        stats: { def: 25, maxHp: 100 },
        passive: {
            name: 'Iron Wall',
            description: 'เพิ่มพลังป้องกันสุทธิ 20%',
            target: 'def_percent',
            value: 20
        }
    },

    // --- ACCESSORY (เครื่องประดับ) ---
    'acc_iron_ring': {
        id: 'acc_iron_ring',
        name: 'Iron Ring',
        description: 'แหวนเหล็กธรรมดา เพิ่ม HP เล็กน้อย',
        type: 'accessory', rarity: 'Common', price: 200, icon: '💍', minLevel: 1,
        stats: { maxHp: 20 }
    },
    'acc_vitality_gem': { // ✨ ไอเทมใหม่: ทดสอบ maxHp_percent
        id: 'acc_vitality_gem',
        name: 'Vitality Gem',
        description: 'อัญมณีแห่งชีวิตที่แผ่พลังงานออกมา',
        type: 'accessory', rarity: 'Rare', price: 1500, icon: '🔮', minLevel: 5,
        stats: { maxHp: 50 },
        passive: {
            name: 'Life Force',
            description: 'เพิ่ม Max HP 15%',
            target: 'maxHp_percent',
            value: 15
        }
    },
    'acc_hero_soul': {
        id: 'acc_hero_soul',
        name: 'Hero Soul',
        description: 'วิญญาณวีรชน เพิ่มพลังโจมตี 10%',
        type: 'accessory', rarity: 'Epic', price: 5000, icon: '💎', minLevel: 10,
        stats: { atk: 5 },
        passive: {
            name: 'Hero Will',
            description: 'เพิ่มพลังโจมตีสุทธิ 10%',
            target: 'atk_percent',
            value: 10
        }
    }
};

export const CONSUMABLES: GameItem[] = Object.values(ITEMS).filter(item => item.type === 'consumable');