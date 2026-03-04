import { useState, useMemo } from 'react'
import type { GameMap } from '../types/game'
import type { MonsterData } from '../types/game'
import { useGameStore } from '../store/useGameStore'
import { useAchievementStore } from '../store/useAchievementStore'
import { useToastStore } from '../store/useToastStore'
import { ChevronLeft, Info } from 'lucide-react'
import { BattleLog } from '../logic/BattleLog'
import { MapSelection } from '../components/MapSelection'
import { MonsterCard } from '../components/MonsterCard'
import { BattleResultModal } from '../components/BattleResultModal'
import { AchievementToast } from '../components/Achievements/AchievementToast'
import { MONSTERS } from '../data/monsters'
import { ElementGuideModal } from '../components/ElementGuideModal';
import { ELEMENT_CHART } from '../logic/elementalLogic'

export function AdventurePage() {
    const [selectedMap, setSelectedMap] = useState<GameMap | null>(null)
    const [showElementGuide, setShowElementGuide] = useState(false) // 🚩 State สำหรับเปิด/ปิด Modal
    const { player, processBattle, battleLogs, resetBattle } = useGameStore()
    const { setActiveToast, activeToast } = useToastStore()
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleStartBattle = async (monster: MonsterData) => {
        if (processingId) return;

        setProcessingId(monster.id);
        resetBattle();

        try {
            // 2. หน่วงเวลา 1 วินาที (1000ms) ให้เท่ากับ CSS Animation ที่เราตั้งไว้
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 3. ประมวลผลการสู้ (เรียกแค่ครั้งเดียวพอครับ)
            processBattle(monster);

            // 4. ดึงข้อมูลล่าสุดหลังสู้เสร็จทันทีจาก Store เพื่อเช็ค Achievement
            const currentState = useGameStore.getState();
            const currentKills = currentState.monsterKills;
            const currentGold = currentState.player.gold;

            // 5. เช็คความสำเร็จ (Achievement)
            const newlyUnlocked = useAchievementStore.getState().checkAchievements(currentKills, currentGold);

            // 6. แสดง Toast ถ้าปลดล็อก Achievement ใหม่
            if (newlyUnlocked.length > 0) {
                const achievementStore = useAchievementStore.getState();
                const latestTitle = newlyUnlocked[0];
                const achievement = achievementStore.achievements.find(a => a.title === latestTitle);

                if (achievement) {
                    setActiveToast({
                        title: achievement.title,
                        desc: achievement.description
                    });
                }
            }

        } catch (error) {
            console.error("Battle failed:", error);
        } finally {
            // 7. ปิดสถานะการประมวลผล (หยุดสั่น/หยุดรอยดาบ)
            setProcessingId(null);
        }

    };

    const mapMonsters: MonsterData[] = useMemo(() => {
        if (!selectedMap) return []
        return selectedMap.monsters.map(mapMonster => {
            const freshData = MONSTERS.find(m => m.id === mapMonster.id)
            return freshData || mapMonster
        })
    }, [selectedMap])

    if (!selectedMap) {
        return <MapSelection playerLevel={player.level} onSelect={setSelectedMap} />
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            <BattleResultModal />

            {/* Achievement Toast */}
            {activeToast && (
                <AchievementToast
                    title={activeToast.title}
                    description={activeToast.desc}
                    onClose={() => setActiveToast(null)}
                />
            )}

            {/* แสดง Modal เมื่อ State เป็น true */}
            {showElementGuide && <ElementGuideModal onClose={() => setShowElementGuide(false)} elementChart={ELEMENT_CHART} />}

            <div className="flex items-center justify-between">
                <button
                    onClick={() => { setSelectedMap(null); resetBattle(); }}
                    className="group px-4 py-2 rounded-2xl bg-white border-2 border-slate-100 text-xs font-black text-slate-500 flex items-center gap-2 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    BACK TO WORLD MAP
                </button>

                {/* ปุ่มกดดู Guide แบบประหยัดพื้นที่ */}
                <button
                    onClick={() => setShowElementGuide(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-2xl border-2 border-amber-200 font-black text-[10px] hover:bg-amber-200 transition-all shadow-sm active:scale-95"
                >
                    <Info size={14} />
                    ELEMENT GUIDE
                </button>
            </div>

            {/* Map Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden border-4 border-white">
                {/* ... เนื้อหา Banner เหมือนเดิม ... */}
                <div className="absolute right-0 top-0 opacity-20 translate-x-1/4 -translate-y-1/4 rotate-12 text-[15rem] pointer-events-none select-none">
                    {selectedMap.bgEmoji}
                </div>
                <div className="relative z-10">
                    <div className="text-6xl mb-4">{selectedMap.bgEmoji}</div>
                    <h2 className="text-5xl font-black tracking-tighter mb-2">{selectedMap.name}</h2>
                    <p className="text-indigo-200/70 text-lg font-medium max-w-xl leading-relaxed italic italic">
                        "{selectedMap.description}"
                    </p>
                </div>
            </div>

            {/* Monsters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {mapMonsters.map((monster) => (
                    <MonsterCard
                        key={monster.id}
                        monster={monster}
                        onBattle={() => handleStartBattle(monster)}
                        isProcessing={processingId === monster.id}
                    />
                ))}
            </div>

            {battleLogs.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    <BattleLog logs={battleLogs} onReset={resetBattle} />
                </div>
            )}
        </div>
    )
}