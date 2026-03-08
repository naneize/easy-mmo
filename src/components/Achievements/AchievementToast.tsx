import { useEffect, useState } from 'react'
import { Trophy, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface AchievementToastProps {
    title: string;
    description: string;
    onClose: () => void;
    badgeText?: string;
}

export function AchievementToast({ title, description, onClose, badgeText }: AchievementToastProps) {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(100); // เริ่มที่ 100%

    useEffect(() => {
        // 1. แสดงตัว Toast ทันที
        setIsVisible(true);

        // 2. เริ่มลด Progress Bar ทันที (ใช้ setTimeout เล็กน้อยเพื่อให้ CSS Transition เริ่มทำงาน)
        const progressTimer = setTimeout(() => {
            setProgress(0);
        }, 50);

        // 3. หลังจาก 3 วินาที ให้สั่งซ่อน (isVisible = false)
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        // 4. หลังจากซ่อนเสร็จ (แอนิเมชันถอยลงจบ) ให้สั่ง onClose เพื่อลบ Component ออกจากหน้าจอ
        const closeTimer = setTimeout(() => {
            onClose();
        }, 3500);

        return () => {
            clearTimeout(progressTimer);
            clearTimeout(hideTimer);
            clearTimeout(closeTimer);
        };
    }, []);

    return (
        <div className={`fixed bottom-8 right-8 z-[200] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform 
        ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90 pointer-events-none'}`}>

            {/* กล่องหลัก: เปลี่ยนจากสีดำเป็นกระจกขาวใส (White Glass) */}
            <div className="bg-white/40 backdrop-blur-2xl border border-white/40 p-1.5 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15),0_0_20px_rgba(16,185,129,0.1)] overflow-hidden min-w-[340px]">

                <div className="bg-white/40 rounded-[2.2rem] p-5 flex items-center gap-4 relative overflow-hidden">

                    {/* Background Decoration: แสงฟุ้งสีเขียวมรกตด้านหลัง */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    {/* Icon Section: ใช้ Gradient Emerald to Cyan */}
                    <div className="relative shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce-slow">
                            <Trophy className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]" size={32} />
                        </div>
                        {/* Sparkles Effect */}
                        <div className="absolute -top-1 -right-1 text-emerald-500 animate-pulse">
                            <Sparkles size={18} fill="currentColor" className="opacity-70" />
                        </div>
                    </div>

                    {/* Text Section: เน้นตัวอักษรสีเข้มให้อ่านง่ายบนพื้นหลังใส */}
                    <div className="flex-1 relative z-10">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-md uppercase tracking-widest">
                                {badgeText ?? t('achievementToast.unlocked')}
                            </span>
                        </div>
                        <h4 className="text-slate-800 font-black text-lg leading-tight tracking-tight uppercase">
                            {title}
                        </h4>
                        <p className="text-slate-500/80 text-[11px] font-bold uppercase tracking-wide mt-0.5">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Progress Bar: เปลี่ยนเป็นสี Emerald-Cyan Gradient */}
                <div className="absolute bottom-0 left-0 h-1.5 w-full bg-slate-200/30">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 transition-all ease-linear shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                        style={{
                            width: `${progress}%`,
                            transitionDuration: '3000ms'
                        }}
                    />
                </div>
            </div>
        </div>
    )
}