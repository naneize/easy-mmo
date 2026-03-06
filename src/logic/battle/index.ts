import i18next from 'i18next';
import type { Entity, MonsterData, BattleResult, BattleLogEntry, BattleEffect } from '../../types/game';
import { prepareBattleContext } from './modules/battleSetup';
import { handlePlayerTurn } from './modules/playerActions';
import { handleMonsterTurn } from './modules/monsterActions';
import { initializeMonster } from '../../data/monsters';
import { BattleLogger as Log } from '../battleLogger';
import { calculatePlayerClass } from '../../utils/gameHelpers';

// Helper สำหรับแปลภาษา
const t = (key: string, params?: Record<string, any>) => i18next.t(key, params) as string;

export const simulateBattle = (
    player: Entity,
    monster: MonsterData,
    equippedSkills: BattleEffect[],
    killCount: number = 0
): BattleResult => {

    // #region --- [SETUP] ---
    const context = prepareBattleContext(player, monster, equippedSkills, killCount);
    const {
        allEffects, bonusStats, baseEffectiveAtk, baseEffectiveDef,
        baseEffectiveMaxHp, mElementMult, mastery, constantSkillLogs, pElementMult
    } = context;

    const initializedMonster = initializeMonster(monster);

    // เตรียมชื่อมอนสเตอร์จากระบบแปลภาษา (ดึงตาม ID)
    const translatedMonsterName = t(`monsters.${monster.id}.name`);

    let p_hp = player.hp;
    let m_hp = initializedMonster.hp;
    const logs: BattleLogEntry[] = [...constantSkillLogs];
    let turn = 1;

    // ✅ แก้ไข: ใช้ชื่อที่แปลแล้ว
    logs.push(Log.start(translatedMonsterName, initializedMonster.hp));

    const elementNotice = Log.elementalNotice(
        pElementMult,
        player.element,
        monster.element
    );

    if (elementNotice) {
        logs.push(elementNotice);
    }

    if (mastery.tier > 0) {
        logs.push(Log.synergy(`Mastery Lv.${mastery.tier} (+${mastery.value} ${mastery.type.toUpperCase()})`));
    }
    // #endregion

    // #region --- [BATTLE LOOP] ---
    while (p_hp > 0 && m_hp > 0 && turn <= 50) {
        logs.push(Log.turn(turn));

        // 1. Player Turn
        const pPhase = handlePlayerTurn(
            p_hp, m_hp,
            baseEffectiveAtk,
            player, monster,
            allEffects, bonusStats,
            baseEffectiveMaxHp,
            turn,
            context.playerClass?.id || "",
            pElementMult
        );

        p_hp = pPhase.p_hp;
        m_hp = pPhase.m_hp;
        logs.push(...pPhase.logs);

        if (m_hp <= 0 || p_hp <= 0) break;

        // 2. Monster Turn
        const mPhase = handleMonsterTurn(
            p_hp,
            m_hp,
            initializedMonster.atk * mElementMult,
            baseEffectiveDef,
            player,
            monster,
            allEffects,
            bonusStats,
            baseEffectiveMaxHp,
            turn,
            context.playerClass?.id || ""
        );

        p_hp = mPhase.p_hp;
        m_hp = mPhase.m_hp;
        logs.push(...mPhase.logs);

        turn++;
    }
    // #endregion

    // #region --- [RESULT] ---
    const won = m_hp <= 0;

    let finalGold = 0;

    if (won) {
        const baseGold = monster.gold || 0;
        // เริ่มต้นที่ 1.0 (คือ 100% ของ baseGold)
        let totalMultiplier = 1.0;

        // 1. เช็คโบนัสจากสกิล Gold Finder (10% base + 2% ต่อระดับ)
        const goldFinderSkill = equippedSkills.find(s => s.id === 'gold-finder');
        if (goldFinderSkill && 'level' in goldFinderSkill) {
            const skillBonus = 0.10 + ((goldFinderSkill.level - 1) * 0.02);
            totalMultiplier += skillBonus;
        }

        // 2. เช็คโบนัสจากอาชีพ (เช่น Mercenary ที่มี gold_bonus: 0.15)
        // ตรงนี้จะทำงานเมื่อผู้เล่นเปลี่ยนอาชีพเป็น Mercenary แล้วเท่านั้น
        const playerClass = calculatePlayerClass(equippedSkills as Array<{ id: string }>);
        if (playerClass?.bonus?.gold_bonus) {
            totalMultiplier += playerClass.bonus.gold_bonus;
        }

        // คำนวณทองสุทธิครั้งเดียวและปัดเศษลง
        finalGold = Math.floor(baseGold * totalMultiplier);
    }

    // ✅ แก้ไข: ใช้ชื่อที่แปลแล้วในผลการต่อสู้
    if (!won && p_hp <= 0) {
        logs.push(Log.lose(translatedMonsterName, m_hp));
    } else if (won) {
        logs.push(Log.win(translatedMonsterName, finalGold, initializedMonster.exp, p_hp));
    }

    return {
        playerHp: Math.max(0, Math.floor(p_hp)),
        monsterHp: Math.max(0, Math.floor(m_hp)),
        logs,
        totalTurns: Math.min(turn, 50),
        won,
        goldEarned: won ? finalGold : 0,
        expEarned: won ? initializedMonster.exp : 0,
        monsterId: monster.id,
        monsterName: translatedMonsterName, // ส่งชื่อที่แปลแล้วกลับไปด้วย
    };
    // #endregion
};