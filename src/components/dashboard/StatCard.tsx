import React, { useState } from 'react';
import { ElementGuideModal } from '../ElementGuideModal';
import { ELEMENT_CHART } from '../../logic/elementalLogic';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    bonus?: number;
    baseValue?: number;
    color: 'rose' | 'amber' | 'emerald' | 'sky';
    isRegen?: boolean;
    onElementClick?: () => void;
}

// 🎨 ปรับสีพื้นหลังให้เข้มขึ้น (Level 100) เพื่อให้เห็นสีชัดเจน ไม่ซีดเหมือนสีขาว
const bgColors = {
    rose: 'bg-rose-100',
    amber: 'bg-amber-100',
    emerald: 'bg-emerald-100',
    sky: 'bg-sky-100'
};

// 🖋️ ใช้เส้นขอบสีที่เข้มกว่าพื้นหลัง เพื่อสร้างมิติให้การ์ดดูไม่แบน
const borderColors = {
    rose: 'border-rose-200',
    amber: 'border-amber-200',
    emerald: 'border-emerald-200',
    sky: 'border-sky-200'
};

export function StatCard({ icon, label, value, baseValue, bonus, color, isRegen, onElementClick }: StatCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = () => {
        if (label.toLowerCase().includes('element')) {
            setIsModalOpen(true);
        }
        if (onElementClick) onElementClick();
    };

    const isElementCard = label.toLowerCase().includes('element');

    return (
        <>
            <div
                onClick={handleCardClick}
                className={`relative rounded-3xl ${bgColors[color]} p-5 transition-all shadow-sm border ${borderColors[color]} overflow-hidden 
                    ${isElementCard ? 'cursor-pointer hover:scale-105 active:scale-95 group' : ''}`}
            >
                {/* --- ส่วนบ่งบอกว่ามีการ Regen --- */}
                {isRegen && (
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                        <span className="text-[7px] font-black text-rose-600 uppercase tracking-tighter animate-pulse">
                            Regen
                        </span>
                        <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                    </div>
                )}

                {/* --- Icon (พื้นหลังขาวตัดกับสีการ์ดเข้มจะดูเด่นมาก) --- */}
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 shadow-sm border border-white">
                    {icon}
                </div>

                {/* --- Label --- */}
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500/80">
                    {label}
                </div>

                {/* --- Value & Bonus (แบบไม่มีรายชื่อสกิลให้รก) --- */}
                <div className="flex items-baseline gap-1.5 flex-wrap">
                    {/* Total Value */}
                    <div className={`text-xl font-black
                        ${label.toUpperCase().includes('ATK') ? 'text-sky-600' :
                            label.toUpperCase().includes('DEF') ? 'text-emerald-700' :
                                label.toUpperCase().includes('HP') ? 'text-rose-600' : 'text-slate-800'}`}
                    >
                        {value}
                    </div>

                    {/* Base + Bonus (Compact Version) */}
                    {baseValue !== undefined && bonus !== undefined && bonus !== 0 && (
                        <div className="text-[10px] font-bold text-slate-500/60 tracking-tight bg-white/30 px-1.5 py-0.5 rounded-lg border border-white/20">
                            {baseValue}
                            <span className={bonus >= 0 ? 'text-emerald-600' : 'text-orange-600'}>
                                {bonus >= 0 ? ` +${bonus}` : ` -${Math.abs(bonus)}`}
                            </span>
                        </div>
                    )}
                </div>

                {/* --- คำแนะนำสั้นๆ (โชว์เฉพาะการ์ดธาตุ) --- */}
                {isElementCard && (
                    <div className="absolute bottom-2 right-3 opacity-40 group-hover:opacity-100 transition-opacity">
                        <span className="text-[7px] font-black text-slate-600">INFO</span>
                    </div>
                )}
            </div>

            {/* --- Modal --- */}
            {isModalOpen && (
                <ElementGuideModal
                    onClose={() => setIsModalOpen(false)}
                    elementChart={ELEMENT_CHART}
                />
            )}
        </>
    );
}