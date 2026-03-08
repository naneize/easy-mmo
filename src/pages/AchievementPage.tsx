import { useAchievementStore } from '../store/useAchievementStore';
import { useGameStore } from '../store/useGameStore';
import { AchievementItem } from '../components/Achievements/AchievementItem';
import { Trophy, Target, Star, ChevronRight, Activity, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AchievementPage() {
    const { achievements } = useAchievementStore();
    const { player, monsterKills } = useGameStore();
    const { t } = useTranslation();

    // คำนวณสถิติภาพรวม
    const unlockedCount = achievements.filter(a => a.isUnlocked).length;
    const totalProgress = Math.round((unlockedCount / achievements.length) * 100);
    const totalKills = Object.values(monsterKills).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-32 px-4 md:px-0">

            {/* --- Header & Stats Hero Section --- */}
            {/* ปรับเป็น Gradient Emerald to Blue และเพิ่ม Glassmorphism */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/90 via-cyan-600/90 to-blue-700/90 rounded-[3rem] p-8 text-white shadow-[0_20px_50px_rgba(6,182,212,0.3)] border border-white/20">

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 translate-x-10 -translate-y-10">
                    <Trophy size={280} />
                </div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 blur-[50px] rounded-full" />

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-white/40 shadow-2xl shadow-emerald-900/20">
                                <Trophy className="text-emerald-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" size={40} />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black uppercase tracking-tight leading-none mb-2">Hall of Fame</h2>
                                <div className="flex items-center gap-2 text-emerald-50 bg-emerald-900/20 px-3 py-1 rounded-full w-fit backdrop-blur-sm border border-emerald-400/20">
                                    <Activity size={12} className="text-emerald-300" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.1em]">Legacy of {player.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Ring หรือ Badge รวม */}
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase opacity-60 mb-1">Overall Progress</span>
                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-t from-white to-emerald-200">
                                {totalProgress}%
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: 'Unlocked', value: `${unlockedCount} / ${achievements.length}`, icon: Star, color: 'text-amber-300' },
                            { label: 'Completion', value: `${totalProgress}%`, icon: Zap, color: 'text-cyan-300' },
                            { label: 'Total Kills', value: totalKills.toLocaleString(), icon: Target, color: 'text-rose-300' }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white/10 backdrop-blur-md p-5 rounded-[2.5rem] border border-white/20 flex items-center gap-4 transition-transform hover:scale-[1.02]">
                                <div className={`p-3 rounded-2xl bg-black/10 ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                    <p className="text-2xl font-black text-white">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Achievement Categories --- */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                        <h3 className="text-lg font-black text-slate-800/80 uppercase tracking-tighter flex items-center gap-2">
                            All Milestones
                        </h3>
                    </div>
                    <div className="text-[10px] font-black text-cyan-700 bg-cyan-100/50 backdrop-blur-sm px-4 py-1.5 rounded-xl border border-cyan-200 uppercase tracking-wider">
                        Sorted by Status
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 px-2">
                    {achievements
                        .sort((a, b) => (a.isUnlocked === b.isUnlocked ? 0 : a.isUnlocked ? -1 : 1))
                        .map(achievement => (
                            <AchievementItem key={achievement.id} data={achievement} />
                        ))
                    }
                </div>
            </div>


        </div>
    );
}