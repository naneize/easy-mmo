import { useMemo, useState } from 'react'
import { Users, CheckCircle2, Lock, TrendingUp, Sparkles, Shield, X, ChevronRight, Filter } from 'lucide-react'
import { CLASS_DEFINITIONS, type ClassDefinition } from '../data/classes'
import { INITIAL_SKILLS } from '../store/skills'
import { useGameStore } from '../store/useGameStore'
import { calculatePlayerClass } from '../utils/gameHelpers'
import { useTranslation } from 'react-i18next'

// --- Helper Functions (เหมือนเดิม) ---
function formatBonusValue(key: string, value: number): string {
  const isPercent = key.endsWith('_percent') ||
    key === 'crit_chance' ||
    key === 'armor_pen' ||
    key === 'dmgReduction' ||
    key === 'gold_bonus';

  if (isPercent) {
    const val = (value * 100).toFixed(0);
    return `${value > 0 ? '+' : ''}${val}%`;
  }
  if (key === 'crit_multi') return `+${value.toFixed(1)}x`;
  return value > 0 ? `+${value}` : `${value}`;
}

function formatBonusName(key: string, t: any): string {
  const globalKeyMap: Record<string, string> = {
    atk_flat: 'global.atk', atk_percent: 'global.atk',
    def_flat: 'global.def', def_percent: 'global.def',
    hp_mod: 'global.hp', hp_percent: 'global.hp',
    lifesteal_percent: 'global.lifesteal', crit_chance: 'global.critChance',
    crit_multi: 'global.critDamage', armor_pen: 'global.armorPen',
    dmgReduction: 'global.dmgReduction',
    gold_bonus: 'global.gold',
  }
  const isPercent = key.endsWith('_percent') || key === 'crit_chance' || key === 'armor_pen' || key === 'dmgReduction' || key === 'gold_bonus';
  const suffix = isPercent ? ' (%)' : '';
  const baseKey = globalKeyMap[key] || key;
  try { return t(baseKey, { lng: 'en' }) + suffix; } catch { return key + suffix; }
}

