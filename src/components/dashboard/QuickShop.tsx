import { ShoppingCart, Coins, Plus } from 'lucide-react';
import { CONSUMABLES } from '../../data/items';
import type { GameItem } from '../../types/game';
import { useGameStore } from '../../store/useGameStore';

interface QuickShopProps {
    onBuy: (item: GameItem) => void;
}

export function QuickShop({ onBuy }: QuickShopProps) {
    const { player } = useGameStore();

    return (
        <div className="rounded-[2.5rem] bg-white p-6 shadow-sm border border-slate-100 w-full">
            <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 uppercase italic">
                    <ShoppingCart className="text-rose-500" size={20} />
                    Quick Shop
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                    <Coins size={14} className="text-amber-500" />
                    <span className="text-[11px] font-black text-slate-600">
                        {player.gold.toLocaleString()}G
                    </span>
                </div>
            </div>

            {/* ใช้ flex-wrap และ flex-grow เพื่อให้ทุกชิ้นขยายเต็มพื้นที่เสมอ */}
            <div className="flex flex-wrap gap-3">
                {CONSUMABLES.map((item) => {
                    const canAfford = player.gold >= item.price;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onBuy(item)}
                            disabled={!canAfford}
                            // ใช้ flex-grow เพื่อให้ไอเทมในแถวสุดท้ายขยายเต็มพื้นที่ที่เหลือ
                            className={`group flex items-center gap-4 p-3 rounded-2xl border-2 transition-all 
                                flex-grow basis-[calc(33.333%-12px)] min-w-[280px]
                                ${canAfford
                                    ? 'border-slate-50 bg-slate-50 hover:border-rose-200 hover:bg-white hover:shadow-lg hover:shadow-rose-100/30 hover:-translate-y-1'
                                    : 'border-transparent bg-slate-50/50 opacity-60 cursor-not-allowed'
                                }`}
                        >
                            {/* Icon Section */}
                            <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center text-3xl bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                {item.icon}
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 text-left min-w-0">
                                <div className="text-[12px] font-black text-slate-800 uppercase tracking-tight truncate">
                                    {item.name}
                                </div>
                                <div className="text-[10px] font-bold text-slate-400 truncate mb-1">
                                    {item.description}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className={`flex items-center gap-1 text-[11px] font-black transition-colors ${canAfford ? 'text-rose-500' : 'text-slate-400'}`}>
                                        <Coins size={12} />
                                        {item.price}G
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-rose-500 text-white rounded-lg text-[9px] font-black opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 italic shadow-sm">
                                        <Plus size={10} strokeWidth={4} /> BUY
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}