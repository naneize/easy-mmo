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
            ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90'}`}>

            {/* กล่องหลัก: เพิ่ม backdrop-blur-xl เพื่อให้โปร่งแสงเห็นพื้นหลัง Emerald ของคุณแบบนวลๆ */}
            <div className="bg-slate-900/90 backdrop-blur-xl border-2 border-amber-400 p-1 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(251,191,36,0.2)] overflow-hidden min-w-[320px]">

                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/80 rounded-[2.3rem] p-5 flex items-center gap-4 relative">

                    {/* Background Trophy (ตกแต่งด้านหลัง) */}
                    <div className="absolute -top-2 -right-2 p-4 opacity-5 rotate-12 text-white">
                        <Trophy size={90} />
                    </div>

                    {/* Icon Section */}
                    <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-t from-amber-600 to-yellow-300 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.4)] animate-bounce-slow">
                            <Trophy className="text-white drop-shadow-md" size={28} />
                        </div>
                        <div className="absolute -top-2 -right-2 text-amber-300 animate-pulse">
                            <Sparkles size={20} />
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="flex-1 relative z-10">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-amber-400 uppercase tracking-[0.25em] mb-0.5">
                                {badgeText ?? t('achievementToast.unlocked')}
                            </span>
                        </div>
                        <h4 className="text-white font-black text-lg leading-tight tracking-tight uppercase italic">
                            {title}
                        </h4>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-0.5 opacity-90">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Progress Bar: ปรับให้วิ่งจากขวามาซ้าย (ลดลง) */}
                <div className="h-1 bg-amber-400/10 w-full overflow-hidden">
                    <div
                        className="h-full bg-amber-400 transition-all ease-linear"
                        style={{
                            width: `${progress}%`,
                            transitionDuration: '3000ms' // วิ่งเป็นเวลา 3 วินาทีตามที่แสดง
                        }}
                    />
                </div>
            </div>
        </div>
    )
}