export function ClassesPage() {
  const { t } = useTranslation()
  const { getEquippedSkillsWithIcons, unlockedClasses } = useGameStore()

  // States
  const [selectedClass, setSelectedClass] = useState<ClassDefinition | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const equippedSkills = getEquippedSkillsWithIcons()
  const activeClass = calculatePlayerClass(equippedSkills)

  // Logic สำหรับ Filter หมวดหมู่
  const categories = useMemo(() => ['all', 'striker', 'tanker', 'caster'], [])

  const filteredClasses = useMemo(() => {
    if (activeFilter === 'all') return CLASS_DEFINITIONS;
    // @ts-ignore - กรณีที่ใน data ยังไม่ได้ใส่ category ฟิลด์
    return CLASS_DEFINITIONS.filter(cls => cls.category === activeFilter);
  }, [activeFilter])

  const skillMap = useMemo(() => {
    const map = new Map<string, { nameKey: string; descriptionKey: string }>()
    for (const s of INITIAL_SKILLS) {
      map.set(s.id, { nameKey: s.nameKey, descriptionKey: s.descriptionKey })
    }
    return map
  }, [])

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden border-2 border-white/10">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-indigo-400" size={24} />
            <h2 className="text-2xl font-black uppercase tracking-tight">{t('classes.title')}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider ${activeClass ? 'bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
              {activeClass ? t(activeClass.nameKey) : t('classes.novice')}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-indigo-200 text-[10px] font-black uppercase tracking-wider">
              Unlocked: {unlockedClasses.length} / {CLASS_DEFINITIONS.length}
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 Category Filter Navigation (เพิ่มใหม่) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
        <div className="flex-shrink-0 p-2 bg-slate-100 rounded-xl text-slate-500">
          <Filter size={16} />
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeFilter === cat
              ? 'bg-cyan-600 border-indigo-400 text-white shadow-lg shadow-indigo-100'
              : 'bg-white border-slate-100 text-slate-400'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Class List - แสดงตาม Filter */}
      <div className="grid grid-cols-1 gap-3">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => {
            const isUnlocked = unlockedClasses.includes(cls.id)
            const isActive = activeClass?.id === cls.id

            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className={`flex items-center justify-between p-4 rounded-[1.8rem] border-2 text-left transition-all active:scale-95 ${isActive ? 'bg-fuchsia-50 border-fuchsia-200 shadow-sm shadow-fuchsia-100' :
                  isUnlocked ? 'bg-white border-emerald-100' : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isActive ? 'bg-fuchsia-100 border-fuchsia-200 text-emerald-500' :
                    isUnlocked ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : 'bg-slate-200 border-slate-300 text-slate-500'
                    }`}>
                    {isUnlocked ? <CheckCircle2 size={24} /> : <Lock size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Class</div>
                      {/* @ts-ignore - แสดงป้าย Category เล็กๆ */}
                      {cls.category && <span className="text-[8px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold uppercase">{cls.category}</span>}
                    </div>
                    <div className="text-lg font-black text-slate-900 leading-tight">{t(cls.nameKey)}</div>
                  </div>
                </div>
                <ChevronRight className="text-slate-300" />
              </button>
            )
          })
        ) : (
          <div className="py-20 text-center space-y-2">
            <div className="text-slate-300 font-black uppercase tracking-widest">No Classes Found</div>
            <button onClick={() => setActiveFilter('all')} className="text-indigo-500 text-xs font-bold underline">Reset Filter</button>
          </div>
        )}
      </div>

      {/* Detail Modal (Popup) - Logic เดิมทั้งหมด */}
      {selectedClass && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedClass(null)} />

          <div className="relative bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] max-h-[92vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-10 duration-500 custom-scrollbar">

            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2 sm:hidden" />

            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t(selectedClass.nameKey)}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Specifications</span>
                    {/* @ts-ignore */}
                    {selectedClass.category && <span className="bg-indigo-50 text-indigo-600 text-[10px] px-2 py-0.5 rounded-lg font-black uppercase">{selectedClass.category}</span>}
                  </div>
                </div>
                <button onClick={() => setSelectedClass(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                  <X size={20} />
                </button>
              </div>

              {/* Skills Section */}
              {/* Skills Section - ปรับปรุงให้โชว์ Description */}
              <div className="space-y-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-indigo-500" /> Required Skills
                </div>
                <div className="grid grid-cols-1 gap-3"> {/* เพิ่ม Gap เล็กน้อย */}
                  {selectedClass.requiredSkills.map((skillId) => {
                    const info = skillMap.get(skillId)
                    const equipped = equippedSkills.some((s) => s.id === skillId)
                    return (
                      <div key={skillId} className={`p-4 rounded-2xl border transition-all ${equipped ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="min-w-0">
                            <div className="text-[12px] font-black text-slate-800 truncate">
                              {info?.nameKey ? t(info.nameKey) : skillId}
                            </div>
                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter truncate">
                              {skillId}
                            </div>
                          </div>
                          {equipped ? (
                            <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={18} />
                          ) : (
                            <Lock className="text-slate-300 flex-shrink-0" size={18} />
                          )}
                        </div>

                        {/* ส่วนที่เพิ่มเข้ามา: แสดงความสามารถสกิล */}
                        {info?.descriptionKey && (
                          <div className="mt-2 pt-2 border-t border-slate-200/50 text-[11px] font-medium text-slate-600 leading-relaxed italic">
                            {t(info.descriptionKey)}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Stats & Bonuses */}
              <div className="bg-indigo-50 rounded-[2rem] p-5 border border-indigo-100 shadow-inner">
                <div className="flex items-center gap-2 mb-4 text-indigo-600">
                  <TrendingUp size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Class Bonuses</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedClass.bonus).map(([key, value]) => (
                    <div key={key} className="bg-white p-3 rounded-2xl border border-indigo-50 text-center shadow-sm">
                      <div className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">{formatBonusName(key, t)}</div>
                      <div className={`text-lg font-black ${value > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{formatBonusValue(key, value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Effect */}
              {selectedClass.specialEffect && (
                <div className="bg-amber-50 rounded-[2rem] p-5 border border-amber-100">
                  <div className="flex items-center gap-2 mb-3 text-amber-600">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Special Ability</span>
                  </div>
                  <div className="text-sm font-black text-amber-900 mb-1">{t(selectedClass.specialEffect.nameKey, { lng: 'en' })}</div>
                  <div className="text-[12px] font-medium text-amber-800/80 leading-relaxed">{t(selectedClass.specialEffect.descriptionKey)}</div>
                </div>
              )}

              {/* Element Affinity */}
              {selectedClass.elementAffinity && (
                <div className="bg-cyan-50 rounded-[2rem] p-5 border border-cyan-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-cyan-600">
                    <Shield size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Affinities</span>
                  </div>
                  <div className="space-y-2">
                    {selectedClass.elementAffinity.advantageMultiplier && (
                      <div className="flex justify-between bg-white px-4 py-2.5 rounded-xl border border-cyan-100 items-center">
                        {/* บังคับหัวข้อเป็นภาษาอังกฤษ */}
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          {t('classes.elementAffinity')}
                        </span>
                        <span className="text-[12px] font-black text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-lg">
                          x{selectedClass.elementAffinity.advantageMultiplier.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* เพิ่มส่วน Disadvantage ถ้ามี (เหมือนโค้ดเดิมของคุณ) */}
                    {selectedClass.elementAffinity.disadvantageDamageTakenMultiplier && (
                      <div className="flex justify-between bg-white px-4 py-2.5 rounded-xl border border-emerald-100 items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          {t('classes.disadvantageReduction')}
                        </span>
                        <span className="text-[12px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                          x{selectedClass.elementAffinity.disadvantageDamageTakenMultiplier.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}