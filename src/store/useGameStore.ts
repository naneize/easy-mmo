import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Entity, MonsterData, ElementType, BattleLogEntry, GameItem, BattleEffect } from '../types/game'
import { simulateBattle } from '../logic/battle'
import { ITEMS } from '../data/items'
import { calculateFinalStats } from '../logic/stats'
import { calculateLevelUp } from '../logic/experience'
import { BattleLogger } from '../logic/battleLogger'
import { INITIAL_SKILLS, reconstructSkill } from './skills'
import type { Skill } from './skills'
import type { SkillTier } from '../types/game';
import { SKILL_EFFECTS } from '../logic/skillEffects';

// #region --- Interfaces ---
interface BattleResultSummary {
  won: boolean
  expEarned: number
  goldEarned: number
  isLevelUp: boolean
  monsterId: string
  monsterName: string
  droppedSkillIds?: string[];
}


interface GameState {
  player: Entity
  monster: MonsterData | null
  inventory: string[]
  equipped: {
    weapon: string | null
    armor: string | null
    accessory: string | null
  }
  ownedSkills: Skill[]
  equippedSkills: Skill[]
  unlockedSkills: string[]
  battleLogs: BattleLogEntry[]
  lastBattleResult: BattleResultSummary | null
  monsterKills: Record<string, number>

  unlockedClasses: string[]
  markClassUnlocked: (classId: string) => void

  // --- Actions ---
  setElement: (newElement: ElementType) => void
  purchaseItem: (itemId: string) => void
  buyItem: (item: GameItem) => void
  equipItem: (itemId: string) => void
  unequipItem: (type: 'weapon' | 'armor' | 'accessory') => void
  equipSkill: (skillId: string) => void
  unequipSkill: (skillId: string) => void
  upgradeSkill: (skillId: string) => void
  unlockSkill: (id: string) => void
  processBattle: (monster: MonsterData) => void
  resetBattle: () => void
  clearBattleResult: () => void
  regenHP: () => void

  // --- Helpers / Computed ---
  // แก้ไขส่วน Interface หรือ Type ของ getDerivedStats
  getDerivedStats: () => {
    atk: number;
    def: number;
    maxHp: number;
    lifesteal: number;
    bonusAtk: number;
    bonusDef: number;
    bonusHp: number;
    // ✨ เพิ่ม 3 บรรทัดนี้เข้าไปใน Type Definition
    baseAtk: number;
    baseDef: number;
    baseMaxHp: number;
    // ------------------------------------------
    isAtkReduced: boolean;
    isDefReduced: boolean;
    isHpReduced: boolean;
    defPenalty: number;
  };
  getOwnedSkillsWithIcons: () => Skill[]
  getEquippedSkillsWithIcons: () => Skill[]
}
// #endregion



// Utility function for skill upgrade costs based on tier
export const getUpgradeCost = (currentLevel: number, tier: SkillTier) => {
  const settings = {
    common: { base: 500, mult: 1.4 },
    rare: { base: 2500, mult: 1.5 },
    epic: { base: 10000, mult: 1.6 },
    legendary: { base: 50000, mult: 1.8 }
  };

  const { base, mult } = settings[tier] || { base: 1000, mult: 1.5 };

  if (currentLevel === 0) return base;
  return Math.floor(base * Math.pow(mult, currentLevel));
};


