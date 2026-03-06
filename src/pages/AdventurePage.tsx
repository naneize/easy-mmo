import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next';
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
import { MONSTERS } from '../data/monsters'
import { ElementGuideModal } from '../components/ElementGuideModal';
import { ELEMENT_CHART } from '../logic/elementalLogic'
import { calculatePlayerClass } from '../utils/gameHelpers'


export function AdventurePage() {

    const { t } = useTranslation();
    const [selectedMap, setSelectedMap] = useState<GameMap | null>(null)
    const [showElementGuide, setShowElementGuide] = useState(false) // State สำหรับเปิด/ปิด Modal
    const { player, processBattle, battleLogs, resetBattle, getEquippedSkillsWithIcons } = useGameStore()

    const { setActiveToast } = useToastStore()
    const [processingId, setProcessingId] = useState<string | null>(null);


    const equippedSkills = getEquippedSkillsWithIcons();
    const playerClass = calculatePlayerClass(equippedSkills);

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
                const latestTitleKey = newlyUnlocked[0];
                const achievement = achievementStore.achievements.find(a => a.titleKey === latestTitleKey);

                if (achievement) {
                    setActiveToast({
                        title: t(achievement.titleKey),
                        desc: t(achievement.descriptionKey),
                        badgeText: 'Achievement Unlocked'
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

            {/* แสดง Modal เมื่อ State เป็น true */}
            {showElementGuide && <ElementGuideModal onClose={() => setShowElementGuide(false)} elementChart={ELEMENT_CHART} />}

            <div className="flex items-center justify-between">
                <button
                    onClick={() => { setSelectedMap(null); resetBattle(); }}
                    className="group px-4 py-2 rounded-2xl bg-white border-2 border-slate-100 text-xs font-black text-slate-500 flex items-center gap-2 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    {t('ui.back')}
                </button>

                <div className={`px-3 py-2 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest shadow-sm ${playerClass ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {t('ui.currentClass')}: {playerClass ? playerClass.name : t('ui.novice')}
                </div>

                {/* ปุ่มกดดู Guide แบบประหยัดพื้นที่ */}
                <button
                    onClick={() => setShowElementGuide(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-400 rounded-2xl border-2 border-amber-200 font-black text-[10px] hover:bg-amber-200 transition-all shadow-sm active:scale-95"
                >
                    <Info size={14} />
                    {t('ui.elementGuide')}
                </button>
            </div>

            {/* Map Banner */}
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm border border-white/20">
                    {selectedMap.bgEmoji}
                </div>
                <div>
                    <h2 className="text-3xl text-white font-black">{t(selectedMap.nameKey)}</h2>
                    <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed italic">
                        {t(selectedMap.descriptionKey)}
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