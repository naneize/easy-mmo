import type { ReactNode } from 'react'
import { useNavigationStore } from '../store/navigation'
import { GameNavigation } from './GameNavigation'
import { ChevronRight, Heart, LayoutGrid, RotateCcw } from 'lucide-react' // 🚩 เพิ่ม RotateCcw
import { useGameStore } from '../store/useGameStore'


const tabTitle: Record<string, string> = {
  dashboard: 'Home Dashboard',
  adventure: 'World Adventure',
  skills: 'Passive Skills',
  achievements: 'Hall of Fame', // 🚩 ปรับให้ตรงกับ Achievement
  market: 'Trading Market',
  inventory: 'Equipment & Items',
}

export function MainLayout(props: { children?: ReactNode }) {
  const activeTab = useNavigationStore((s) => s.activeTab)

  const { player, purchaseItem } = useGameStore();
  // --- START: DEBUG RESET FUNCTION (ลบส่วนนี้ออกได้เมื่อจบการพัฒนา) ---
  const handleDebugReset = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลเกมทั้งหมด (Gold, Level, Achievements) หรือไม่?')) {
      localStorage.clear(); // ล้างทุกอย่างใน LocalStorage
      window.location.reload(); // รีโหลดหน้าเพื่อเริ่มใหม่
    }
  }
  // --- END: DEBUG RESET FUNCTION ---

  return (
    <div className="min-h-dvh bg-slate-50/50">
      <GameNavigation />

      <main className="transition-all duration-300 sm:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8">

          {/* --- Page Header Section --- */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <LayoutGrid size={12} />
                <span>Fantasy Engine v1.0</span>
                <ChevronRight size={10} />
                <span className="text-sky-500">{activeTab}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
                {tabTitle[activeTab] ?? activeTab}
              </h1>
            </div>

            {/* ส่วนขวาของ Header: แถบเครื่องมือด่วน */}
            <div className="flex flex-wrap items-center gap-2">

              {/* 🧪 Quick Medical Station: ยาสามระดับ (แสดงราคาและเลือดทันที) */}
              <div className="flex items-center gap-2 rounded-[2rem] bg-white/80 p-1.5 border-2 border-slate-100 shadow-sm backdrop-blur-sm">

                {/* ยา S: +50 HP */}
                <button
                  onClick={() => purchaseItem('hp_potion_s')}
                  disabled={player.gold < 20}
                  className="group flex flex-col items-center gap-0.5 rounded-2xl bg-slate-50 px-3 py-1.5 border border-slate-100 hover:border-rose-300 hover:bg-rose-50 transition-all active:scale-90 disabled:opacity-40"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-lg">🧪</span>
                    <span className="text-[10px] font-black text-emerald-500">+50 HP</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 tracking-tighter">20 GOLD</span>
                </button>

                {/* ยา M: +150 HP */}
                <button
                  onClick={() => purchaseItem('hp_potion_m')}
                  disabled={player.gold < 50}
                  className="group flex flex-col items-center gap-0.5 rounded-2xl bg-slate-50 px-3 py-1.5 border border-slate-100 hover:border-rose-300 hover:bg-rose-50 transition-all active:scale-90 disabled:opacity-40"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-lg">⚗️</span>
                    <span className="text-[10px] font-black text-emerald-500">+150 HP</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 tracking-tighter">50 GOLD</span>
                </button>

                {/* ยา L: +500 HP */}
                <button
                  onClick={() => purchaseItem('hp_potion_l')}
                  disabled={player.gold < 150}
                  className="group flex flex-col items-center gap-0.5 rounded-2xl bg-slate-50 px-3 py-1.5 border border-slate-100 hover:border-rose-300 hover:bg-rose-50 transition-all active:scale-90 disabled:opacity-40"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-lg">🍶</span>
                    <span className="text-[10px] font-black text-emerald-500">+500 HP</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 tracking-tighter">150 GOLD</span>
                </button>

              </div>

              {/* 💰 แสดง Gold ปัจจุบัน */}
              <div className="flex h-12 items-center gap-2 rounded-2xl bg-amber-50 px-4 border border-amber-200 shadow-inner">
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-sm font-black text-amber-700">
                  {player.gold.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleDebugReset}
                className="flex h-12 items-center justify-center rounded-2xl bg-white px-4 text-[10px] font-black text-slate-400 uppercase border border-slate-100 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm group"
              >
                <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-500">
            {props.children}
          </div>
        </div>
      </main>
      <div className="h-[calc(5rem+env(safe-area-inset-bottom))] sm:hidden" />
    </div>
  )
}