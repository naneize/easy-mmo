import { useState, useMemo, Fragment } from 'react'; // เพิ่ม Fragment
import { useTranslation } from 'react-i18next'; // ลบ import ซ้ำ
import { ArrowUpCircle, Lock, Sparkles, Activity, Swords, Shield, Filter } from 'lucide-react';
import { useGameStore, getUpgradeCost } from '../../store/useGameStore';
import { SkillCard } from './SkillCard';

const TAB_COLORS: Record<string, string> = {
    All: 'bg-amber-500 text-white',
    Fire: 'bg-orange-500 text-white',
    Water: 'bg-blue-500 text-white',
    Earth: 'bg-emerald-600 text-white',
    Wind: 'bg-sky-500 text-white',
    Light: 'bg-yellow-400 text-yellow-900',
    Dark: 'bg-purple-900 text-white',
    Neutral: 'bg-slate-500 text-white',
};

export function SkillUpgradeView() {
    const { t } = useTranslation();
    const { player, upgradeSkill, getOwnedSkillsWithIcons, unlockedSkills } = useGameStore();
    const [activeTab, setActiveTab] = useState('All');
    const [activeType, setActiveType] = useState('All');

    const ownedSkillsWithIcons = getOwnedSkillsWithIcons();

    const tabs = ['All', 'Fire', 'Water', 'Earth', 'Wind', 'Light', 'Dark', 'Neutral'];
    const translatedTabs = tabs.map(tab => ({ id: tab, label: t(`${tab.toLowerCase()}`) }));
    const skillTypes = [
        { id: 'All', label: t('skills.allTypes'), Icon: Activity },
        { id: 'constant', label: t('skills.constant'), Icon: Sparkles },
        { id: 'on-hit', label: t('skills.onHit'), Icon: Swords },
        { id: 'on-defend', label: t('skills.defend'), Icon: Shield },
    ];

    const getUpgradeCostForSkill = (currentLevel: number, tier: 'common' | 'rare' | 'epic' | 'legendary') => {
        return getUpgradeCost(currentLevel, tier);
    };

    const filteredSkills = useMemo(() => {
        const skillsWithLockState = ownedSkillsWithIcons.map(skill => ({
            ...skill,
            unlocked: unlockedSkills.includes(skill.id)
        }));

        return skillsWithLockState.filter(skill => {
            const matchElement = activeTab === 'All' || skill.element?.toLowerCase() === activeTab.toLowerCase();
            const matchType = activeType === 'All' || skill.type === activeType;
            return matchElement && matchType;
        });
    }, [ownedSkillsWithIcons, unlockedSkills, activeTab, activeType]);

    return (
        <div className="animate-in slide-in-from-top-4 duration-500 space-y-6">
            {/* Header Stats */}
            <div className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div>
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <Sparkles className="text-amber-500" /> {t('skills.skillMastery')}
                    </h3>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{t('skills.upgradeOrUnlockPotential')}</p>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">{t('skills.currentBalance')}</div>
                    <div className="text-xl font-black text-slate-900">{player.gold.toLocaleString()} 💰</div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="space-y-4 bg-slate-100/50 p-4 rounded-[2rem]">
                <div className="flex flex-wrap gap-1.5">
                    {translatedTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                if (tab.id !== 'Neutral' && tab.id !== 'All') setActiveType('All');
                            }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all
                                ${activeTab === tab.id ? `${TAB_COLORS[tab.id]} shadow-lg scale-105` : 'bg-white text-slate-400 hover:bg-slate-50'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 px-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                        <Filter size={12} /> {t('skills.filter')}
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {skillTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setActiveType(type.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase transition-all
                                    ${activeType === type.id ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 opacity-60'}`}
                            >
                                <type.Icon size={12} />
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upgrade Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 pb-10">
                {filteredSkills.length > 0 ? (
                    filteredSkills.map(skill => {
                        const currentLevel = skill.level || 1;
                        const isUnlocked = unlockedSkills.includes(skill.id);
                        const upgradeCost = getUpgradeCostForSkill(currentLevel, skill.tier);
                        const isMax = currentLevel >= (skill.maxLevel || 10);
                        const canAfford = player.gold >= upgradeCost;

                        return (
                            <SkillCard key={skill.id} skill={skill} variant="upgrade">
                                <div className="mt-4 pt-4 border-t border-slate-50 space-y-3">
                                    {isUnlocked ? (
                                        <Fragment>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-end">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t('skills.currentRank')}</span>
                                                        <span className="text-xs font-black text-slate-800">{t('skills.level')} {currentLevel}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t('skills.maxMastery')}</span>
                                                        <span className="block text-xs font-black text-slate-500">{skill.maxLevel || 10}</span>
                                                    </div>
                                                </div>

                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-white">
                                                    <div
                                                        className={`h-full transition-all duration-700 ${isMax ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                                                        style={{ width: `${(currentLevel / (skill.maxLevel || 10)) * 100}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => upgradeSkill(skill.id)}
                                                disabled={!canAfford || isMax}
                                                className={`w-full py-4 rounded-[1.5rem] flex flex-col items-center justify-center gap-0.5 text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300
                                                    ${isMax ? 'bg-amber-100 text-amber-600 cursor-default' :
                                                        canAfford ? 'bg-slate-900 text-white hover:bg-indigo-600 hover:-translate-y-1 shadow-xl active:scale-95' :
                                                            'bg-slate-50 text-slate-300 border border-slate-200 opacity-80'}`}
                                            >
                                                {isMax ? (
                                                    <div className="flex items-center gap-2 text-amber-600">
                                                        <Sparkles size={14} />
                                                        <span>{t('skills.maxMasteryReached')}</span>
                                                    </div>
                                                ) : canAfford ? (
                                                    <Fragment>
                                                        <div className="flex items-center gap-1.5">
                                                            <ArrowUpCircle size={14} className="text-emerald-400" />
                                                            <span>{t('skills.upgrade')} • {upgradeCost.toLocaleString()} 💰</span>
                                                        </div>
                                                        <span className="text-[8px] opacity-60 font-medium tracking-normal lowercase">
                                                            {t('skills.clickToIncreasePower')}
                                                        </span>
                                                    </Fragment>
                                                ) : (
                                                    <div className="flex flex-col items-center w-full">
                                                        <div className="flex items-center gap-1.5 text-red-500 font-bold">
                                                            <Lock size={12} className="opacity-70" />
                                                            <span className="text-[11px] sm:text-[12px]">
                                                                {t('skills.cost')}: {upgradeCost.toLocaleString()} {t('global.gold')}
                                                            </span>
                                                        </div>
                                                        <span className="text-[9px] text-red-400 font-medium tracking-tight">
                                                            ({t('skills.need')} {(upgradeCost - player.gold).toLocaleString()} {t('global.gold')})
                                                        </span>
                                                    </div>
                                                )}
                                            </button>
                                        </Fragment>
                                    ) : (
                                        <div className="pt-2">
                                            <button
                                                disabled={true}
                                                className="w-full py-4 rounded-[1.5rem] flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] bg-slate-100 text-slate-400 border border-slate-200 opacity-60"
                                            >
                                                <Lock size={14} />
                                                {t('skills.skillLocked')}
                                            </button>
                                            <p className="text-[8px] text-center mt-3 text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                                {t('skills.findSkillByDefeating')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </SkillCard>
                        );
                    })
                ) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                        <Filter size={40} className="opacity-20 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('skills.noSkillsFound')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}