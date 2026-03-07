import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { useNavigationStore } from '../store/navigation'
import { GameNavigation } from './GameNavigation'
import { RotateCcw } from 'lucide-react' // 🚩 เพิ่ม RotateCcw
import { useGameStore } from '../store/useGameStore'
import { useToastStore } from '../store/useToastStore'
import { AchievementToast } from '../components/Achievements/AchievementToast'
import { calculatePlayerClass } from '../utils/gameHelpers'

import { useTranslation } from 'react-i18next'


const tabTitle: Record<string, string> = {
  dashboard: 'Player Profile',
  adventure: 'World Adventure',
  skills: 'Passive Skills',
  classes: 'Classes & Unlocks',
  achievements: 'Hall of Fame', // 🚩 ปรับให้ตรงกับ Achievement
  market: 'Trading Market',
  inventory: 'Equipment & Items',
}

export function MainLayout(props: { children?: ReactNode }) {
  const activeTab = useNavigationStore((s) => s.activeTab)

  const player = useGameStore((s) => s.player)
  const purchaseItem = useGameStore((s) => s.purchaseItem)
  const unlockedClasses = useGameStore((s) => s.unlockedClasses)
  const markClassUnlocked = useGameStore((s) => s.markClassUnlocked)
  const equippedSkills = useGameStore((s) => s.equippedSkills)
  const { activeToast, setActiveToast } = useToastStore();

  const prevClassIdRef = useRef<string | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    const playerClass = calculatePlayerClass(equippedSkills);
    const nextId = playerClass?.id ?? null;
    const prevId = prevClassIdRef.current;
    prevClassIdRef.current = nextId;

    if (!nextId) return;
    if (unlockedClasses.includes(nextId)) return;

    markClassUnlocked(nextId);

    if (prevId !== nextId) {
      // ดึงชื่ออาชีพที่ผ่านการแปลมาแล้ว (ถ้ามี)
      const className = playerClass?.name ?? nextId;

      setActiveToast({
        title: t('achievementToast.classUnlocked.title', { className }),
        desc: t('achievementToast.classUnlocked.desc'),
        badgeText: t('achievementToast.classUnlocked.badge')
      });
    }
  }, [equippedSkills, markClassUnlocked, setActiveToast, unlockedClasses]);
  // --- START: DEBUG RESET FUNCTION (ลบส่วนนี้ออกได้เมื่อจบการพัฒนา) ---
  const handleDebugReset = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลเกมทั้งหมด (Gold, Level, Achievements) หรือไม่?')) {
      localStorage.clear(); // ล้างทุกอย่างใน LocalStorage
      window.location.reload(); // รีโหลดหน้าเพื่อเริ่มใหม่
    }
  }
  // --- END: DEBUG RESET FUNCTION ---

  return (
    /* พื้นหลังหลักโปร่งใส */
    <div className="min-h-dvh bg-transparent">
      <GameNavigation />

      {activeToast && (
        <AchievementToast
          title={activeToast.title}
          description={activeToast.desc}
          onClose={() => setActiveToast(null)}
          badgeText={activeToast.badgeText}
        />
      )}

      <main className="transition-all duration-300 sm:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8">

          {/* --- Page Header Section --- */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {/* 🚩 ปรับเงาให้พาดหัวดูคมชัดขึ้นบนพื้นหลัง Ocean */}
              <h1 className="text-2xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] tracking-tight sm:text-3xl">
                {tabTitle[activeTab] ?? activeTab}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">

              {/* 🧪 Medical Station: เปลี่ยนจากขาวใส เป็น ดำใส (bg-black/20) */}
              <div className="flex items-center gap-2 rounded-[2rem]">
                {[
                  { id: 'hp_potion_s', icon: '🧪', label: '+20% HP', price: 50 },
                  { id: 'hp_potion_m', icon: '⚗️', label: '+40% HP', price: 100 },
                  { id: 'hp_potion_l', icon: '🍶', label: '+75% HP', price: 200 },
                ].map((potion) => (
                  <button
                    key={potion.id}
                    onClick={() => purchaseItem(potion.id as any)}
                    disabled={player.gold < potion.price}
                    /* 🚩 ปรับปุ่มให้มืดลงนิดนึงและลดความสดของขอบ */
                    className="group flex flex-col items-center gap-0.5 rounded-2xl bg-white- px-3 py-1.5  hover:bg-cyan-400/40 transition-all active:scale-95 disabled:opacity-10"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-lg">{potion.icon}</span>
                      {/* 🚩 ใช้สี Teal ที่นุ่มขึ้น ไม่เรืองแสงจนเกินไป */}
                      <span className="text-[10px] font-black text-emerald-600">{potion.label}</span>
                    </div>
                    <span className="text-[10px] font-bold text-white/100 tracking-tighter">{potion.price} GOLD</span>
                  </button>
                ))}
              </div>

              {/* 💰 Gold: ปรับจากเหลืองสว่างจ้า เป็น ทองนวลๆ บนพื้นมืด */}
              <div className="flex h-12 items-center gap-2 rounded-2xl">
                <div className="h-2 w-2 rounded-full bg-yellow-500/80" />
                <span className="text-sm font-black text-yellow-300/90">
                  {player.gold.toLocaleString()}
                </span>
              </div>

              {/* 🚩 ปุ่ม Reset: ปรับให้มืดลง ไม่ดึงสายตา */}
              <button
                onClick={handleDebugReset}
                className="flex h-12 items-center justify-center rounded-2xl bg-black/20 px-4 text-[10px] font-black text-white/30 uppercase border border-white/5 hover:bg-red-950/40 hover:text-red-400 transition-all backdrop-blur-sm group"
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
