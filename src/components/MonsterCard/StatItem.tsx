import type { ReactNode } from 'react'

interface StatItemProps {
    icon: ReactNode;
    label: string;
    value: number | string;
    color: string;
}

export function StatItem({ icon, label, value, color }: StatItemProps) {
    return (
        <div className={`flex flex-col items-center justify-center ${color} p-2 rounded-2xl border border-black/5`}>
            <div className="flex items-center gap-1 mb-0.5 opacity-60">
                {icon}
                <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
            </div>
            <span className="text-xs font-black text-slate-700 tabular-nums">{value}</span>
        </div>
    )
}