import { useState } from 'react';
import { SkillEquipView } from '../components/passive/SkillEquipView';
import { SkillUpgradeView } from '../components/passive/SkillUpgradeView';
import { LayoutGrid, TrendingUp } from 'lucide-react';

export function PassiveSkillPage() {
  const [viewMode, setViewMode] = useState<'equip' | 'upgrade'>('equip');

  return (
    <div className="rounded-[2.5rem] bg-slate-50 p-6 sm:p-8 shadow-inner border border-white min-h-[80vh]">

      {/* View Switcher Tabs */}
      <div className="mb-10 flex justify-center">
        <div className="inline-flex bg-slate-200/50 p-1.5 rounded-[2rem] border border-slate-200 shadow-sm">
          <button
            onClick={() => setViewMode('equip')}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all
              ${viewMode === 'equip' ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutGrid size={14} />
            Equip Skills
          </button>
          <button
            onClick={() => setViewMode('upgrade')}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all
              ${viewMode === 'upgrade' ? 'bg-indigo-600 text-white shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <TrendingUp size={14} />
            Buy & Upgrade
          </button>
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="relative">
        {viewMode === 'equip' ? <SkillEquipView /> : <SkillUpgradeView />}
      </div>
    </div>
  );
}