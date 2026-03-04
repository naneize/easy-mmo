import type { ReactNode } from 'react'
import { useNavigationStore } from '../store/navigation'
import { GameNavigation } from './GameNavigation'
import { ChevronRight, LayoutGrid, RotateCcw } from 'lucide-react' // 🚩 เพิ่ม RotateCcw

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
      {/* Sidebar & Bottom Nav */}
      <GameNavigation />

      {/* Main Content Area */}
      <main className="transition-all duration-300 sm:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8">

          {/* --- Page Header Section --- */}
          <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
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

            {/* ส่วนขวาของ Header */}
            <div className="flex items-center gap-3">

              {/* --- START: DEBUG RESET BUTTON (ปุ่มสำหรับลบข้อมูลเพื่อทดสอบ) --- */}
              <button
                onClick={handleDebugReset}
                className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-2 text-[10px] font-black text-red-500 uppercase border border-red-100 hover:bg-red-100 transition-colors shadow-sm"
              >
                <RotateCcw size={12} />
                Reset Data
              </button>
              {/* --- END: DEBUG RESET BUTTON --- */}


              <div className="hidden sm:block">
                <div className="rounded-2xl bg-white px-4 py-2 shadow-sm border border-slate-100 text-[10px] font-bold text-slate-400 uppercase italic">
                  Easy Mode Enabled
                </div>
              </div>
            </div>
          </div>

          {/* --- Content Body --- */}
          <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-500">
            {props.children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Spacer */}
      <div className="h-[calc(5rem+env(safe-area-inset-bottom))] sm:hidden" />
    </div>
  )
}