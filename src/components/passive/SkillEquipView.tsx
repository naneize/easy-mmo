import { useState, useMemo } from 'react';
import { Plus, X, Sparkles, Filter, Activity, Swords, Shield } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { SkillCard } from './SkillCard';
import { calculatePlayerClass } from '../../utils/gameHelpers';

export function SkillEquipView() {
    const { player, equipSkill, unequipSkill, getOwnedSkillsWithIcons, getEquippedSkillsWithIcons, unlockedSkills } = useGameStore();
    const [activeTab, setActiveTab] = useState('All');
    const [activeType, setActiveType] = useState('All');

    // Reconstruct skills with proper Icons
    const ownedSkillsWithIcons = getOwnedSkillsWithIcons();
    const equippedSkillsWithIcons = getEquippedSkillsWithIcons();

    const playerClass = calculatePlayerClass(equippedSkillsWithIcons);

    const tabs = ['All', 'Fire', 'Water', 'Earth', 'Wind', 'Light', 'Dark', 'Neutral'];

    // #region --- ส่วนที่เพิ่มเข้ามา: UI Filter Types ---
    const skillTypes = [
        { id: 'All', label: 'All Types', Icon: Activity },
        { id: 'constant', label: 'Constant', Icon: Sparkles },
        { id: 'on-hit', label: 'On-Hit', Icon: Swords },
        { id: 'on-defend', label: 'Defend', Icon: Shield },
    ];
    // #endregion

    const filteredSkills = useMemo(() => {
        const skillsWithLockState = ownedSkillsWithIcons.map(skill => ({
            ...skill,
            unlocked: unlockedSkills.includes(skill.id)
        }));

        return skillsWithLockState.filter(skill => {
            return skill.unlocked &&
                (activeTab === 'All' || skill.element?.toLowerCase() === activeTab.toLowerCase()) &&
                (activeType === 'All' || skill.type === activeType);
        });
    }, [ownedSkillsWithIcons, unlockedSkills, activeTab, activeType]);

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Active Slots */}
            <div>
                <div className="mb-6 text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                    <div className="bg-indigo-500 w-2 h-6 rounded-full"></div> Active Slots (4 Max)
                    <div className={`ml-auto px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${playerClass ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        Class: {playerClass ? playerClass.name : 'Novice'}
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {[0, 1, 2, 3].map((idx) => {
                        const skill = equippedSkillsWithIcons[idx];

                        // --- 1. กรณีสล็อตว่าง (Empty Slot) ---
                        if (!skill) return (
                            <div
                                key={idx}
                                className="flex flex-col items-center justify-center gap-1 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 text-slate-300 min-h-[90px] sm:min-h-[110px] transition-all duration-300"
                            >
                                {/* ย่อขนาดไอคอน Plus ลงนิดนึง */}
                                <Plus size={20} className="opacity-20" />
                                <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest opacity-40">
                                    Empty
                                </div>
                            </div>
                        );

                        // --- 2. กรณีสล็อตที่มีสกิล (Equipped Slot) ---
                        return (

                            <div key={skill.id} className="relative group">
                                {/* 1. ตัวการ์ด - ปิดแท็กในตัวมันเองเลย (Self-closing) */}
                                <SkillCard
                                    skill={skill}
                                    isEquipped={true}
                                    isSynergy={player.element === skill.element}
                                    hideDescription={true}
                                    className="h-fit !pb-2"
                                />

                                {/* 2. ปุ่ม X - วางไว้ข้างนอก SkillCard แต่อยู่ใน Div "relative group" เดียวกัน */}
                                <button
                                    onClick={() => unequipSkill(skill.id)}
                                    className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-white hover:bg-rose-500 transition-all duration-300 z-50 shadow-xl border-2 border-white group-hover:scale-110 active:scale-95"
                                >
                                    <X size={12} />
                                </button>

                                {/* Glow effect */}
                                <div className="absolute inset-0 -z-10 bg-emerald-400/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                        );
                    })}
                </div>
            </div>

            <hr className="border-slate-200/50" />

            {/* Library Filter */}
            <div className="space-y-4">
                {/* --- ส่วนแก้ไข: แยก Filter เป็น 2 แถวเพื่อให้เหมือนกับหน้า Upgrade --- */}
                <div className="space-y-3">
                    {/* Element Tabs */}
                    <div className="flex flex-wrap gap-2 bg-white p-2 rounded-[1.5rem] shadow-sm border border-slate-100">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all 
                                    ${activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Type Filter Tabs (ส่วนที่เพิ่มใหม่) */}
                    <div className="flex items-center gap-3 px-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                            <Filter size={12} /> Filter:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {skillTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setActiveType(type.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase transition-all
                                        ${activeType === type.id
                                            ? 'bg-slate-800 text-white shadow-sm'
                                            : 'bg-white text-slate-500 border border-slate-200 opacity-60 hover:opacity-100'}`}
                                >
                                    <type.Icon size={12} />
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Skill Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredSkills.map(skill => (
                        <SkillCard
                            key={skill.id}
                            skill={skill}
                            isSynergy={player.element === skill.element}
                            isEquipped={equippedSkillsWithIcons.some(s => s.id === skill.id)}
                            disabled={equippedSkillsWithIcons.some(s => s.id === skill.id) || equippedSkillsWithIcons.length >= 4}
                            onClick={() => equipSkill(skill.id)}
                        />
                    ))}

                    {/* Empty State เมื่อไม่พบสกิลจากการ Filter */}
                    {filteredSkills.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400 font-bold uppercase text-xs tracking-widest border-2 border-dashed border-slate-100 rounded-[2rem]">
                            No skills match your filters
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}