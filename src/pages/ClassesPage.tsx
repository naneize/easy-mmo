import { useMemo } from 'react'
import { Users, CheckCircle2, Lock, TrendingUp, Sparkles, Shield } from 'lucide-react'
import { CLASS_DEFINITIONS } from '../data/classes'
import { INITIAL_SKILLS } from '../store/skills'
import { useGameStore } from '../store/useGameStore'
import { calculatePlayerClass } from '../utils/gameHelpers'

function formatBonusValue(key: string, value: number): string {
  if (key.endsWith('_percent')) {
    return `${(value * 100).toFixed(0)}%`
  }
  if (key.endsWith('_flat')) {
    return `+${value}`
  }
  return `${value}`
}

function formatBonusName(key: string): string {
  const map: Record<string, string> = {
    atk_flat: 'ATK',
    atk_percent: 'ATK%',
    def_flat: 'DEF',
    def_percent: 'DEF%',
    hp_mod: 'HP',
    hp_percent: 'HP%',
    lifesteal_percent: 'Lifesteal',
    crit_chance: 'Crit Chance',
    crit_multi: 'Crit DMG',
    armor_pen: 'Armor Pen',
    dmgReduction: 'DMG Reduction',
  }
  return map[key] || key
}

export function ClassesPage() {
  const { getEquippedSkillsWithIcons, unlockedClasses } = useGameStore()

  const equippedSkills = getEquippedSkillsWithIcons()
  const activeClass = calculatePlayerClass(equippedSkills)

  const skillMap = useMemo(() => {
    const map = new Map<string, { name: string; description: string }>()
    for (const s of INITIAL_SKILLS) {
      map.set(s.id, { name: s.name, description: s.description })
    }
    return map
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 rounded-[3.5rem] p-8 text-white shadow-2xl relative overflow-hidden border-4 border-white">
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-150">
          <Users size={200} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-xl">
              <Users className="text-indigo-200" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight">Classes</h2>
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-[0.2em] opacity-80">
                สวมใส่สกิลให้ครบ 4 ช่องตามเซต เพื่อปลดล็อคอาชีพ
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className={`px-3 py-2 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest shadow-sm ${activeClass ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
              Current Class: {activeClass ? activeClass.name : 'Novice'}
            </div>
            <div className="px-3 py-2 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest shadow-sm bg-white/10 border-white/20 text-indigo-100">
              Unlocked: {unlockedClasses.length} / {CLASS_DEFINITIONS.length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CLASS_DEFINITIONS.map((cls) => {
          const isUnlocked = unlockedClasses.includes(cls.id)
          const isActive = activeClass?.id === cls.id

          return (
            <div
              key={cls.id}
              className={`rounded-[2.5rem] border-2 p-6 shadow-sm bg-white transition-all ${isActive ? 'border-fuchsia-300 shadow-fuchsia-100' : isUnlocked ? 'border-emerald-200 shadow-emerald-100' : 'border-slate-100'}`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Class</div>
                  <div className="text-xl font-black text-slate-900 tracking-tight">{cls.name}</div>
                  <div className="mt-2 flex items-center gap-2">
                    {isUnlocked ? (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 size={14} />
                        Unlocked
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                        <Lock size={14} />
                        Locked
                      </div>
                    )}

                    {isActive && (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                        Active
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Unlock</div>
                  <div className="text-[10px] font-bold text-slate-500">ใส่สกิลครบ 4 ชิ้น</div>
                </div>
              </div>

              <div className="rounded-[2rem] bg-slate-50 border border-slate-100 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Required Skills</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cls.requiredSkills.map((skillId) => {
                    const info = skillMap.get(skillId)
                    const equipped = equippedSkills.some((s) => s.id === skillId)
                    return (
                      <div
                        key={skillId}
                        className={`rounded-2xl border px-3 py-2 transition-all ${equipped ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-[11px] font-black text-slate-800">{info?.name ?? skillId}</div>
                            <div className="truncate text-[9px] font-bold text-slate-400 uppercase tracking-wider">{skillId}</div>
                          </div>
                          {equipped ? (
                            <CheckCircle2 className="text-emerald-600" size={18} />
                          ) : (
                            <Lock className="text-slate-400" size={18} />
                          )}
                        </div>
                        {info?.description && (
                          <div className="mt-2 text-[10px] font-bold text-slate-500 leading-snug">
                            {info.description}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Class Bonuses */}
              <div className="rounded-[2rem] bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="text-indigo-600" size={16} />
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Class Bonuses</div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(cls.bonus).map(([key, value]) => (
                    <div
                      key={key}
                      className={`rounded-2xl border px-3 py-2 text-center ${value > 0
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider">
                        {formatBonusName(key)}
                      </div>
                      <div className="text-lg font-black">
                        {formatBonusValue(key, value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Effect */}
              {cls.specialEffect && (
                <div className="rounded-[2rem] bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-4 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="text-amber-600" size={16} />
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Special Effect</div>
                  </div>
                  <div className="bg-white rounded-2xl border border-amber-100 p-3">
                    <div className="text-[11px] font-black text-amber-800 uppercase tracking-wider">{cls.specialEffect.name}</div>
                    <div className="mt-1 text-[12px] font-bold text-slate-700 leading-snug">{cls.specialEffect.description}</div>
                  </div>
                </div>
              )}

              {/* Element Affinity */}
              {cls.elementAffinity && (
                <div className="rounded-[2rem] bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 p-4 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="text-cyan-600" size={16} />
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600">Element Affinity</div>
                  </div>
                  <div className="space-y-2">
                    {typeof cls.elementAffinity.advantageMultiplier === 'number' && (
                      <div className="bg-indigo-50 rounded-2xl border border-indigo-100 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="text-[11px] font-black text-indigo-800 uppercase tracking-wider">โบนัสเมื่อชนะทาง</div>
                          <div className="text-[12px] font-black text-indigo-800">x{cls.elementAffinity.advantageMultiplier.toFixed(2)}</div>
                        </div>
                      </div>
                    )}
                    {typeof cls.elementAffinity.disadvantageDamageTakenMultiplier === 'number' && (
                      <div className="bg-emerald-50 rounded-2xl border border-emerald-100 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="text-[11px] font-black text-emerald-800 uppercase tracking-wider">ลดความเสียหายเมื่อแพ้ทาง</div>
                          <div className="text-[12px] font-black text-emerald-800">x{cls.elementAffinity.disadvantageDamageTakenMultiplier.toFixed(2)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
