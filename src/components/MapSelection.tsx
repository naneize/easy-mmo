import { Lock, Map as MapIcon, ChevronRight } from 'lucide-react'
import { WORLD_MAPS } from '../data/maps'
import { useGameStore } from '../store/useGameStore'
import { useTranslation } from 'react-i18next'
import type { GameMap } from '../types/game'

const ELEMENT_COLORS: Record<string, string> = {
    Fire: 'text-orange-500 bg-orange-50 border-orange-100',
    Water: 'text-blue-500 bg-blue-50 border-blue-100',
    Earth: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    Wind: 'text-sky-500 bg-sky-50 border-sky-100',
    Light: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    Dark: 'text-purple-600 bg-purple-50 border-purple-200',
    Neutral: 'text-slate-500 bg-slate-50 border-slate-100',
}

interface MapSelectionProps {
    playerLevel: number
    onSelect: (map: GameMap) => void
}

export function MapSelection({ playerLevel, onSelect }: MapSelectionProps) {
    const { t } = useTranslation()

    return (
        <div className="grid grid-cols-1 gap-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <MapIcon className="text-sky-500" size={32} /> World Map
                    </h2>
                    <p className="text-slate-400 font-medium ml-11">เลือกพื้นที่ที่ต้องการออกล่า</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {WORLD_MAPS
                    .sort((a, b) => a.minLevel - b.minLevel)
                    .map((map) => {
                        const isLocked = playerLevel < map.minLevel
                        const mapElements = Array.from(new Set(map.monsters.map(m => m.element)))

                        return (
                            <button
                                key={map.id}
                                disabled={isLocked}
                                onClick={() => onSelect(map)}
                                className={`group relative overflow-hidden rounded-[3rem] p-7 text-left transition-all border-4 
                                    ${isLocked
                                        ? 'bg-slate-50 border-slate-100 opacity-70 cursor-not-allowed'
                                        : 'bg-white border-white hover:border-indigo-400 shadow-sm hover:shadow-2xl hover:-translate-y-1'}`}
                            >
                                <div className="flex justify-between items-center relative z-10">
                                    <div className="flex gap-5 items-center">
                                        <div className={`text-6xl transition-transform duration-500 ${isLocked ? 'grayscale' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
                                            {map.bgEmoji}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800 text-2xl leading-tight">{t(map.nameKey)}</h3>
                                            <p className="text-sm text-slate-500 mt-1 max-w-[220px] line-clamp-1 italic">"{t(map.descriptionKey)}"</p>

                                            {!isLocked && (
                                                <div className="mt-4 flex flex-wrap gap-1.5 items-center">
                                                    {mapElements.map(el => (
                                                        <div key={el} className={`w-6 h-6 rounded-lg border flex items-center justify-center text-[10px] font-bold shadow-sm ${ELEMENT_COLORS[el]}`}>
                                                            {el[0]}
                                                        </div>
                                                    ))}
                                                    <span className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-tighter">Element Area</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {isLocked ? (
                                        <div className="flex flex-col items-center bg-slate-200/50 p-4 rounded-3xl border border-slate-200 min-w-[70px]">
                                            <Lock size={20} className="text-slate-400" />
                                            <span className="text-[10px] font-black mt-1 text-slate-500 uppercase tracking-tighter">Lv. {map.minLevel}</span>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 p-4 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                                            <ChevronRight size={24} />
                                        </div>
                                    )}
                                </div>
                            </button>
                        )
                    })}
            </div>
        </div>
    )
}