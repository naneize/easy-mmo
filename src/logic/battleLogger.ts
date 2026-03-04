import type { BattleLogEntry } from '../types/game';

export const BattleLogger = {
    // --- การเริ่มต้น ---
    start: (name: string, hp: number): BattleLogEntry => ({
        type: 'start',
        text: `⚔️ การต่อสู้เริ่มขึ้น! พบกับ [${name}] (HP: ${hp.toLocaleString()})`
    }),

    turn: (num: number): BattleLogEntry => ({
        type: 'turn',
        text: ` รอบที่ ${num} `
    }),

    // --- ในไฟล์ battleLogger.ts ---
    elementalNotice: (mult: number, pElem: string = 'Neutral', mElem: string = 'Neutral'): BattleLogEntry | null => {
        const playerType = pElem || 'Neutral';
        const monsterType = mElem || 'Neutral';

        if (mult !== 1) {
            return {
                type: 'elemental',
                playerElem: playerType, // ✅ ตอนนี้ TS จะไม่ด่าแล้ว
                monsterElem: monsterType, // ✅ เพราะเราลงทะเบียนไว้ใน Interface แล้ว
                text: `ธาตุ ${playerType} ${mult > 1 ? 'ได้เปรียบ' : 'เสียเปรียบ'} ${monsterType}! Damage x${mult}`
            };
        }
        return null;
    },

    synergy: (skillName: string): BattleLogEntry => ({
        type: 'synergy',
        text: `🌟 Synergy! พลังธาตุปลุกพลัง [${skillName}] ให้ทรงพลังขึ้น!`
    }),

    // --- ระบบสกิลและสถานะ ---
    regen: (amt: number, currentHp: number): BattleLogEntry => ({
        type: 'regen',
        text: `💚 ฟื้นฟูเลือด: +${Math.floor(amt).toLocaleString()} HP (เหลือ ${Math.floor(currentHp).toLocaleString()} HP)`
    }),

    // ปรับให้รองรับ icon แยกเพื่อให้ UI แสดงผลได้สวยขึ้น
    skill: (icon: string, name: string, effect: string): BattleLogEntry => ({
        type: 'skill',
        icon,
        text: `${name}: ${effect}`
    }),

    attack: (attacker: string, target: string, dmg: number, hpLeft: number): BattleLogEntry => ({
        type: 'attack',
        text: `${attacker} โจมตี ${target}: -${Math.floor(dmg).toLocaleString()} HP (เหลือ ${Math.max(0, Math.floor(hpLeft)).toLocaleString()})`
    }),

    // เพิ่มฟังก์ชันสำหรับเช็คเลือดผู้เล่นแบบเจาะจง (ใช้เรียกตอนจบเทิร์นได้)
    playerStatus: (currentHp: number, maxHp: number): BattleLogEntry => ({
        type: 'info',
        text: `❤️ สถานะผู้เล่น: ${Math.floor(currentHp).toLocaleString()} / ${maxHp.toLocaleString()} HP`
    }),

    // --- ระบบเลเวลอัป (Level Up) ---
    levelUp: (lv: number): BattleLogEntry => ({
        type: 'levelup',
        text: `🎊 ยินดีด้วย! เลเวลอัปเป็น Lv.${lv}!`
    }),

    statBonus: (hp: number, atk: number, def: number): BattleLogEntry => ({
        type: 'levelup',
        text: `📈 Status Up: HP+${hp}, ATK+${atk}, DEF+${def} (Full Heal!)`
    }),

    // --- ระบบ Critical (เพิ่มใหม่) ---
    critical: (attacker: string, target: string, dmg: number, mult: number, hpLeft: number): BattleLogEntry => ({
        type: 'critical',
        text: `💥 CRITICAL HIT! 💥 ${attacker} ระเบิดพลังโจมตีใส่ ${target} อย่างรุนแรง x${mult} เท่า!! สร้างความเสียหาย -${Math.floor(dmg).toLocaleString()} HP (เหลือ ${Math.max(0, Math.floor(hpLeft)).toLocaleString()})`
    }),

    doubleAttack: (attacker: string, target: string, dmg: number, hpLeft: number): BattleLogEntry => ({
        type: 'synergy', // ใช้ type synergy เพื่อให้สีข้อความเด่นกว่า attack ปกติ
        text: `🌪️ DOUBLE ATTACK! 🌪️ ${attacker} เคลื่อนที่ด้วยความเร็วสูง โจมตี ${target} ซ้ำอีกครั้ง! -${Math.floor(dmg).toLocaleString()} HP (เหลือ ${Math.max(0, Math.floor(hpLeft)).toLocaleString()})`
    }),

    // ✨ เพิ่มระบบหลบหลีก (Dodge)
    dodge: (target: string): BattleLogEntry => ({
        type: 'dodge',
        text: `💨 MISS! ${target} พริ้วไหวหลบการโจมตีได้อย่างรวดเร็ว!`
    }),

    // ✨ เพิ่มระบบโต้กลับ (Counter)
    counter: (attacker: string, target: string, dmg: number, hpLeft: number): BattleLogEntry => ({
        type: 'counter',
        text: `⚡ COUNTER STRIKE! ⚡ ${attacker} สวนกลับใส่ ${target}: ${Math.floor(dmg).toLocaleString()} HP (เหลือ ${Math.max(0, Math.floor(hpLeft)).toLocaleString()})`
    }),

    // ✨ เพิ่มระบบดูดเลือด (Lifesteal)
    lifesteal: (sourceName: string, amt: number, currentHp: number): BattleLogEntry => ({
        type: 'lifesteal',
        text: `🩸 [${sourceName}] ดูดเลือดฟื้นฟู +${Math.floor(amt).toLocaleString()} HP (ปัจจุบัน: ${Math.floor(currentHp).toLocaleString()} HP)`
    }),


    // --- สรุปผล ---
    win: (name: string, gold: number, exp: number, hpLeft: number): BattleLogEntry => ({
        type: 'win',
        text: `✨ ชัยชนะ! คุณปราบ ${name} ได้สำเร็จ (เหลือ HP: ${Math.floor(hpLeft).toLocaleString()}) | 💰 +${gold.toLocaleString()}G 🌟 +${exp.toLocaleString()}EXP`
    }),

    lose: (name: string, monsterHpLeft: number): BattleLogEntry => ({
        type: 'lose',
        text: `💀 พ่ายแพ้... คุณถูก ${name} กำจัด (มอนสเตอร์เหลือ HP: ${Math.floor(monsterHpLeft).toLocaleString()})`
    })
};