import React from 'react'
// เปลี่ยน Backpack เป็น Trophy
import { Home, Package, Sparkles, Store, Sword, Trophy } from 'lucide-react'
import { useNavigationStore, type GameTabId } from '../store/navigation'
import { useGameStore } from '../store/useGameStore'

type TabConfig = {
  id: GameTabId
  label: string
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const tabs: TabConfig[] = [
  { id: 'dashboard', label: 'Home', Icon: Home },
  { id: 'inventory', label: 'Inventory', Icon: Package },
  { id: 'skills', label: 'Skills', Icon: Sparkles },
  { id: 'adventure', label: 'Adventure', Icon: Sword },
  { id: 'achievements', label: 'Achievements', Icon: Trophy },
  { id: 'market', label: 'Market', Icon: Store },

]

export function GameNavigation() {
  const activeTab = useNavigationStore((s) => s.activeTab)
  const setActiveTab = useNavigationStore((s) => s.setActiveTab)
  const player = useGameStore((s) => s.player)

  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white sm:flex">
        <div className="flex h-16 items-center gap-2 px-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-100">
            <Sword className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-slate-900 italic tracking-tight">FANTASY MMO</div>
            <div className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">Easy Mode</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3">
          <div className="grid gap-1">
            {tabs.map(({ id, label, Icon }) => {
              const isActive = id === activeTab
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={
                    'group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition-all ' +
                    (isActive
                      ? 'bg-sky-50 text-sky-600'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900')
                  }
                >
                  <span
                    className={
                      'grid h-10 w-10 place-items-center rounded-xl border-2 transition-all ' +
                      (isActive
                        ? 'border-sky-200 bg-white text-sky-600 shadow-sm'
                        : 'border-slate-100 bg-white group-hover:border-slate-200 shadow-none')
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">{label}</span>
                  {isActive && <div className="h-5 w-1 rounded-full bg-sky-500 animate-pulse" />}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Status Section */}
        <div className="px-4 pb-6">
          <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-slate-50/50 p-3 shadow-sm">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-md" />
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white ring-2 ring-white">
                {player.level}
              </div>
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-black text-slate-800 uppercase tracking-tight">Adventurer</div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-16 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-500"
                    style={{ width: `${(player.exp / 100) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">EXP</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)] sm:hidden">
        <nav className="flex h-16 overflow-x-auto no-scrollbar scroll-smooth px-2">
          {tabs.map(({ id, label, Icon }) => {
            const isActive = id === activeTab
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                // ใช้ flex-none และกำหนดความกว้างขั้นต่ำ เพื่อให้ปัดได้
                className={
                  'relative flex flex-none w-[72px] flex-col items-center justify-center gap-1 transition ' +
                  (isActive ? 'text-sky-600' : 'text-slate-400')
                }
              >
                {isActive && (
                  <span className="absolute top-0 h-1 w-8 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                )}
                <Icon className={`h-6 w-6 transition-transform ${isActive ? 'scale-110' : 'scale-100'}`} />
                <span className="text-[9px] font-black uppercase tracking-tight leading-none">{label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </>
  )
}