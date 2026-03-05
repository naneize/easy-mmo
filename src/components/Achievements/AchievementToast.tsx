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

    useEffect(() => {
        // เริ่มแสดงผล (เด้งขึ้นมา)
        const showTimeout = setTimeout(() => setIsVisible(true), 100);

        // เริ่มหายไปหลังจาก 2 วินาที
        const hideTimeout = setTimeout(() => setIsVisible(false), 2500);

        // ปิด Component หลังจากหายไปแล้ว (แอนิเมชันจบ)
        const closeTimeout = setTimeout(onClose, 3500);

        return () => {
            clearTimeout(showTimeout);
            clearTimeout(hideTimeout);
            clearTimeout(closeTimeout);
        };
    }, [onClose]);

    return (
        <div className={`fixed bottom-8 right-8 z-[200] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90'
            }`}>
            <div className="bg-slate-900 border-2 border-amber-400 p-1 rounded-[2.5rem] shadow-[0_20px_50px_rgba(251,191,36,0.3)] overflow-hidden min-w-[300px]">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.3rem] p-5 flex items-center gap-4 relative">

                    {/* Background Sparkles Effect */}
                    <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                        <Trophy size={80} />
                    </div>

                    {/* Icon Section */}
                    <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-t from-amber-600 to-yellow-300 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow">
                            <Trophy className="text-white drop-shadow-md" size={28} />
                        </div>
                        <div className="absolute -top-2 -right-2 text-amber-300 animate-pulse">
                            <Sparkles size={20} />
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-0.5">{badgeText ?? t('achievementToast.unlocked')}</span>
                        </div>
                        <h4 className="text-white font-black text-lg leading-tight tracking-tight uppercase">
                            {title}
                        </h4>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Loading/Progress Bar ด้านล่างที่ค่อยๆ ลดลง */}
                <div className="h-1 bg-amber-400/20 w-full overflow-hidden">
                    <div className={`h-full bg-amber-400 transition-all duration-[4000ms] ease-linear ${isVisible ? 'w-full' : 'w-0'}`} />
                </div>
            </div>
        </div>
    )
}