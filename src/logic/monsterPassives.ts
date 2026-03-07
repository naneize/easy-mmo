import i18next from 'i18next';
import type { MonsterData, Entity } from '../types/game';

// Interface สำหรับข้อมูลแวดล้อมตอนใช้ Passive
interface MonsterPassiveContext {
    monster: MonsterData;
    player: Entity;
    // เราอาจจะส่งค่าอื่นๆ เช่น turn หรือ lastDamageTaken เข้ามาด้วยในอนาคต
}

interface PassiveEffectResult {
    atkMod?: number;      // บวกพลังโจมตี (Flat)
    atkPercent?: number;  // บวกพลังโจมตี (%)
    defPercent?: number;  // บวกพลังป้องกัน (%)
    reflectPercent?: number; // สะท้อนดาเมจ (%)
    healPercent?: number;    // ฟื้นเลือด (%)
    log?: string;         // ข้อความแสดงใน Battle Log
    triggered: boolean;   // เช็คว่าเงื่อนไขครบจน Passive ทำงานไหม
}

export const MONSTER_PASSIVES: Record<string, (ctx: MonsterPassiveContext) => PassiveEffectResult> = {

    // 🛡️ Passive: สะท้อนดาเมจ (สำหรับราชาสไลม์)
    'p-reflect-skin': ({ monster }) => {
        const monsterName = i18next.t(monster.nameKey || `monsters.${monster.id}.name`);
        return {
            triggered: true,
            reflectPercent: 0.15, // สะท้อน 15%
            log: i18next.t('monsterPassive.reflectSkin', { name: monsterName })
        };
    },

    // 💢 Passive: บ้าคลั่ง (Enrage) - ยิ่งเลือดน้อยยิ่งตีแรง
    'p-enrage': ({ monster }) => {
        const hpRate = monster.hp / monster.maxHp;
        if (hpRate <= 0.4) { // ทำงานเมื่อเลือดต่ำกว่า 40%
            const monsterName = i18next.t(monster.nameKey || `monsters.${monster.id}.name`);
            return {
                triggered: true,
                atkPercent: 0.50, // เพิ่ม ATK 50%
                log: i18next.t('monsterPassive.enrage', { name: monsterName })
            };
        }
        return { triggered: false };
    },

    // 🧪 Passive: ฟื้นตัวอัตโนมัติ (Regeneration)
    'p-regen': ({ monster }) => {
        const hpRate = monster.hp / monster.maxHp;
        if (hpRate < 1.0) {
            const monsterName = i18next.t(monster.nameKey || `monsters.${monster.id}.name`);
            return {
                triggered: true,
                healPercent: 0.03, // ฟื้น 3% ทุกเทิร์น
                log: i18next.t('monsterPassive.regen', { name: monsterName })
            };
        }
        return { triggered: false };
    }
};