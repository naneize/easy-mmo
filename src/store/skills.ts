import { Shield, Sparkles, Swords, Zap, Flame, Droplets, Mountain, Wind, Sun, Moon, Heart, Star, Crown, Target, Gift } from 'lucide-react'
import React from 'react'
import type { ElementType, StatTarget, SkillType, SkillTier } from '../types/game'

export type Skill = {
  id: string
  name: string
  description: string
  nameKey: string
  descriptionKey: string
  type: SkillType
  tier: SkillTier
  targetStat: StatTarget
  Icon: React.ElementType
  element?: ElementType
  chance?: number
  value: number
  bonusValue?: number
  level: number
  maxLevel?: number
  unlocked: boolean
}

// Icon mapping for reconstruction
const ICON_MAP: Record<string, React.ElementType> = {
  'spark-burst': Zap,
  'blade-dance': Swords,
  'aegis-guard': Shield,
  'calm-focus': Sparkles,
  'blazing-soul': Flame,
  'tidal-grace': Droplets,
  'stone-skin': Mountain,
  'tailwind-strike': Wind,
  'holy-aura': Sun,
  'dark-pact': Moon,
  'vitality-boost': Heart,
  'gold-finder': Star,
  'fire-ember': Flame,
  'water-purify': Droplets,
  'earth-wall': Mountain,
  'wind-dash': Wind,
  'light-blessing': Sun,
  'dark-corruption': Moon,
  'critical-strike': Target,
  'lifesteal-vamp': Heart,
  'armor-penetration': Swords,
  'elemental-mastery': Crown,
  'drop-chance': Gift,
  'drop-amount': Gift,
  'sturdy-body': Shield,
  'brute-force': Swords,
  'battle-focus': Target
}

// Helper function to reconstruct skills with proper Icon components
export const reconstructSkill = (skill: Omit<Skill, 'Icon'>): Skill => ({
  ...skill,
  Icon: ICON_MAP[skill.id] || Zap, // Default fallback
})

