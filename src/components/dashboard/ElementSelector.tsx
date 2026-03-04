import React, { useState, useEffect } from 'react';
import type { ElementType } from '../../types/game';
import { Fingerprint, Timer, Coins, HelpCircle } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';


const ELEMENT_STYLES: Record<ElementType, string> = {
    Fire: 'from-orange-500 to-rose-600 shadow-orange-500/20',
    Water: 'from-blue-400 to-cyan-600 shadow-blue-500/20',
    Earth: 'from-emerald-600 to-green-800 shadow-emerald-500/20',
    Wind: 'from-slate-400 to-sky-500 shadow-sky-400/20',
    Light: 'from-amber-300 to-yellow-500 shadow-yellow-400/20',
    Dark: 'from-purple-600 to-indigo-900 shadow-purple-500/20',
    Neutral: 'from-slate-400 to-slate-600 shadow-slate-500/20'
};

interface ElementSelectorProps {
    currentElement: ElementType;
    onSelect: (el: ElementType) => void;
    onOpenGuide?: () => void; // ✨ เพิ่ม Prop สำหรับเปิด Modal
}

export function ElementSelector({ currentElement, onSelect, onOpenGuide }: ElementSelectorProps) {
    const { player } = useGameStore();
    const elements: ElementType[] = ['Neutral', 'Fire', 'Water', 'Earth', 'Wind', 'Light', 'Dark'];

    // --- 🚩 ส่วนที่ต้องแก้ไข: สูตรคำนวณเงินให้ตรงกับ Store ---
    const getBaseMultiplier = (lvl: number) => {
        if (lvl < 5) return 10;
        if (lvl < 10) return 100;
        return 250;
    };

    const baseCost = player.level * getBaseMultiplier(player.level);
    const wealthTax = Math.floor(player.gold * 0.05);
    const totalCost = baseCost + wealthTax; // นี่คือราคาจริงๆ ที่ต้องแสดง

    // --- Logic เวลา Cooldown ---
    const [timeLeft, setTimeLeft] = useState(0);
    const cooldownMs = 3 * 60 * 1000;

    useEffect(() => {
        const timer = setInterval(() => {
            const now = Date.now();
            const diff = now - (player.lastElementChange || 0);
            const remaining = Math.max(0, Math.ceil((cooldownMs - diff) / 1000));
            setTimeLeft(remaining);
        }, 1000);

        return () => clearInterval(timer);
    }, [player.lastElementChange]);

    const isOnCooldown = timeLeft > 0;

    return (
        <div className={`lg:col-span-12 rounded-[2.5rem] p-7 transition-all duration-500 border-4 border-white shadow-xl relative overflow-hidden
    ${currentElement === 'Fire' ? 'bg-rose-50' :
                currentElement === 'Water' ? 'bg-sky-50' :
                    currentElement === 'Earth' ? 'bg-emerald-50' : 'bg-slate-50'}`}>

            {/* แสงฟุ้งด้านหลังเปลี่ยนตามธาตุ */}
            <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-10 blur-3xl transition-colors duration-700
        ${currentElement === 'Fire' ? 'bg-rose-400' :
                    currentElement === 'Water' ? 'bg-sky-400' :
                        currentElement === 'Earth' ? 'bg-emerald-400' : 'bg-indigo-400'}`}
            />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 uppercase italic">
                                <Fingerprint className="text-indigo-600" size={22} />
                                Elemental Attunement
                            </h3>

                            {onOpenGuide && (
                                <button
                                    onClick={onOpenGuide}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-full transition-all border border-indigo-100 shadow-sm active:scale-95 group"
                                >
                                    <HelpCircle size={12} className="group-hover:rotate-12 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-tight">Guide</span>
                                </button>
                            )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                            เลือกธาตุที่ชนะทางมอนสเตอร์เพื่อดาเมจสูงสุด
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-amber-200 shadow-sm">
                            <Coins size={14} className="text-amber-500" />
                            <span className="text-xs font-black text-amber-600">
                                {totalCost.toLocaleString()}
                            </span>
                        </div>

                        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border shadow-sm transition-all bg-white
                    ${isOnCooldown ? 'border-rose-200 text-rose-500' : 'border-emerald-200 text-emerald-500'}`}>
                            <Timer size={14} className={isOnCooldown ? 'animate-spin-slow' : ''} />
                            <span className="text-xs font-black">
                                {isOnCooldown ? `${timeLeft}s` : 'Ready'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3 md:grid-cols-7">
                    {elements.map((el) => {
                        const isActive = currentElement === el;

                        // 🎨 กำหนดสีตามธาตุสำหรับใช้กับ Text และ Ping
                        const elementColors: Record<string, string> = {
                            Fire: 'text-rose-500 bg-rose-500',
                            Water: 'text-sky-500 bg-sky-500',
                            Earth: 'text-emerald-500 bg-emerald-500',
                            Light: 'text-amber-500 bg-amber-500',
                            Dark: 'text-purple-600 bg-purple-600',
                            Neutral: 'text-slate-500 bg-slate-500'
                        };

                        const colorClass = elementColors[el] || 'text-indigo-500 bg-indigo-500';

                        return (
                            <button
                                key={el}
                                disabled={isActive || isOnCooldown}
                                onClick={() => onSelect(el)}
                                className={`flex flex-col items-center gap-2 rounded-[1.5rem] py-5 border-2 transition-all relative
                            ${isActive
                                        ? 'border-white bg-white shadow-xl scale-110 z-10'
                                        : isOnCooldown
                                            ? 'border-transparent bg-slate-200/50 opacity-40 cursor-not-allowed'
                                            : 'border-transparent bg-white/60 hover:bg-white hover:border-white hover:scale-105 hover:shadow-md'
                                    }`}
                            >
                                <div className={`h-11 w-11 rounded-full bg-gradient-to-tr ${ELEMENT_STYLES[el]} shadow-lg transition-transform 
                            ${isActive ? 'scale-110 rotate-12 ring-4 ring-offset-2 ring-white shadow-indigo-200' : 'grayscale-[20%]'}`}
                                />

                                {/* 🏷️ ชื่อธาตุเปลี่ยนสีตามธาตุตัวเองเมื่อถูกเลือก */}
                                <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors
                            ${isActive ? colorClass.split(' ')[0] : 'text-slate-500'}`}>
                                    {el}
                                </span>

                                {/* 🔘 จุดวิบๆ (Ping) ที่เปลี่ยนสีตามธาตุ */}
                                {isActive && (
                                    <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                                        <div className={`h-full w-full rounded-full animate-ping opacity-75 ${colorClass.split(' ')[1]}`} />
                                        <div className={`absolute h-2.5 w-2.5 rounded-full border-2 border-white shadow-sm ${colorClass.split(' ')[1]}`} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {player.gold < totalCost && !isOnCooldown && (
                    <div className="flex justify-center mt-6">
                        <div className="px-6 py-2 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-rose-200 animate-bounce">
                            Not Enough Gold
                        </div>
                    </div>
                )}
            </div>
        </div>


    );
}