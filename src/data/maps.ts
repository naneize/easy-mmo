import { MONSTERS } from "./monsters";
import type { GameMap } from "../types/game";

export const WORLD_MAPS: GameMap[] = [
    {
        id: 'starter-field',
        name: 'ทุ่งหญ้าเริ่มต้น',
        description: 'พื้นที่สำหรับนักผจญภัยหน้าใหม่',
        minLevel: 1,
        bgEmoji: '🌱',
        monsters: [
            MONSTERS.find(m => m.id === 'm-01'),
            MONSTERS.find(m => m.id === 'm-02'),
            MONSTERS.find(m => m.id === 'm-03'),
            MONSTERS.find(m => m.id === 'm-04')
        ].filter(Boolean),
    },
    {
        id: 'whispering-forest',
        name: 'ป่ากระซิบ',
        description: 'ป่าลึกที่เริ่มมีมอนสเตอร์ที่ดุร้ายและรวดเร็ว',
        minLevel: 5,
        bgEmoji: '🌲',
        monsters: [
            MONSTERS.find(m => m.id === 'm-05'),
            MONSTERS.find(m => m.id === 'm-06'),
            MONSTERS.find(m => m.id === 'm-07')
        ].filter(Boolean),
    },
    {
        id: 'shadow-plains',
        name: 'ทุ่งเงา',
        description: 'ทุ่งกว้างที่เต็มไปด้วยนักธนูและสัตว์อสูร',
        minLevel: 12,
        bgEmoji: '🏜️',
        monsters: [
            MONSTERS.find(m => m.id === 'm-09'),
            MONSTERS.find(m => m.id === 'm-10'),
            MONSTERS.find(m => m.id === 'm-11'),
            MONSTERS.find(m => m.id === 'm-12'),
            MONSTERS.find(m => m.id === 'm-13')
        ].filter(Boolean),
    },
    {
        id: 'crystal-mountains',
        name: 'ภูเขาผลึก',
        description: 'ภูเขาสูงที่เต็มไปด้วยจอมเวทย์และสัตว์อสูรที่ทรงพลัง',
        minLevel: 21,
        bgEmoji: '⛰️',
        monsters: [
            MONSTERS.find(m => m.id === 'm-14'),
            MONSTERS.find(m => m.id === 'm-15'),
            MONSTERS.find(m => m.id === 'm-16'),
            MONSTERS.find(m => m.id === 'm-17'),
            MONSTERS.find(m => m.id === 'm-18')
        ].filter(Boolean),
    },
    {
        id: 'inferno-wastelands',
        name: 'ดินแดนนรก',
        description: 'ดินแดนที่ถูกเผาทำลายด้วยไฟและพลังมืด',
        minLevel: 31,
        bgEmoji: '🔥',
        monsters: [
            MONSTERS.find(m => m.id === 'm-19'),
            MONSTERS.find(m => m.id === 'm-20'),
            MONSTERS.find(m => m.id === 'm-21'),
            MONSTERS.find(m => m.id === 'm-22'),
            MONSTERS.find(m => m.id === 'm-23')
        ].filter(Boolean),
    },
    {
        id: 'celestial-realm',
        name: 'แดนสวรรค์',
        description: 'ดินแดนศักดิ์สิทธิ์ที่เต็มไปด้วยเทพและสัตว์อสูรสูงสุด',
        minLevel: 41,
        bgEmoji: '✨',
        monsters: [
            MONSTERS.find(m => m.id === 'm-24'),
            MONSTERS.find(m => m.id === 'm-25'),
            MONSTERS.find(m => m.id === 'm-26'),
            MONSTERS.find(m => m.id === 'm-27'),
            MONSTERS.find(m => m.id === 'm-28')
        ].filter(Boolean),
    },
    {
        id: 'eternal-peaks',
        name: 'ยอดเขานิรันดร์',
        description: 'จุดสิ้นสุดของการผจญภัยที่เต็มไปด้วยความท้าทายสูงสุด',
        minLevel: 46,
        bgEmoji: '🏔️',
        monsters: [
            MONSTERS.find(m => m.id === 'm-29'),
            MONSTERS.find(m => m.id === 'm-30'),
            MONSTERS.find(m => m.id === 'm-31')
        ].filter(Boolean),
    },
    {
        id: 'wizard-tower',
        name: 'วิหารจอมเวทย์',
        description: 'ที่อยู่ของเหล่าจอมเวทย์และบอสที่ทรงพลัง',
        minLevel: 25,
        bgEmoji: '👑',
        monsters: [
            MONSTERS.find(m => m.id === 'boss-02'),
            MONSTERS.find(m => m.id === 'boss-03'),
            MONSTERS.find(m => m.id === 'boss-04'),
            MONSTERS.find(m => m.id === 'boss-05')
        ].filter(Boolean),
    }
];