import { useAchievementStore } from '../store/useAchievementStore';
import { useGameStore } from '../store/useGameStore';
import { AchievementItem } from '../components/Achievements/AchievementItem';
import { Trophy, Target, Star, ChevronRight } from 'lucide-react';

export default function AchievementPage() {
    const { achievements } = useAchievementStore();
    const { player, monsterKills } = useGameStore();

    // คำนวณสถิติภาพรวม
    const unlockedCount = achievements.filter(a => a.isUnlocked).length;
    const totalProgress = Math.round((unlockedCount / achievements.length) * 100);
    const totalKills = Object.values(monsterKills).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">

            {/* --- Header & Stats Hero Section --- */}
            <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-[3.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-150">
                    <Trophy size={200} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-xl">
                            <Trophy className="text-yellow-300" size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight">Hall of Fame</h2>
                            <p className="text-indigo-100 text-xs font-bold uppercase tracking-[0.2em] opacity-80">ความสำเร็จของ {player.name}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-[2rem] border border-white/10">
                            <p className="text-[10px] font-black text-indigo-200 uppercase mb-1">Unlocked</p>
                            <p className="text-2xl font-black">{unlockedCount} / {achievements.length}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-[2rem] border border-white/10">
                            <p className="text-[10px] font-black text-indigo-200 uppercase mb-1">Completion</p>
                            <p className="text-2xl font-black">{totalProgress}%</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-[2rem] border border-white/10">
                            <p className="text-[10px] font-black text-indigo-200 uppercase mb-1">Total Kills</p>
                            <p className="text-2xl font-black">{totalKills}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Achievement Categories --- */}
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between px-4">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Star size={16} className="text-amber-500" />
                        All Milestones
                    </h3>
                    <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase">
                        Sorted by Status
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* เรียงเอาอันที่ปลดล็อกแล้วขึ้นก่อน หรืออันที่ใกล้เสร็จขึ้นก่อนก็ได้ */}
                    {achievements
                        .sort((a, b) => (a.isUnlocked === b.isUnlocked ? 0 : a.isUnlocked ? -1 : 1))
                        .map(achievement => (
                            <AchievementItem key={achievement.id} data={achievement} />
                        ))
                    }
                </div>
            </div>

            {/* --- Legend / Info Card --- */}
            <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white flex items-center justify-between group cursor-help transition-all hover:bg-slate-800">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                        <Target size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-tight">ทำไมต้องเก็บ Achievement?</h4>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">ปลดล็อกฉายาและโบนัสพิเศษที่จะช่วยให้คุณแข็งแกร่งขึ้น!</p>
                    </div>
                </div>
                <ChevronRight className="text-slate-600 group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    );
}