export const INITIAL_SKILLS: Skill[] = [
  // #region --- Neutral Skills ---
  {
    id: 'spark-burst',
    name: 'Spark Burst',
    description: 'มีโอกาส 25%(เพิ่มเป็น 40% หากผู้เล่นเป็นธาตุ Neutral)โจมตีซ้ำ 100% โดยจะเพิ่มโอกาสติด 2% และความแรง 3% ต่อ LV',
    nameKey: 'skills.spark-burst.name',
    descriptionKey: 'skills.spark-burst.description',
    type: 'on-hit',
    tier: 'common',
    targetStat: 'atk_percent',
    Icon: Zap,
    element: 'Neutral',
    chance: 0.25,
    value: 1.0,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'blade-dance',
    name: 'Blade Dance',
    description: 'เพิ่ม ATK 20% (เพิ่มเป็น 35% หากผู้เล่นเป็นธาตุ Neutral) โดยจะเพิ่มขึ้น 3% ต่อ LV',
    nameKey: 'skills.blade-dance.name',
    descriptionKey: 'skills.blade-dance.description',
    type: 'constant',
    tier: 'common',
    targetStat: 'atk_percent',
    Icon: Swords,
    element: 'Neutral',
    value: 0.20,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'aegis-guard',
    name: 'Aegis Guard',
    description: 'มีโอกาส 35% ลดความเสียหายลง 50% (เพิ่มเป็น 55% หากผู้เล่นเป็นธาตุ Neutral) โดยจะเพิ่มขึ้น 1.5% ต่อ LV',
    nameKey: 'skills.aegis-guard.name',
    descriptionKey: 'skills.aegis-guard.description',
    type: 'on-defend',
    tier: 'common',
    targetStat: 'dmg_reduction',
    Icon: Shield,
    element: 'Neutral',
    chance: 0.35,
    value: 0.50,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'calm-focus',
    name: 'Calm Focus',
    description: 'ฟื้นฟู 1% ของ HP สูงสุดต่อเทิร์น (เพิ่มเป็น 2% หากเป็นธาตุ Neutral) +0.5% ต่อ LV',
    nameKey: 'skills.calm-focus.name',
    descriptionKey: 'skills.calm-focus.description',
    type: 'constant',
    tier: 'common',
    targetStat: 'regen_percent',
    Icon: Sparkles,
    element: 'Neutral',
    value: 0.01,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  // #endregion

  // #region --- Elemental Synergy Skills ---
  {
    id: 'blazing-soul',
    name: 'Blazing Soul',
    description: 'เพิ่ม ATK 10% (เพิ่มเป็น 20% หากผู้เล่นเป็นธาตุ Fire) โดยจะเพิ่มขึ้น 1.5% ต่อ LV',
    nameKey: 'skills.blazing-soul.name',
    descriptionKey: 'skills.blazing-soul.description',
    type: 'constant',
    tier: 'common',
    targetStat: 'atk_percent',
    Icon: Flame,
    element: 'Fire',
    value: 0.10,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'tidal-grace',
    name: 'Tidal Grace',
    description: 'ฟื้นฟู HP 2% (5% หากผู้เล่นเป็นธาตุ Water) ของ Max HP ทุกเทิร์น (+0.3% ต่อ LV)',
    nameKey: 'skills.tidal-grace.name',
    descriptionKey: 'skills.tidal-grace.description',
    type: 'constant',
    tier: 'common',
    targetStat: 'regen_percent',
    Icon: Droplets,
    element: 'Water',
    value: 0.02,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'stone-skin',
    name: 'Stone Skin',
    description: 'เพิ่ม DEF 10% (25% หากผู้เล่นเป็นธาตุ Earth) และเพิ่มขึ้น 3% ต่อ LV',
    nameKey: 'skills.stone-skin.name',
    descriptionKey: 'skills.stone-skin.description',
    type: 'constant',
    tier: 'common',
    targetStat: 'def_flat',
    Icon: Mountain,
    element: 'Earth',
    value: 10,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'tailwind-strike',
    name: 'Tailwind',
    description: 'โอกาส 10% (30% หากผู้เล่นเป็นธาตุ Wind) ที่จะโจมตีเบิ้ล และเพิ่มขึ้น 1% ต่อ LV',
    nameKey: 'skills.tailwind-strike.name',
    descriptionKey: 'skills.tailwind-strike.description',
    type: 'on-hit',
    tier: 'common',
    targetStat: 'chance_boost',
    Icon: Wind,
    element: 'Wind',
    chance: 0.10,
    value: 1.0,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'holy-aura',
    name: 'Holy Aura',
    description: 'ลดความเสียหายลง 10% (25% หากผู้เล่นเป็นธาตุ Light) และลดเพิ่มขึ้น 1.5% ต่อ LV',
    nameKey: 'skills.holy-aura.name',
    descriptionKey: 'skills.holy-aura.description',
    type: 'on-defend',
    tier: 'common',
    targetStat: 'dmg_reduction',
    Icon: Sun,
    element: 'Light',
    value: 0.10,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'dark-pact',
    name: 'Dark Pact',
    description: 'เพิ่ม ATK 30% (เพิ่มขึ้น 3% ต่อ LV) แต่ลด DEF 10% (เพิ่มขึ้น 2% ต่อ LV) หากผู้เล่นเป็นธาตุ Dark จะไม่เสีย DEF',
    nameKey: 'skills.dark-pact.name',
    descriptionKey: 'skills.dark-pact.description',
    type: 'constant',
    tier: 'rare',
    targetStat: 'atk_flat',
    Icon: Moon,
    element: 'Dark',
    value: 30,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  // #endregion

  // #region --- Mercenary Path Skills ---
  {
    id: 'sturdy-body',
    name: 'Sturdy Body',
    description: 'เพิ่ม DEF 8% และเพิ่มขึ้น 1% ต่อ LV',
    nameKey: 'skills.sturdy-body.name',
    descriptionKey: 'skills.sturdy-body.description',
    type: 'constant',
    tier: 'common',
    targetStat: 'def_percent',
    Icon: Shield,
    element: 'Neutral',
    value: 0.08,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'brute-force',
    name: 'Brute Force',
    description: 'เพิ่ม ATK 8% และเพิ่มขึ้น 1% ต่อ LV',
    nameKey: 'skills.brute-force.name',
    descriptionKey: 'skills.brute-force.description',
    type: 'constant',
    tier: 'common',
    targetStat: 'atk_percent',
    Icon: Swords,
    element: 'Neutral',
    value: 0.08,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'battle-focus',
    name: 'Battle Focus',
    description: 'เพิ่ม Final DMG 5% และเพิ่มขึ้น 0.5% ต่อ LV',
    nameKey: 'skills.battle-focus.name',
    descriptionKey: 'skills.battle-focus.description',
    type: 'constant',
    tier: 'common',
    targetStat: 'none',
    Icon: Target,
    element: 'Neutral',
    value: 0.05,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  // #endregion

  // #region --- Common Tier Skills (Early Game) ---
  {
    id: 'vitality-boost',
    name: 'Vitality Boost',
    description: 'เพิ่ม Max HP 15% (+2% ต่อ Lv) หากผู้เล่นเป็นธาตุ Neutral ผลของสกิลจะเพิ่มเป็น 2 เท่า',
    nameKey: 'skills.vitality-boost.name',
    descriptionKey: 'skills.vitality-boost.description',
    type: 'constant',
    tier: 'common',
    targetStat: 'maxHp_flat',
    Icon: Heart,
    element: 'Neutral',
    value: 15,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'gold-finder',
    name: 'Gold Finder',
    description: 'ได้รับ Gold เพิ่มขึ้น 10% หลังการต่อสู้ และเพิ่มขึ้น 2% ต่อ LV',
    nameKey: 'skills.gold-finder.name',
    descriptionKey: 'skills.gold-finder.description',
    type: 'constant',
    tier: 'common',
    targetStat: 'gold_bonus', // ใช้สถานะชั่วคราวในการคำนวณ
    Icon: Star,
    element: 'Neutral',
    value: 0,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  // #endregion

  // #region --- Rare Tier Skills (Mid Game) ---
  {
    id: 'fire-ember',
    name: 'Fire Ember',
    description: 'โอกาส 15% ทำความเสียหายเพิ่มเติม 50% ของ ATK (เพิ่มเป็น 25% หากผู้เล่นเป็นธาตุ Fire) และเพิ่มขึ้น 2% ต่อ LV',
    nameKey: 'skills.fire-ember.name',
    descriptionKey: 'skills.fire-ember.description',
    type: 'on-hit',
    tier: 'rare',
    targetStat: 'atk_percent',
    Icon: Flame,
    element: 'Fire',
    chance: 0.15,
    value: 0.50,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'water-purify',
    name: 'Water Purify',
    description: 'ลบ Poison และฟื้นฟู HP 8% ของ Max HP ทันที (เพิ่มเป็น 12% หากผู้เล่นเป็นธาตุ Water) และเพิ่มขึ้น 1% ต่อ LV',
    nameKey: 'skills.water-purify.name',
    descriptionKey: 'skills.water-purify.description',
    type: 'on-defend',
    tier: 'rare',
    targetStat: 'hp_percent',
    Icon: Droplets,
    element: 'Water',
    chance: 1.0,
    value: 0.08,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'earth-wall',
    name: 'Earth Wall',
    description: 'เพิ่ม DEF 20% แต่ลด ATK 5% (ไม่ลด ATK หากผู้เล่นเป็นธาตุ Earth) และเพิ่มขึ้น 2% ต่อ LV',
    nameKey: 'skills.earth-wall.name',
    descriptionKey: 'skills.earth-wall.description',
    type: 'constant',
    tier: 'rare',
    targetStat: 'def_percent',
    Icon: Mountain,
    element: 'Earth',
    value: 0.20,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'wind-dash',
    name: 'Wind Dash',
    description: 'โอกาส 20% หลบหลีกการโจมตี และโต้ตอบด้วย ATK 50% (เพิ่มเป็น 30% หากผู้เล่นเป็นธาตุ Wind) และเพิ่มขึ้น 2% ต่อ LV',
    nameKey: 'skills.wind-dash.name',
    descriptionKey: 'skills.wind-dash.description',
    type: 'on-defend',
    tier: 'rare',
    targetStat: 'chance_boost',
    Icon: Wind,
    element: 'Wind',
    chance: 0.20,
    value: 0.50,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'light-blessing',
    name: 'Light Blessing',
    description: 'ฟื้นฟู HP 5% ของ Max HP ทุกเทิร์น และเพิ่ม ATK 10% (เพิ่มเป็น 15% หากผู้เล่นเป็นธาตุ Light) และเพิ่มขึ้น 1% ต่อ LV',
    nameKey: 'skills.light-blessing.name',
    descriptionKey: 'skills.light-blessing.description',
    type: 'constant',
    tier: 'rare',
    targetStat: 'regen_flat',
    Icon: Sun,
    element: 'Light',
    value: 0.05,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'dark-corruption',
    name: 'Dark Corruption',
    description: 'ลด DEF ศัตรู 15% (เพิ่มขึ้น 1% ต่อ LV) แต่ลด HP ผู้ใช้ 3% ต่อเทิร์น (ไม่เสีย HP หากผู้เล่นเป็นธาตุ Dark)',
    nameKey: 'skills.dark-corruption.name',
    descriptionKey: 'skills.dark-corruption.description',
    type: 'constant',
    tier: 'rare',
    targetStat: 'def_percent',
    Icon: Moon,
    element: 'Dark',
    value: -0.15,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  // #endregion

  // #region --- Epic Tier Skills (Mid-Late Game) ---
  {
    id: 'critical-strike',
    name: 'Critical Strike',
    description: 'โอกาส 8% ทำความเสียหาย 200% (Critical) และเพิ่มขึ้น 1% ต่อ LV',
    nameKey: 'skills.critical-strike.name',
    descriptionKey: 'skills.critical-strike.description',
    type: 'constant',
    tier: 'epic',
    targetStat: 'crit_chance',
    Icon: Target,
    element: 'Neutral',
    value: 8,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'critical-mastery',
    name: 'Critical Mastery',
    description: 'เพิ่มความเสียหาย Critical 20% (เพิ่มขึ้น 5% ต่อ LV)',
    nameKey: 'skills.critical-mastery.name',
    descriptionKey: 'skills.critical-mastery.description',
    type: 'constant',
    tier: 'epic',
    targetStat: 'crit_multi',
    Icon: Zap,
    element: 'Neutral',
    value: 20,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'lifesteal-vamp',
    name: 'Vampiric Touch',
    description: 'มีโอกาส 30% ที่จะดูดเลือดเริ่มต้น 15% (เพิ่มขึ้น 2% ต่อ Lv) จากความเสียหายที่ทำได้',
    nameKey: 'skills.lifesteal-vamp.name',
    descriptionKey: 'skills.lifesteal-vamp.description',
    type: 'constant',
    tier: 'epic',
    targetStat: 'lifesteal_percent',
    Icon: Heart,
    element: 'Neutral',
    value: 15,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  {
    id: 'armor-penetration',
    name: 'Armor Penetration',
    description: 'ทะลุ DEF ศัตรูเริ่มต้น 30% (เพิ่มขึ้น 2% ต่อ Lv) แต่แลกด้วยการลด ATK 10%',
    nameKey: 'skills.armor-penetration.name',
    descriptionKey: 'skills.armor-penetration.description',
    type: 'constant',
    tier: 'epic',
    targetStat: 'armor_pen',
    Icon: Swords,
    element: 'Neutral',
    value: 30,
    level: 1,
    maxLevel: 10,
    unlocked: false
  },
  // #endregion

  // #region --- Legendary Tier Skills (Late Game) ---
  {
    id: 'elemental-mastery',
    name: 'Elemental Mastery',
    description: 'ปลุกพลังแฝงแห่งธาตุ: เพิ่ม ATK, DEF และ HP มหาศาลตามเลเวลสกิล (สายไร้ธาตุจะได้รับโบนัสที่รุนแรงกว่าปกติ)',
    nameKey: 'skills.elemental-mastery.name',
    descriptionKey: 'skills.elemental-mastery.description',
    type: 'constant',
    tier: 'legendary',
    targetStat: 'multiple',
    Icon: Crown,
    element: 'Neutral',
    value: 0.25,
    level: 1,
    maxLevel: 10,
    unlocked: false
  }
  // #endregion
]