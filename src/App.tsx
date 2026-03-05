import { useEffect } from 'react' // เพิ่ม useEffect
import { MainLayout } from './components/MainLayout'
import { PassiveSkillPage } from './pages/PassiveSkillPage'
import { AdventurePage } from './pages/AdventurePage'
import { DashboardPage } from './pages/DashboardPage'
import { InventoryPage } from './pages/InventoryPage.tsx';
import { ClassesPage } from './pages/ClassesPage'
import { useNavigationStore } from './store/navigation'
import { useGameStore } from './store/useGameStore' // เพิ่มการดึง GameStore
import AchievementPage from './pages/AchievementPage.tsx'

function App() {
  const activeTab = useNavigationStore((s) => s.activeTab)

  // ดึงฟังก์ชัน regenHP มาจาก Store
  const regenHP = useGameStore((state) => state.regenHP)



  // 🚩 สร้าง Loop การฟื้นฟูเลือด
  useEffect(() => {
    // สั่งให้ทำงานทุกๆ 3 วินาที (สามารถปรับเลข 3000 เป็นเวลาที่ต้องการได้)
    const heartbeat = setInterval(() => {
      regenHP()
    }, 3000)

    // สำคัญ: ต้องล้าง Interval เมื่อ Component ถูกทำลาย
    return () => clearInterval(heartbeat)
  }, [regenHP])

  return (
    <MainLayout>
      {/* --- 1. หน้า Dashboard (หน้าหลัก) --- */}
      {activeTab === 'dashboard' && <DashboardPage />}

      {/* --- 2. หน้าเลือกสกิล Passive --- */}
      {activeTab === 'skills' && <PassiveSkillPage />}

      {/* --- 3. หน้าผจญภัยสู้กับมอนสเตอร์ --- */}
      {activeTab === 'adventure' && <AdventurePage />}

      {activeTab === 'classes' && <ClassesPage />}

      {activeTab === 'achievements' && <AchievementPage />}

      {activeTab === 'inventory' && <InventoryPage />}

    </MainLayout>
  )
}

export default App