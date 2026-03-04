import { MONSTERS } from "./monsters";
import type { GameMap } from "../types/game";

export const WORLD_MAPS: GameMap[] = [
    {
        id: 'starter-field',
        name: 'ทุ่งหญ้าเริ่มต้น',
        description: 'พื้นที่สำหรับนักผจญภัยหน้าใหม่ เต็มไปด้วยสไลม์ตัวน้อย',
        minLevel: 1,
        bgEmoji: '🌱',
        monsters: MONSTERS
            .filter(m => m.level <= 4)
            .sort((a, b) => a.level - b.level),
    },
    {
        id: 'whispering-forest',
        name: 'ป่ากระซิบ',
        description: 'ป่าลึกที่เริ่มมีมอนสเตอร์ที่ดุร้ายและรวดเร็ว',
        minLevel: 5,
        bgEmoji: '🌲',
        monsters: MONSTERS
            .filter(m => m.level >= 5 && m.level <= 11)
            .sort((a, b) => a.level - b.level),
    },
    {
        id: 'shadow-plains',
        name: 'ทุ่งเงา',
        description: 'ทุ่งกว้างที่เต็มไปด้วยนักธนูและสัตว์อสูร',
        minLevel: 12,
        bgEmoji: '🏜️',
        monsters: MONSTERS
            .filter(m => m.level >= 12 && m.level <= 20)
            .sort((a, b) => a.level - b.level),
    },
    {
        id: 'crystal-mountains',
        name: 'ภูเขาผลึก',
        description: 'ภูเขาสูงที่เต็มไปด้วยจอมเวทย์และสัตว์อสูรที่ทรงพลัง',
        minLevel: 21,
        bgEmoji: '⛰️',
        monsters: MONSTERS
            .filter(m => m.level >= 21 && m.level <= 30)
            .sort((a, b) => a.level - b.level),
    },
    {
        id: 'inferno-wastelands',
        name: 'ดินแดนนรก',
        description: 'ดินแดนที่ถูกเผาทำลายด้วยไฟและพลังมืด',
        minLevel: 31,
        bgEmoji: '🔥',
        monsters: MONSTERS
            .filter(m => m.level >= 31 && m.level <= 40)
            .sort((a, b) => a.level - b.level),
    },
    {
        id: 'celestial-realm',
        name: 'แดนสวรรค์',
        description: 'ดินแดนศักดิ์สิทธิ์ที่เต็มไปด้วยเทพและสัตว์อสูรสูงสุด',
        minLevel: 41,
        bgEmoji: '✨',
        monsters: MONSTERS
            .filter(m => m.level >= 41 && m.level <= 50)
            .sort((a, b) => a.level - b.level),
    },
    {
        id: 'ancient-ruins',
        name: 'ซากปรักหักพังโบราณ',
        description: 'สถานที่ลึกลับที่เต็มไปด้วยพลังงานด้านมืด',
        minLevel: 50,
        bgEmoji: '🏛️',
        monsters: MONSTERS
            .filter(m => (m.element === 'Dark' || m.element === 'Light') && !m.id.startsWith('boss'))
            .sort((a, b) => a.level - b.level),
    },
    {
        id: 'dragon-lair',
        name: 'รังมังกรทมิฬ',
        description: 'ที่อยู่ของบอสใหญ่ มังกรที่แข็งแกร่งที่สุดในปฐพี',
        minLevel: 15,
        bgEmoji: '🌋',
        monsters: MONSTERS
            .filter(m => m.id.startsWith('boss'))
            .sort((a, b) => a.level - b.level),
    }
];