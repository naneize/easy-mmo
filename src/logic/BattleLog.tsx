import { useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
    History, Trash2, Zap, Sparkles,
    Sword, Trophy, Skull, ArrowUpCircle, Flame, HeartPulse, Activity,
    Wind, RotateCcw, Droplets, Mountain, Sun, Moon, Shield
} from 'lucide-react'
import type { BattleLogEntry } from '../types/game'


interface BattleLogProps {
    logs: BattleLogEntry[]
    onReset: () => void
}

export function BattleLog({ logs, onReset }: BattleLogProps) {
    const { t } = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null)



    // สไตล์คงที่ ย้ายออกมาข้างนอกเพื่อ Performance
    const logStyles: Record<string, string> = useMemo(() => ({
        win: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 font-bold shadow-lg shadow-emerald-500/10 py-2 scale-100',
        lose: 'bg-rose-500/10 text-rose-400 border-rose-500/30 opacity-80',
        levelup: 'bg-amber-500/15 text-amber-300 border-amber-500/50 font-black scale-100 shadow-2xl shadow-amber-500/20 py-2 my-3 ring-2 ring-amber-500/20',
        synergy: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 py-1.5',
        elemental: 'bg-orange-500/10 text-orange-400 border-orange-500/20 font-medium py-1.5',
        skill: 'bg-sky-500/10 text-sky-300 border-sky-500/20 shadow-inner py-1.5',
        turn: 'bg-slate-900/60 text-slate-500 border-slate-800/40 my-6 py-1.5 opacity-100 text-center justify-center border-dashed border-x-0 border-b-0',
        start: 'bg-white/5 text-slate-400 border-slate-700/50 uppercase tracking-[0.1em] py-1.5 text-[16px]',
        regen: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 py-1.5',
        attack: 'bg-white/5 text-slate-300 border-transparent hover:bg-white/10 py-1.5 opacity-90',
        critical: 'bg-gradient-to-r from-amber-600/30 to-orange-600/30 text-orange-200 border-orange-500/60 font-black shadow-[0_0_20px_rgba(249,115,22,0.3)] ring-1 ring-orange-400/30 py-3 scale-[1.01]',
        lifesteal: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 shadow-sm py-1.5',
        double: 'bg-cyan-500/25 text-cyan-200 border-cyan-400/60 font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] animate-pulse-slow py-3',
        dodge: 'bg-sky-400/10 text-sky-300 border-sky-400/30 font-medium py-1.5',
        counter: 'bg-cyan-500/25 text-cyan-200 border-cyan-400/60 font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] py-3',
        boss_skill: 'bg-rose-950/40 text-rose-200 border-rose-500/50 font-black shadow-[0_0_15px_rgba(225,29,72,0.2)] py-2 my-1 ring-1 ring-rose-500/20',
        boss_passive: 'bg-purple-900/30 text-purple-200 border-purple-500/40 py-1.5 shadow-inner opacity-100',
        reflect: 'bg-orange-500/20 text-orange-300 border-orange-500/40 py-1.5 font-bold',
        constant: 'bg-blue-500/10 text-blue-300 border-blue-500/20 shadow-inner py-1.5 opacity-100',

    }), [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])

    if (logs.length === 0) return null

    const totalTurns = logs.filter(l => l.type === 'turn').length;

    return (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="mb-4 flex items-end justify-between px-2">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 uppercase tracking-tighter">
                        <History size={20} className="text-indigo-500" />
                        {t('battleLog.battleRecords')}
                    </h3>
                    <div className="flex items-center gap-2 ml-6 mt-1">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                            {t('battleLog.combatSession', { count: logs.length })}
                        </p>
                        {/* ✨ เพิ่ม Badge แสดงจำนวน Turn */}
                        <div className="flex items-center gap-1 rounded-md bg-indigo-50 px-1.5 py-0.5 border border-indigo-100">
                            <span className="text-[9px] font-black text-indigo-500 uppercase">
                                {t('battleLog.totalTurns', { count: totalTurns })}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onReset}
                    className="group flex items-center gap-1.5 text-[9px] font-bold text-slate-400 hover:text-rose-500 transition-all uppercase tracking-widest bg-slate-100 py-1.5 px-3 rounded-full hover:bg-rose-50"
                >
                    <Trash2 size={10} className="group-hover:rotate-12 transition-transform" />
                    {t('battleLog.resetBuffer')}
                </button>
            </div>

            {/* Log Box Container */}
            <div className="relative rounded-4xl bg-slate-950 p-4 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] border-8 border-slate-900 overflow-hidden">
                {/* Decorative Ambient Light */}
                <div className="absolute -right-16 -top-16 h-60 w-60 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 h-60 w-60 rounded-full bg-emerald-600/10 blur-[100px] pointer-events-none" />

                <div
                    ref={scrollRef}
                    className="relative space-y-1 h-100 overflow-y-auto pr-1.5 custom-scrollbar scroll-smooth p-1.5"
                >
                    {logs.map((log, i) => {
                        const isSpecial = ['win', 'levelup', 'critical', 'double', 'counter'].includes(log.type);

                        // ✅ 1. ถ้าเป็นประเภท turn ให้คืนค่า Layout แบบ Banner เต็มความกว้าง
                        if (log.type === 'turn') {
                            return (
                                <div key={i} className="flex items-center gap-3 py-4 w-full animate-in fade-in zoom-in duration-500">
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-700/50 to-slate-700/50" />
                                    <div className="flex items-center gap-1.5 rounded-full bg-slate-800/80 px-3 py-1 border border-slate-700 shadow-xl backdrop-blur-sm">
                                        <Activity size={12} className="text-indigo-400 animate-pulse" />
                                        <span className="text-[9px] font-black text-slate-200 uppercase tracking-[0.2em]">
                                            {log.text}
                                        </span>
                                    </div>
                                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-slate-700/50 to-slate-700/50" />
                                </div>
                            );
                        }
                        return (
                            <div
                                key={i}
                                className={`flex items-start gap-3 px-3 rounded-[0.8rem] border transition-all duration-500 log-entry-appear relative overflow-hidden
                                    ${isSpecial ? 'z-10' : 'z-0'}
                                    ${logStyles[log.type] || 'bg-white/5 text-slate-400 border-transparent'}
                                `}
                            >
                                {/* Icon Engine */}
                                <div className={`mt-1 shrink-0 p-0.5 rounded-lg ${isSpecial ? 'bg-white/10' : ''}`}>
                                    {log.type === 'win' && <Trophy size={16} className="text-emerald-400 drop-shadow-[0_0_8px_#10b981]" />}
                                    {log.type === 'lose' && <Skull size={16} className="text-rose-400" />}
                                    {log.type === 'levelup' && <ArrowUpCircle size={18} className="text-amber-400 animate-bounce" />}
                                    {log.type === 'synergy' && <Sparkles size={14} className="text-indigo-400 animate-pulse" />}

                                    {log.type === 'elemental' && (() => {
                                        const size = 10;

                                        // ฟังก์ชันช่วยสร้าง Icon ตามชื่อธาตุ (Helper)
                                        const renderIcon = (elemName: string | undefined, iconSize: number) => {
                                            switch (elemName) {
                                                case 'Fire': return <Flame size={iconSize} className="text-orange-500" />;
                                                case 'Water': return <Droplets size={iconSize} className="text-blue-500" />;
                                                case 'Earth': return <Mountain size={iconSize} className="text-emerald-500" />;
                                                case 'Wind': return <Wind size={iconSize} className="text-sky-400" />;
                                                case 'Light': return <Sun size={iconSize} className="text-yellow-400" />;
                                                case 'Dark': return <Moon size={iconSize} className="text-purple-500" />;
                                                default: return <Shield size={iconSize} className="text-slate-400" />;
                                            }
                                        };

                                        return (
                                            <div className="flex items-center gap-1.5 py-0.5 px-1.5 bg-slate-900/40 rounded-lg border border-white/5">
                                                {/* แสดงไอคอนฝั่งผู้เล่น */}
                                                {renderIcon(log.playerElem, size)}

                                                {/* ตัวคั่นสวยๆ */}
                                                <span className="text-[8px] font-black text-slate-600 tracking-tighter">VS</span>

                                                {/* แสดงไอคอนฝั่งมอนสเตอร์ */}
                                                {renderIcon(log.monsterElem, size)}
                                            </div>
                                        );
                                    })()}

                                    {log.type === 'skill' && <Zap size={14} className="text-sky-400" />}
                                    {log.type === 'constant' && <Sparkles size={14} className="text-blue-400 animate-pulse" />}
                                    {log.type === 'start' && <Sword size={14} className="text-slate-500" />}
                                    {log.type === 'critical' && <Zap size={16} className="text-orange-400 animate-pulse fill-orange-400 drop-shadow-[0_0_8px_#f97316]" />}
                                    {log.type === 'lifesteal' && <HeartPulse size={14} className="text-fuchsia-400" />}
                                    {log.type === 'double' && <Zap size={16} className="text-cyan-400 animate-pulse fill-cyan-400 drop-shadow-[0_0_8px_#22d3ee]" />}
                                    {log.type === 'dodge' && <Wind size={16} className="text-sky-300" />}
                                    {log.type === 'counter' && <RotateCcw size={16} className="text-cyan-400 animate-pulse drop-shadow-[0_0_8px_#22d3ee]" />}
                                    {log.type === 'boss_skill' && <Skull size={18} className="text-rose-500 animate-pulse drop-shadow-[0_0_8px_#e11d48]" />}
                                    {log.type === 'boss_passive' && <Activity size={16} className="text-purple-400" />}
                                    {log.type === 'reflect' && <RotateCcw size={16} className="text-orange-400" />}

                                    {/* Custom/Default Icon */}
                                    {!logStyles[log.type] && (
                                        log.icon ? <span className="text-xs">{log.icon}</span> : <Sword size={12} className="opacity-20" />
                                    )}
                                </div>

                                {/* Text Content */}
                                <div className="flex-1 py-0.5">
                                    {(() => {
                                        // --- 1. สำหรับ Elemental (ของเดิมของคุณ) ---
                                        if (log.type === 'elemental') {
                                            return log.text.split(' ').map((word, index) => {
                                                const elementColors: Record<string, string> = {
                                                    Fire: 'text-orange-500 font-bold drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]',
                                                    Water: 'text-blue-400 font-bold',
                                                    Earth: 'text-emerald-400 font-bold',
                                                    Wind: 'text-sky-300 font-bold',
                                                    Light: 'text-yellow-300 font-bold drop-shadow-[0_0_5px_rgba(253,224,71,0.3)]',
                                                    Dark: 'text-purple-500 font-bold',
                                                    Neutral: 'text-slate-400 font-bold'
                                                };
                                                const cleanWord = word.replace('!', '');
                                                if (elementColors[cleanWord]) {
                                                    return <span key={index} className={`${elementColors[cleanWord]} mx-0.5`}>{word}</span>;
                                                }
                                                if (word.includes('ได้เปรียบ')) return <span key={index} className="text-emerald-400 font-black underline decoration-emerald-500/30 mx-0.5">ได้เปรียบ</span>;
                                                if (word.includes('เสียเปรียบ')) return <span key={index} className="text-rose-400 font-black underline decoration-rose-500/30 mx-0.5">เสียเปรียบ</span>;
                                                if (word.includes('x')) return <span key={index} className="text-amber-200/80 font-mono text-[12px] ml-1 bg-white/5 px-1 rounded border border-white/5">{word}</span>;
                                                return <span key={index}>{word} </span>;
                                            });
                                        }

                                        // --- 2. สำหรับ Boss Skill (เพิ่มใหม่ ✨) ---
                                        if (log.type === 'boss_skill' || log.type === 'boss_passive') {
                                            return (
                                                <div className="flex flex-wrap items-center gap-1">
                                                    {log.text.split(' ').map((word, index) => {
                                                        // ไฮไลต์คำที่เป็นชื่อสกิล (มักจะอยู่ใน [ ] หรือ เป็นคำเน้น)
                                                        if (word.startsWith('[') && word.endsWith(']')) {
                                                            return (
                                                                <span key={index} className="text-rose-400 font-black tracking-tighter bg-rose-500/10 px-1.5 rounded border border-rose-500/20 animate-pulse">
                                                                    {word}
                                                                </span>
                                                            );
                                                        }
                                                        // ไฮไลต์พวกตัวเลขความเสียหายของบอส
                                                        if (!isNaN(Number(word.replace(/[^0-9]/g, ''))) && word.length > 1) {
                                                            return <span key={index} className="text-white font-bold">{word}</span>;
                                                        }
                                                        return <span key={index} className={log.type === 'boss_passive' ? 'text-purple-200/80 ' : 'text-rose-100'}>{word} </span>;
                                                    })}
                                                </div>
                                            );
                                        }

                                        // --- 3. สำหรับสถานะพิเศษอื่นๆ (สะท้อน/ฟื้นฟู) ---
                                        if (log.type === 'reflect') {
                                            return <span className="text-orange-300 font-bold ">🛡️ {log.text}</span>;
                                        }

                                        // --- 4. ข้อความปกติ ---
                                        return <span className="text-slate-300">{log.text}</span>;
                                    })()}
                                </div>

                                {/* Row ID (Invisible/Subtle) */}
                                {log.type !== 'turn' && (
                                    <span className="text-[8px] font-mono opacity-5 self-center select-none">
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