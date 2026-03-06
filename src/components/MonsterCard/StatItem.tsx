import React, { type ReactNode } from 'react'

interface StatItemProps {
    icon: ReactNode;
    label: string;
    value: number | string;
    color: string;
}

export function StatItem({ icon, label, value, color }: StatItemProps) {
    return (
        <div className={`flex flex-col items-center justify-center ${color} p-2 rounded-2xl border border-black/5 min-h-[50px]`}>
            <div className="flex items-center gap-1 mb-0.5"> {/* 👈 เอา opacity-60 ออกก่อนเพื่อเช็ค */}
                {icon}
                <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                    {label || '???'} {/* 👈 ถ้า label ว่างให้โชว์ ??? จะได้รู้ว่า i18n หาไม่เจอ */}
                </span>
            </div>
            <span className="text-sm font-black text-slate-800 tabular-nums">
                {value}
            </span>
        </div>
    )
}