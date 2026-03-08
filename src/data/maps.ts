import { MONSTERS } from "./monsters";
import type { GameMap } from "../types/game";

export const WORLD_MAPS: GameMap[] = [
    {
        id: 'starter-field',
        name: 'ทุ่งหญ้าเริ่มต้น',
        nameKey: 'maps.starterField.name',
        description: 'พื้นที่สำหรับนักผจญภัยหน้าใหม่',
        descriptionKey: 'maps.starterField.description',
        minLevel: 1,
        bgEmoji: '🌱',
        monsters: [
            MONSTERS.find(m => m.id === 'm-01'),
            MONSTERS.find(m => m.id === 'm-02'),
            MONSTERS.find(m => m.id === 'm-04'),
            MONSTERS.find(m => m.id === 'm-boss-01')
        ]
            .filter((m): m is any => !!m) // กรองตัวที่หาไม่เจอออกก่อน (Type Guard)
            .sort((a, b) => a.level - b.level) // 👈 สูตรคือ (หลัง - หน้า) = มากไปน้อย



    },



    {
        id: 'whispering-forest',
        name: 'ป่ากระซิบ',
        nameKey: 'maps.whisperingForest.name',
        description: 'ป่าลึกที่เริ่มมีมอนสเตอร์ที่ดุร้ายและรวดเร็ว',
        descriptionKey: 'maps.whisperingForest.description',
        minLevel: 5,
        bgEmoji: '🌲',
        monsters: [
            MONSTERS.find(m => m.id === 'm-03'),
            MONSTERS.find(m => m.id === 'm-05'),
            MONSTERS.find(m => m.id === 'm-06'),
            MONSTERS.find(m => m.id === 'm-07')
        ]
            .filter((m): m is any => !!m) // กรองตัวที่หาไม่เจอออกก่อน (Type Guard)
            .sort((a, b) => a.level - b.level) // 👈 สูตรคือ (หลัง - หน้า) = มากไปน้อย
    },
    {
        id: 'shadow-plains',
        name: 'ทุ่งเงา',
        nameKey: 'maps.shadowPlains.name',
        description: 'ทุ่งกว้างที่เต็มไปด้วยนักธนูและสัตว์อสูร',
        descriptionKey: 'maps.shadowPlains.description',
        minLevel: 12,
        bgEmoji: '🏜️',
        monsters: [
            MONSTERS.find(m => m.id === 'm-09'),
            MONSTERS.find(m => m.id === 'm-10'),
            MONSTERS.find(m => m.id === 'm-11'),
            MONSTERS.find(m => m.id === 'm-12'),
            MONSTERS.find(m => m.id === 'm-13')
        ]
            .filter((m): m is any => !!m) // กรองตัวที่หาไม่เจอออกก่อน (Type Guard)
            .sort((a, b) => a.level - b.level) // 👈 สูตรคือ (หลัง - หน้า) = มากไปน้อย
    },
    {
        id: 'crystal-mountains',
        name: 'ภูเขาผลึก',
        nameKey: 'maps.crystalMountains.name',
        description: 'ภูเขาสูงที่เต็มไปด้วยจอมเวทย์และสัตว์อสูรที่ทรงพลัง',
        descriptionKey: 'maps.crystalMountains.description',
        minLevel: 21,
        bgEmoji: '⛰️',
        monsters: [
            MONSTERS.find(m => m.id === 'm-14'),
            MONSTERS.find(m => m.id === 'm-15'),
            MONSTERS.find(m => m.id === 'm-16'),
            MONSTERS.find(m => m.id === 'm-17'),
            MONSTERS.find(m => m.id === 'm-18')
        ]
            .filter((m): m is any => !!m) // กรองตัวที่หาไม่เจอออกก่อน (Type Guard)
            .sort((a, b) => a.level - b.level) // 👈 สูตรคือ (หลัง - หน้า) = มากไปน้อย
    },
    {
        id: 'inferno-wastelands',
        name: 'ดินแดนนรก',
        nameKey: 'maps.infernoWastelands.name',
        description: 'ดินแดนที่ถูกเผาทำลายด้วยไฟและพลังมืด',
        descriptionKey: 'maps.infernoWastelands.description',
        minLevel: 31,
        bgEmoji: '🔥',
        monsters: [
            MONSTERS.find(m => m.id === 'm-19'),
            MONSTERS.find(m => m.id === 'm-20'),
            MONSTERS.find(m => m.id === 'm-21'),
            MONSTERS.find(m => m.id === 'm-22'),
            MONSTERS.find(m => m.id === 'm-23')
        ].filter((m): m is any => !!m) // กรองตัวที่หาไม่เจอออกก่อน (Type Guard)
            .sort((a, b) => a.level - b.level) // 👈 สูตรคือ (หลัง - หน้า) = มากไปน้อย
    },
    {
        id: 'celestial-realm',
        name: 'แดนสวรรค์',
        nameKey: 'maps.celestialRealm.name',
        description: 'ดินแดนศักดิ์สิทธิ์ที่เต็มไปด้วยเทพและสัตว์อสูรสูงสุด',
        descriptionKey: 'maps.celestialRealm.description',
        minLevel: 41,
        bgEmoji: '✨',
        monsters: [
            MONSTERS.find(m => m.id === 'm-24'),
            MONSTERS.find(m => m.id === 'm-25'),
            MONSTERS.find(m => m.id === 'm-26'),
            MONSTERS.find(m => m.id === 'm-27'),
            MONSTERS.find(m => m.id === 'm-28')
        ]
            .filter((m): m is any => !!m) // กรองตัวที่หาไม่เจอออกก่อน (Type Guard)
            .sort((a, b) => a.level - b.level) // 👈 สูตรคือ (หลัง - หน้า) = มากไปน้อย
    },
    {
        id: 'eternal-peaks',
        name: 'ยอดเขานิรันดร์',
        nameKey: 'maps.eternalPeaks.name',
        description: 'จุดสิ้นสุดของการผจญภัยที่เต็มไปด้วยความท้าทายสูงสุด',
        descriptionKey: 'maps.eternalPeaks.description',
        minLevel: 46,
        bgEmoji: '🏔️',
        monsters: [
            MONSTERS.find(m => m.id === 'm-29'),
            MONSTERS.find(m => m.id === 'm-30'),
            MONSTERS.find(m => m.id === 'm-31')

        ]
            .filter((m): m is any => !!m) // กรองตัวที่หาไม่เจอออกก่อน (Type Guard)
            .sort((a, b) => a.level - b.level) // 👈 สูตรคือ (หลัง - หน้า) = มากไปน้อย
    },
    {
        id: 'wizard-tower',
        name: 'วิหารจอมเวทย์',
        nameKey: 'maps.wizardTower.name',
        description: 'ที่อยู่ของเหล่าจอมเวทย์และบอสที่ทรงพลัง',
        descriptionKey: 'maps.wizardTower.description',
        minLevel: 50,
        bgEmoji: '👑',

        // ✨ จัดเรียงตรงนี้เลย
        monsters: [
            MONSTERS.find(m => m.id === 'boss-02'),
            MONSTERS.find(m => m.id === 'boss-03'),
            MONSTERS.find(m => m.id === 'boss-04'),
            MONSTERS.find(m => m.id === 'boss-05')
        ]
            .filter((m): m is any => !!m) // กรองตัวที่หาไม่เจอออกก่อน (Type Guard)
            .sort((a, b) => a.level - b.level) // 👈 สูตรคือ (หลัง - หน้า) = มากไปน้อย
    }
];

console.log("📍 แผนที่ทุ่งหญ้ามีมอนสเตอร์กี่ตัว:",
    WORLD_MAPS.find(map => map.id === 'starter-field')?.monsters.length
);

console.log("👾 รายชื่อ ID มอนสเตอร์ที่มีในระบบ:",
    MONSTERS.map(m => m.id)
);