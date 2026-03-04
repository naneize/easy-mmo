import { useEffect, useRef, useMemo } from 'react'
import {
    History, Trash2, Shield, Zap, Sparkles,
    Sword, Trophy, Skull, ArrowUpCircle, Flame, HeartPulse, Activity,
    Wind, RotateCcw
} from 'lucide-react'
import type { BattleLogEntry } from '../types/game'

interface BattleLogProps {
    logs: BattleLogEntry[]
    onReset: () => void
}

export function BattleLog({ logs, onReset }: BattleLogProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    // สไตล์คงที่ ย้ายออกมาข้างนอกเพื่อ Performance
    const logStyles: Record<string, string> = useMemo(() => ({
        win: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 font-bold shadow-lg shadow-emerald-500/10 py-3 scale-100',
        lose: 'bg-rose-500/10 text-rose-400 border-rose-500/30 opacity-80',
        levelup: 'bg-amber-500/15 text-amber-300 border-amber-500/50 font-black scale-100 shadow-2xl shadow-amber-500/20 py-3 my-4 ring-2 ring-amber-500/20',
        synergy: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 italic py-2',
        elemental: 'bg-orange-500/10 text-orange-400 border-orange-500/20 font-medium py-2',
        skill: 'bg-sky-500/10 text-sky-300 border-sky-500/20 shadow-inner py-2',
        turn: 'bg-slate-900/60 text-slate-500 border-slate-800/40 my-8 py-2 opacity-100 text-center justify-center border-dashed border-x-0 border-b-0',
        start: 'bg-white/5 text-slate-400 border-slate-700/50 uppercase tracking-[0.2em] py-2 text-[10px]',
        regen: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 py-2',
        attack: 'bg-white/5 text-slate-300 border-transparent hover:bg-white/10 py-2 opacity-90',
        critical: 'bg-gradient-to-r from-amber-600/30 to-orange-600/30 text-orange-200 border-orange-500/60 font-black shadow-[0_0_20px_rgba(249,115,22,0.3)] ring-1 ring-orange-400/30 py-4 scale-[1.01]',
        lifesteal: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 italic shadow-sm py-2',
        double: 'bg-cyan-500/25 text-cyan-200 border-cyan-400/60 font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] animate-pulse-slow py-4',
        dodge: 'bg-sky-400/10 text-sky-300 border-sky-400/30 font-medium italic py-2',
        counter: 'bg-cyan-500/25 text-cyan-200 border-cyan-400/60 font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] py-4',
    }), [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])

    if (logs.length === 0) return null

    return (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="mb-6 flex items-end justify-between px-2">
                <div>
                    <h3 className="flex items-center gap-2 text-xl font-black text-slate-800 uppercase tracking-tighter">
                        <History size={24} className="text-indigo-500" />
                        Battle Records
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold ml-8 uppercase tracking-widest">
                        Combat Session Log #{logs.length}
                    </p>
                </div>
                <button
                    onClick={onReset}
                    className="group flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-all uppercase tracking-widest bg-slate-100 py-2 px-4 rounded-full hover:bg-rose-50"
                >
                    <Trash2 size={12} className="group-hover:rotate-12 transition-transform" />
                    Reset Buffer
                </button>
            </div>

            {/* Log Box Container */}
            <div className="relative rounded-[3.5rem] bg-slate-950 p-6 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] border-[10px] border-slate-900 overflow-hidden">
                {/* Decorative Ambient Light */}
                <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />

                <div
                    ref={scrollRef}
                    className="relative space-y-1.5 h-[500px] overflow-y-auto pr-2 custom-scrollbar scroll-smooth p-2"
                >
                    {logs.map((log, i) => {
                        const isSpecial = ['win', 'levelup', 'critical', 'double', 'counter'].includes(log.type);

                        return (
                            <div
                                key={i}
                                className={`flex items-start gap-4 px-5 rounded-[1.2rem] border transition-all duration-500 log-entry-appear relative overflow-hidden
                                    ${isSpecial ? 'z-10' : 'z-0'}
                                    ${logStyles[log.type] || 'bg-white/5 text-slate-400 border-transparent'}
                                `}
                            >
                                {/* Icon Engine */}
                                <div className={`mt-1.5 shrink-0 p-1 rounded-lg ${isSpecial ? 'bg-white/10' : ''}`}>
                                    {log.type === 'win' && <Trophy size={18} className="text-emerald-400 drop-shadow-[0_0_8px_#10b981]" />}
                                    {log.type === 'lose' && <Skull size={18} className="text-rose-400" />}
                                    {log.type === 'levelup' && <ArrowUpCircle size={22} className="text-amber-400 animate-bounce" />}
                                    {log.type === 'synergy' && <Sparkles size={16} className="text-indigo-400 animate-pulse" />}
                                    {log.type === 'elemental' && <Flame size={16} className="text-orange-400" />}
                                    {log.type === 'skill' && <Zap size={16} className="text-sky-400" />}
                                    {log.type === 'regen' && <HeartPulse size={16} className="text-emerald-400" />}
                                    {log.type === 'turn' && <Activity size={14} className="text-slate-600" />}
                                    {log.type === 'start' && <Sword size={16} className="text-slate-500" />}
                                    {log.type === 'critical' && <Zap size={18} className="text-orange-400 animate-pulse fill-orange-400 drop-shadow-[0_0_8px_#f97316]" />}
                                    {log.type === 'lifesteal' && <HeartPulse size={16} className="text-fuchsia-400" />}
                                    {log.type === 'double' && <Zap size={18} className="text-cyan-400 animate-pulse fill-cyan-400 drop-shadow-[0_0_8px_#22d3ee]" />}
                                    {log.type === 'dodge' && <Wind size={18} className="text-sky-300" />}
                                    {log.type === 'counter' && <RotateCcw size={18} className="text-cyan-400 animate-pulse drop-shadow-[0_0_8px_#22d3ee]" />}

                                    {/* Custom/Default Icon */}
                                    {!logStyles[log.type] && (
                                        log.icon ? <span className="text-sm">{log.icon}</span> : <Sword size={14} className="opacity-20" />
                                    )}
                                </div>

                                {/* Text Content */}
                                <div className="flex-1 py-1">
                                    <p className={`leading-relaxed tracking-wide ${log.type === 'levelup' ? 'text-base font-black' :
                                        log.type === 'turn' ? 'text-[11px] font-black tracking-[0.3em] opacity-40' :
                                            isSpecial ? 'text-[15px]' : 'text-sm'
                                        }`}>
                                        {log.text}
                                    </p>
                                </div>

                                {/* Row ID (Invisible/Subtle) */}
                                {log.type !== 'turn' && (
                                    <span className="text-[9px] font-mono opacity-5 self-center select-none">
                                        {String(i + 1).padStart(4, '0')}
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>


        </div>
    )
}