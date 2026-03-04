import type { Entity, MonsterData, BattleResult, BattleLogEntry, BattleEffect } from '../../types/game';
import { BattleLogger as Log } from "../battleLogger";
import { prepareBattleContext } from './modules/battleSetup';
import { handlePlayerTurn } from './modules/playerActions';
import { handleMonsterTurn } from './modules/monsterActions';
import { initializeMonster } from '../../data/monsters';

export const simulateBattle = (
    player: Entity,
    monster: MonsterData,
    equippedSkills: BattleEffect[],
    killCount: number = 0
): BattleResult => {

    // #region --- [SETUP] ---
    const context = prepareBattleContext(player, monster, equippedSkills, killCount);
    const { allEffects, bonusStats, baseEffectiveAtk, mElementMult, mastery, constantSkillLogs } = context;

    // คำนวณ stats จากระบบใหม่
    const initializedMonster = initializeMonster(monster);

    let p_hp = player.hp;
    let m_hp = initializedMonster.hp;
    const logs: BattleLogEntry[] = [...constantSkillLogs];
    let turn = 1;

    logs.push(Log.start(monster.name, initializedMonster.hp));

    const { pElementMult } = context;

    // ✅ แก้ไข: ส่ง pElementMult พร้อมด้วยธาตุของผู้เล่นและมอนสเตอร์
    // ตรวจสอบชื่อ property ให้ดี (น่าจะเป็น player.element และ monster.element)
    const elementNotice = Log.elementalNotice(
        pElementMult,
        player.element,
        monster.element
    );

    if (elementNotice) {
        logs.push(elementNotice);
    }

    if (mastery.tier > 0) {
        logs.push({ type: 'synergy', text: `📜 Mastery Lv.${mastery.tier} Active! (+${mastery.value} ${mastery.type.toUpperCase()})` });
    }
    // #endregion

    // #region --- [BATTLE LOOP] ---
    while (p_hp > 0 && m_hp > 0 && turn <= 50) {
        logs.push(Log.turn(turn));

        console.log(`[Turn Check] Turn ${turn} - Sending ATK: ${baseEffectiveAtk} to PlayerPhase`);

        // 1. Player Turn
        const pPhase = handlePlayerTurn(
            p_hp, m_hp,
            baseEffectiveAtk,
            player, monster,
            allEffects, bonusStats,
            player.maxHp
        );
        p_hp = pPhase.p_hp;
        m_hp = pPhase.m_hp;
        logs.push(...pPhase.logs);

        if (m_hp <= 0 || p_hp <= 0) break;

        // 2. Monster Turn
        const currentDef = Math.max(0, player.def + bonusStats.def_flat);
        const mPhase = handleMonsterTurn(
            p_hp,
            m_hp,
            initializedMonster.atk * mElementMult,
            currentDef,
            player,
            monster,
            allEffects
        );
        p_hp = mPhase.p_hp;
        m_hp = mPhase.m_hp;
        logs.push(...mPhase.logs);

        turn++;
    }
    // #endregion

    // #region --- [RESULT] ---
    const won = m_hp <= 0;

    // 💰 --- เริ่มการคำนวณ Gold พร้อม Bonus ---
    let finalGold = 0;
    if (won) {
        const baseGold = monster.gold || 0;

        // ค้นหาสกิล Gold Finder จากรายการสกิลที่ส่งเข้ามา (equippedSkills) 
        // หรือดึงจาก player.skills ตามโครงสร้างของคุณ
        const goldFinderSkill = equippedSkills.find(s => s.id === 'gold-finder');

        finalGold = baseGold;

        if (goldFinderSkill) {
            // 1. คำนวณ % ตามเลเวล (Lv.1 = 0.10, Lv.2 = 0.12...)
            const bonusPercent = 0.10 + ((goldFinderSkill.level - 1) * 0.02);

            // 2. คำนวณ "เงินส่วนที่เพิ่มขึ้น" แล้วปัดเศษทิ้ง
            const bonusGold = Math.floor(baseGold * bonusPercent);

            // 3. รวมเงินรางวัลทั้งหมด
            finalGold = baseGold + bonusGold;
        }
    }
    // 💰 --- จบการคำนวณ ---

    if (!won && p_hp <= 0) {
        logs.push(Log.lose(monster.name, m_hp));
    } else if (won) {
        // ✅ เปลี่ยนจาก monster.gold เป็น finalGold เพื่อให้ Log แสดงค่าที่บวกโบนัสแล้ว
        logs.push(Log.win(monster.name, finalGold, initializedMonster.exp, p_hp));
    }

    return {
        playerHp: Math.max(0, Math.floor(p_hp)),
        monsterHp: Math.max(0, Math.floor(m_hp)),
        logs,
        totalTurns: turn - 1,
        won,
        // ✅ ส่ง finalGold กลับไปเพื่อให้ Store อัปเดตทองให้ผู้เล่นจริง
        goldEarned: won ? finalGold : 0,
        expEarned: won ? initializedMonster.exp : 0,
        monsterId: monster.id,
        monsterName: monster.name,
    };
    // #endregion
};