export const getNextLevelPreview = (skill: Skill, player: Entity) => {
  const effectFn = SKILL_EFFECTS[skill.id];
  if (typeof effectFn !== 'function') return null;

  const nextLevel = (skill.level || 1) + 1;

  const dummyMonster = {
    id: 'dummy',
    name: 'Dummy',
    hp: 100,
    maxHp: 100,
    atk: 10,
    def: 10,
    element: 'Neutral'
  } as any;

  // จำลองการรันฟังก์ชันด้วย Level ถัดไป
  const nextResult = effectFn({
    player,
    monster: dummyMonster,
    baseValue: skill.value ?? 0,
    level: nextLevel
  });

  return {
    level: nextLevel,
    value: nextResult.value,
    // --- Modifiers (ค่าบวกตรงๆ) ---
    hpMod: nextResult.hpMod,
    atkMod: nextResult.atkMod,
    defMod: nextResult.defMod, // เพิ่ม defMod ด้วยเผื่อมีสกิลบวก DEF ตรงๆ
    // --- Percentages (ค่าบวกเป็น %) ---
    hpPercent: nextResult.hpPercent, // สำคัญมากสำหรับ Elemental Mastery
    atkPercent: nextResult.atkPercent, // สำคัญมากสำหรับ Elemental Mastery
    defPercent: nextResult.defPercent  // สำคัญมากสำหรับ Elemental Mastery
  };
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get): GameState => ({
      player: {
        hp: 350,
        maxHp: 350,
        atk: 35, // 15
        def: 20, // 10
        level: 1,
        lastElementChange: 0,
        gold: 1000,
        exp: 0,
        maxExp: 100,
        element: 'Neutral' as ElementType,
        skills: INITIAL_SKILLS,
        name: 'Hero',
        equipment: {
          weapon: null,
          armor: null,
          accessory: null,
        },
        critChance: 0.05, // Default 5%
        critDamage: 1.5, // Default 1.5x
      },
      monster: null as MonsterData | null,
      inventory: ['w_wooden_sword', 'a_leather_armor'] as string[],
      equipped: { weapon: null, armor: null, accessory: null } as GameState['equipped'],
      ownedSkills: INITIAL_SKILLS.map(s => ({ ...s, level: 1 })),
      equippedSkills: ['blade-dance', 'critical-strike', 'lifesteal-vamp', 'armor-penetration'].map(id => {
        const skill = INITIAL_SKILLS.find(s => s.id === id);
        return skill ? { ...skill, level: 1, unlocked: true } : null;
      }).filter(Boolean) as Skill[], // เริ่มต้นมี 4 สกิลของ Berserker ใส่อยู่แล้ว
      unlockedSkills: ['blade-dance', 'critical-strike', 'lifesteal-vamp', 'armor-penetration'] as string[],
      battleLogs: [],
      lastBattleResult: null as BattleResultSummary | null,
      monsterKills: {},

      unlockedClasses: [],
      markClassUnlocked: (classId) => {
        set((state) => {
          if (state.unlockedClasses.includes(classId)) return state;
          return { unlockedClasses: [...state.unlockedClasses, classId] };
        });
      },

      // #region --- Computed Stats ---
      getDerivedStats: () => {
        const { player, equipped, monsterKills } = get();
        const equippedSkills = get().getEquippedSkillsWithIcons();
        return calculateFinalStats(player, equipped, monsterKills, equippedSkills);
      },
      // #endregion

      // #region --- Character & Inventory Actions ---

      setElement: (newElement) => {
        const { player } = get();
        const now = Date.now();
        const COOLDOWN_MS = 3 * 60 * 1000; // 3 นาที

        // 1. คำนวณค่าธรรมเนียมพื้นฐาน (Multiplier ตามช่วงเลเวล)
        const getBaseMultiplier = (lvl: number) => {
          if (lvl < 5) return 10;    // เลเวล 1-4: จ่ายถูกมาก (หลักสิบ)
          if (lvl < 10) return 100;  // เลเวล 5-9: เริ่มจริงจัง (หลักร้อยถึงพัน)
          return 250;                // เลเวล 10+: ช่วง End-game (หลักหลายพัน)
        };

        // 2. สูตรไฮบริด: (เลเวล * ตัวคูณ) + (5% ของเงินในกระเป๋า)
        // วิธีนี้จะช่วยดึงเงินออกจากระบบได้ดีมากในกรณีที่ผู้เล่นฟาร์มเงินมาเยอะเกินไป
        const baseCost = player.level * getBaseMultiplier(player.level);
        const wealthTax = Math.floor(player.gold * 0.05);
        const totalCost = baseCost + wealthTax;

        // 3. เช็คเงื่อนไข Cooldown
        const timeDiff = now - (player.lastElementChange || 0);
        if (timeDiff < COOLDOWN_MS) {
          const remainingSec = Math.ceil((COOLDOWN_MS - timeDiff) / 1000);
          set((state) => ({
            battleLogs: [...state.battleLogs, {
              type: 'error',
              text: `⏳ เปลี่ยนธาตุเร็วไป! รออีก ${remainingSec} วินาที`
            }]
          }));
          return;
        }

        // 4. เช็คทอง (เทียบกับราคาที่รวมภาษีคนรวยแล้ว)
        if (player.gold < totalCost) {
          set((state) => ({
            battleLogs: [...state.battleLogs, {
              type: 'error',
              text: `❌ ทองไม่พอ! ต้องใช้ ${totalCost.toLocaleString()} Gold (รวมค่าธรรมเนียมตามความมั่งคั่ง)`
            }]
          }));
          return;
        }

        // 5. ผ่านเงื่อนไข -> หักเงิน + เปลี่ยนธาตุ + บันทึกเวลา
        set((state) => ({
          player: {
            ...state.player,
            element: newElement,
            gold: state.player.gold - totalCost,
            lastElementChange: now
          },
          battleLogs: [
            ...state.battleLogs,
            {
              type: 'synergy',
              text: `✨ จ่าย ${totalCost.toLocaleString()} Gold (Lvl.${player.level}) เปลี่ยนเป็นธาตุ [${newElement}] สำเร็จ!`
            }
          ]
        }));
      },



      buyItem: (item: GameItem) => {
        get().purchaseItem(item.id);
      },

      purchaseItem: (itemId) => {
        const item = ITEMS[itemId];
        if (!item) return;

        const { player } = get();

        if (player.gold < item.price) {
          set((state) => ({
            battleLogs: [...state.battleLogs, { type: 'info', text: `❌ ทองไม่พอซื้อ ${item.name}!` }]
          }));
          return;
        }

        // กรณีไอเทมกดใช้ (Potion)
        if (item.type === 'consumable') {
          const finalStats = get().getDerivedStats();
          const oldHp = player.hp;
          const newHp = Math.min(finalStats.maxHp, player.hp + (item.effect?.value || 0));

          set((state) => ({
            player: { ...state.player, gold: state.player.gold - item.price, hp: newHp },
            battleLogs: [...state.battleLogs, { type: 'regen', text: `💖 ใช้ ${item.name}: ฟื้นฟู +${Math.floor(newHp - oldHp)} HP` }]
          }));
        }
        // กรณีอุปกรณ์สวมใส่
        else {
          set((state) => ({
            player: { ...state.player, gold: state.player.gold - item.price },
            inventory: [...state.inventory, itemId],
            battleLogs: [...state.battleLogs, { type: 'info', text: `📦 ซื้อ ${item.name} และเก็บเข้ากระเป๋าแล้ว!` }]
          }));
        }
      },

      equipItem: (itemId) => {
        const item = ITEMS[itemId];
        // 🚩 ลบ equipped ออกจากบรรทัดนี้ เพราะไม่ได้ใช้ check logic ก่อน set
        const { player, inventory } = get();

        if (!item || !inventory.includes(itemId)) return;

        if (player.level < item.minLevel) {
          set((state) => ({
            battleLogs: [...state.battleLogs, { type: 'info', text: `⚠️ เลเวลไม่พอ! ต้องการ Lv.${item.minLevel} เพื่อใส่ ${item.name}` }]
          }));
          return;
        }

        set((state) => {
          const itemType = item.type as keyof typeof state.equipped;
          return {
            equipped: { ...state.equipped, [itemType]: itemId },
            battleLogs: [...state.battleLogs, { type: 'info', text: `⚔️ สวมใส่ ${item.name} เรียบร้อย` }]
          };
        });
      },

      unequipItem: (type) => {
        set((state) => ({
          equipped: { ...state.equipped, [type]: null },
          battleLogs: [...state.battleLogs, { type: 'info', text: `🛡️ ถอดอุปกรณ์ออกแล้ว` }]
        }));
      },
      // #endregion

      // #region --- Skill Actions ---
      equipSkill: (skillId) => {
        const { equippedSkills, ownedSkills } = get()
        if (equippedSkills.some((s) => s.id === skillId)) return
        if (equippedSkills.length >= 4) return

        const skill = ownedSkills.find((s) => s.id === skillId)
        if (skill) set({ equippedSkills: [...equippedSkills, skill] })
      },

      unequipSkill: (skillId) => {
        set((state) => ({ equippedSkills: state.equippedSkills.filter((s) => s.id !== skillId) }))
      },

      upgradeSkill: (skillId) => {
        const { player, ownedSkills } = get();
        const skill = ownedSkills.find(s => s.id === skillId);
        if (!skill) return;

        const currentLevel = skill.level || 1;

        // 💡 ใช้ฟังก์ชัน getUpgradeCost ใหม่ที่คำนึงถึง tier
        const upgradeCost = getUpgradeCost(currentLevel, skill.tier);

        const maxLevel = 10;

        if (player.gold >= upgradeCost && currentLevel < maxLevel) {
          set((state) => ({
            player: {
              ...state.player,
              gold: state.player.gold - upgradeCost
            },
            ownedSkills: state.ownedSkills.map(s =>
              s.id === skillId ? { ...s, level: currentLevel + 1 } : s
            ),
            equippedSkills: state.equippedSkills.map(s =>
              s.id === skillId ? { ...s, level: currentLevel + 1 } : s
            )
          }));
        }
      },

      unlockSkill: (id) => {
        set((state) => {
          // 1. ป้องกันการปลดล็อกซ้ำ
          if (state.unlockedSkills.includes(id)) return state;

          // 2. หาชื่อสกิลจาก ownedSkills (เอาไว้โชว์ใน Log)
          const targetSkill = state.ownedSkills.find(s => s.id === id);
          const skillName = targetSkill ? targetSkill.name : id;

          return {
            // อัปเดตรายการ ID ที่ปลดล็อกแล้ว
            unlockedSkills: [...state.unlockedSkills, id],

            // แก้ไขก้อน ownedSkills: 
            // วนลูปเช็คทุกสกิล ถ้าเจอ ID ที่ตรงกัน ให้เปลี่ยน unlocked เป็น true และ level เป็น 1
            ownedSkills: state.ownedSkills.map((skill) =>
              skill.id === id
                ? { ...skill, unlocked: true, level: 1 }
                : skill
            ),

            // เพิ่มข้อความใน Log ให้ผู้เล่นดีใจ
            battleLogs: [
              ...state.battleLogs,
              {
                type: 'synergy',
                text: `✨ ยินดีด้วย! คุณได้รับสกิล [${skillName}] จากการดรอป`
              }
            ]
          };
        });
      },
      // #endregion

      // #region --- Battle & Passive Systems ---

      regenHP: () => {
        const { player } = get();
        const finalStats = get().getDerivedStats();
        if (player.hp >= finalStats.maxHp) return;

        // ฟื้นฟู 1% ของ Max HP สุทธิ
        const regenAmount = Math.max(1, Math.floor(finalStats.maxHp * 0.01));
        set((state) => ({
          player: { ...state.player, hp: Math.min(finalStats.maxHp, state.player.hp + regenAmount) }
        }));
      },

      processBattle: (monsterData) => {
        const { player, ownedSkills, equippedSkills, monsterKills, equipped } = get(); // 1. ดึง equipped ออกมาด้วย
        const currentKillCount = monsterKills[monsterData.id] || 0;


        const finalStats = get().getDerivedStats();

        const playerForBattle = {
          ...player,
          actualAtk: finalStats.atk,
          actualDef: finalStats.def,
          maxHp: finalStats.maxHp
        };

        const latestEquippedSkills = equippedSkills
          .map(eqSkill => {
            return ownedSkills.find(os => os.id === eqSkill.id) || eqSkill;
          })
          .filter(Boolean); // กรอง null/undefined ออก

        // ✨ 2. ดึงข้อมูล Item จริงๆ จาก Database (ITEMS) ตามที่สวมใส่อยู่
        const weaponItem = equipped.weapon ? ITEMS[equipped.weapon] : null;
        const armorItem = equipped.armor ? ITEMS[equipped.armor] : null;
        const accItem = equipped.accessory ? ITEMS[equipped.accessory] : null;

        // ✨ 3. รวม "สกิล" และ "ไอเทมสวมใส่" เข้าด้วยกันเป็น Array เดียว
        const allActiveEffects = [
          ...latestEquippedSkills,
          weaponItem,
          armorItem,
          accItem
        ].filter(Boolean) as BattleEffect[]; // กรองเอาเฉพาะตัวที่ไม่เป็น null

        // ✨ 4. ส่ง allActiveEffects (ที่มีไอเทมแล้ว) เข้าไปแทน latestEquippedSkills
        const result = simulateBattle(playerForBattle, monsterData, allActiveEffects, currentKillCount);

        set((state) => {
          // --- 1. เตรียมตัวแปรพื้นฐานสำหรับอัปเดต Store ---
          let tempPlayer = {
            ...state.player,
            hp: result.playerHp,
            gold: state.player.gold + result.goldEarned,
            exp: state.player.exp + result.expEarned
          };

          const newMonsterKills = { ...state.monsterKills };
          const currentLogs = [...result.logs];
          let newUnlockedSkills = [...state.unlockedSkills];
          let newUnlockedSkillsFromThisBattle: string[] = [];
          let isLevelUp = false;

          // --- 2. คำนวณรางวัลกรณีที่ชนะ ---
          if (result.won) {
            newMonsterKills[monsterData.id] = (newMonsterKills[monsterData.id] || 0) + 1;
            const lvl = calculateLevelUp(tempPlayer);
            tempPlayer = lvl.updatedPlayer;
            isLevelUp = lvl.isLevelUp;

            const droppedSkillIds = monsterData.droppedSkills ?? [];
            if (droppedSkillIds.length > 0) {
              for (const skillId of droppedSkillIds) {
                if (newUnlockedSkills.includes(skillId)) continue;

                // ใช้ true สำหรับการทดสอบ (ดรอป 100%)
                // ค้นหาบรรทัด if (true) เดิมแล้ววางทับด้วยโค้ดชุดนี้ครับ
                const dropChance = 0.03 + (Math.random() * 0.02); // โอกาสดรอป 3-5%
                if (Math.random() < dropChance) {
                  newUnlockedSkills.push(skillId);
                  newUnlockedSkillsFromThisBattle.push(skillId);

                  const skillName = state.ownedSkills.find(s => s.id === skillId)?.name ?? skillId;
                  currentLogs.push({
                    type: 'synergy',
                    text: `🎁 คุณได้รับสกิลใหม่จาก ${monsterData.name}: [${skillName}] (${Math.round(dropChance * 100)}% Drop)`
                  });
                }
              }
            }

            if (isLevelUp) {
              currentLogs.push({ type: 'levelup', text: `🎊 เลเวลอัป! (+${lvl.levelGained} LV)` });
              currentLogs.push(BattleLogger.statBonus(
                lvl.statsGained.hp,
                lvl.statsGained.atk,
                lvl.statsGained.def
              ));
            }
          }

          // --- 3. สร้าง Summary (วางไว้นอก if เพื่อให้ return ด้านล่างมองเห็น) ---
          const summary: BattleResultSummary = {
            won: result.won,
            expEarned: result.expEarned,
            goldEarned: result.goldEarned,
            isLevelUp: isLevelUp,
            monsterId: monsterData.id,
            monsterName: monsterData.name,
            droppedSkillIds: newUnlockedSkillsFromThisBattle,
          };

          const updatedOwnedSkills = state.ownedSkills.map(s =>
            newUnlockedSkillsFromThisBattle.includes(s.id)
              ? { ...s, unlocked: true, level: 1 }
              : s
          );

          console.log("1. Store is setting:", summary.droppedSkillIds);

          // --- 4. Return ข้อมูลทั้งหมดกลับไปอัปเดต State ของ Zustand ---
          return {
            player: tempPlayer,
            monsterKills: newMonsterKills,
            unlockedSkills: newUnlockedSkills,
            ownedSkills: updatedOwnedSkills,
            lastBattleResult: summary,
            battleLogs: [...state.battleLogs, ...currentLogs]
          };
        });
      },

      resetBattle: () => set({ battleLogs: [], monster: null, lastBattleResult: null }),
      clearBattleResult: () => set({ lastBattleResult: null }),

      getOwnedSkillsWithIcons: () => {
        const { ownedSkills, unlockedSkills } = get();
        const safeUnlockedList = Array.isArray(unlockedSkills)
          ? unlockedSkills.map(id => String(id).trim())
          : [];

        const processedSkills = ownedSkills.map(s => {
          const cleanId = String(s.id).trim();
          const isUnlocked = safeUnlockedList.includes(cleanId);

          return {
            ...s,
            id: cleanId,
            unlocked: isUnlocked
          };
        });

        // 🔥 แสดงผลเป็นตารางใน Console เพื่อให้ไล่เช็คได้ง่ายๆ
        console.table(processedSkills.map(s => ({
          ID: s.id,
          Name: s.name,
          IsUnlocked: s.unlocked
        })));

        return processedSkills.map(s => reconstructSkill(s));
      },


      getEquippedSkillsWithIcons: () => {
        const { equippedSkills, unlockedSkills } = get();
        return equippedSkills.map(s => reconstructSkill({ ...s, unlocked: unlockedSkills.includes(s.id) }));
      },
      // #endregion
    }),
    {
      name: 'hero-quest-storage',
      // เลือกเฉพาะส่วนที่ต้องการเก็บถาวร
      partialize: (state) => ({
        player: state.player,
        inventory: state.inventory,
        equipped: state.equipped,
        ownedSkills: state.ownedSkills,
        equippedSkills: state.equippedSkills,
        unlockedSkills: state.unlockedSkills,
        unlockedClasses: state.unlockedClasses,
        monsterKills: state.monsterKills,
        lastBattleResult: state.lastBattleResult
      }),
    }
  )
)