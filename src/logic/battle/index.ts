import i18next from 'i18next';
import type { Entity, MonsterData, BattleResult, BattleLogEntry, BattleEffect } from '../../types/game';
import { prepareBattleContext } from './modules/battleSetup';
import { handlePlayerTurn } from './modules/playerActions';
import { handleMonsterTurn } from './modules/monsterActions';
import { initializeMonster } from '../../data/monsters';
import { BattleLogger as Log } from '../battleLogger';
import { calculatePlayerClass } from '../../utils/gameHelpers';
import { MONSTER_PASSIVES } from '../monsterPassives';
import { BattleLogger } from '../battleLogger';



// Helper สำหรับแปลภาษา
const t = (key: string, params?: Record<string, any>) => i18next.t(key, params) as string;


export const simulateBattle = (
    player: Entity,
    monster: MonsterData,
    equippedSkills: BattleEffect[],
    allMasteries: Record<string, number> = {},
    allMonsters: MonsterData[] = []
): BattleResult => {

    // #region --- [SETUP] ---
    const context = prepareBattleContext(player, monster, equippedSkills, allMasteries, allMonsters);
    const {
        allEffects, bonusStats, baseEffectiveAtk, baseEffectiveDef,
        baseEffectiveMaxHp, mElementMult, constantSkillLogs, pElementMult, playerClass
    } = context;

    console.log('🔍 ส่องดูข้อมูล Player ทั้งหมด:', player);

    const initializedMonster = initializeMonster(monster);





    // เตรียมชื่อมอนสเตอร์จากระบบแปลภาษา (ดึงตาม ID)
    const translatedMonsterName = t(`monsters.${monster.id}.name`);

    let p_hp = player.hp;
    let m_hp = initializedMonster.hp;



    const logs: BattleLogEntry[] = [...constantSkillLogs];

    // 2. ✨ ย้ายโค้ดเช็คเงื่อนไขมาไว้ตรงนี้ (หลังประกาศ logs)
    const equippedWeapon = player.equipment.weapon;

    let weaponMasteryMultiplier = 1;


    // เปลี่ยนจาก message เป็น text ตามที่ Error แจ้ง
    if (playerClass?.id === 'mercenary' && (equippedWeapon as any)?.weaponType === 'sword') {
        // เรียกใช้ Logger ที่เราเพิ่งสร้าง
        logs.push(BattleLogger.constant(
            'Class Special Skill',
            '+15% ATK'
        ));

        // ค่าพลังคำนวณเหมือนเดิม
        weaponMasteryMultiplier = 1.15;
    }
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



    // #endregion

    // #region --- [BATTLE LOOP] ---
    while (p_hp > 0 && m_hp > 0 && turn <= 50) {
        logs.push(Log.turn(turn));

        // --- [ส่วนที่แก้ไข] คำนวณ Monster Passive ประจำเทิร์น ---
        const turnPassiveLogs: BattleLogEntry[] = [];
        let mAtkMult = 1.0;
        let mDefMult = 1.0;
        let mReflect = 0;

        if (initializedMonster.passives) {
            initializedMonster.passives.forEach(p => {
                const effectFn = MONSTER_PASSIVES[p.id];
                if (effectFn) {
                    const result = effectFn({
                        monster: { ...initializedMonster, hp: m_hp },
                        player: { ...player, hp: p_hp }
                    });

                    if (result.triggered) {
                        const skillId = p?.id || "unknown";
                        const skillName = t(`skills.${skillId}.name`) || "Skill";

                        let displayValue = "";

                        if (result.atkPercent) mAtkMult += (result.atkPercent || 0);
                        if (result.defPercent) mDefMult += (result.defPercent || 0);
                        if (result.reflectPercent) mReflect += (result.reflectPercent || 0);

                        if (result.healPercent) {
                            const heal = Math.floor(initializedMonster.maxHp * result.healPercent);
                            m_hp = Math.min(initializedMonster.maxHp, m_hp + heal);
                            displayValue = `(+${heal.toLocaleString()} HP) (Remaining: ${m_hp.toLocaleString()} HP)`;
                        }
                        else if (result.atkPercent) {
                            displayValue = `(ATK +${Math.round(result.atkPercent * 100)}%)`;
                        }
                        else if (result.reflectPercent) {
                            displayValue = `${Math.round(result.reflectPercent * 100)}%`;
                        }

                        const logKey = `skills.${skillId}.log`;
                        const skillLogText = t(logKey, { value: displayValue }) || "";

                        // เก็บ Log สกิลไว้ในลิสต์ชั่วคราวก่อน เพื่อให้แสดงผลก่อนการโจมตี
                        turnPassiveLogs.push(Log.bossPassive(
                            translatedMonsterName || "Monster",
                            skillName,
                            skillLogText,
                            ""
                        ));
                    }
                }
            });
        }

        // 1. แสดง Log สกิล Passive ที่เกิดขึ้นต้นเทิร์น
        logs.push(...turnPassiveLogs);

        // เก็บเลือดบอสก่อนโดนผู้เล่นโจมตี เพื่อเอาไว้คำนวณสะท้อนดาเมจที่เกิดขึ้นจริง
        const hpBeforePlayerHit = m_hp;

        // 2. Player Turn (คำนวณการโจมตีของคุณ)
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

        let currentPHpAfterPlayer = pPhase.p_hp;
        let currentMHpAfterPlayer = pPhase.m_hp;

        // 3. แสดง Log การโจมตีของคุณ (⚔️ You attacks...)
        logs.push(...pPhase.logs);

        // 4. ระบบสะท้อนดาเมจ (Reflect) - แสดงผล "หลังจาก" คุณโจมตีเสร็จแล้ว
        if (mReflect > 0 && currentMHpAfterPlayer < hpBeforePlayerHit) {
            const actualDmgDealt = hpBeforePlayerHit - currentMHpAfterPlayer;
            const reflectDmg = Math.floor(actualDmgDealt * mReflect);

            if (reflectDmg > 0) {
                currentPHpAfterPlayer -= reflectDmg;
                // ✅ ตอนนี้ Log สะท้อนจะแสดงผลต่อท้ายการโจมตีของคุณอย่างถูกต้อง
                logs.push(Log.reflect(translatedMonsterName, reflectDmg));
            }
        }

        // อัปเดตค่ากลับเข้าตัวแปรหลัก
        p_hp = Math.max(0, currentPHpAfterPlayer);
        m_hp = Math.max(0, currentMHpAfterPlayer);

        if (m_hp <= 0 || p_hp <= 0) break;

        // 5. Monster Turn
        const mPhase = handleMonsterTurn(
            p_hp,
            m_hp,
            (initializedMonster.atk * mAtkMult) * mElementMult,
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
        let totalMultiplier = 1.0;

        const goldFinderSkill = equippedSkills.find(s => s.id === 'gold-finder');
        if (goldFinderSkill && 'level' in goldFinderSkill) {
            const skillBonus = 0.10 + ((goldFinderSkill.level - 1) * 0.02);
            totalMultiplier += skillBonus;
        }

        const playerClass = calculatePlayerClass(equippedSkills as Array<{ id: string }>);
        if (playerClass?.bonus?.gold_bonus) {
            totalMultiplier += playerClass.bonus.gold_bonus;
        }

        finalGold = Math.floor(baseGold * totalMultiplier);
    }

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
        monsterName: translatedMonsterName,
    };
};