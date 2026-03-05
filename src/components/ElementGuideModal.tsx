import React from 'react';
import { Swords, X, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ElementGuideProps {
    onClose: () => void;
    elementChart: Record<string, Record<string, number>>;
}

export function ElementGuideModal({ onClose, elementChart }: ElementGuideProps) {
    const { t } = useTranslation();
    // กรองเอา Neutral ออกเพื่อให้แสดงผลเฉพาะธาตุที่มีระบบแพ้ทาง
    const elements = Object.keys(elementChart).filter((e) => e !== 'Neutral');

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 border-4 border-white max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Swords size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight">{t('elementGuide.title')}</h3>
                            <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest opacity-80">
                                {t('elementGuide.subtitle')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-8 overflow-y-auto bg-slate-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {elements.map((ele) => {
                            const advantages = elementChart[ele] || {};
                            return (
                                <div key={ele} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm transition-hover hover:border-indigo-300">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className={`text-[10px] font-black text-white px-3 py-1 rounded-lg shadow-sm 
                                            ${ele === 'Fire' ? 'bg-orange-500' :
                                                ele === 'Water' ? 'bg-blue-500' :
                                                    ele === 'Earth' ? 'bg-emerald-600' :
                                                        ele === 'Wind' ? 'bg-sky-400' :
                                                            ele === 'Light' ? 'bg-yellow-500' : 'bg-purple-600'}`}>
                                            {ele}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {Object.entries(advantages).map(([target, multi]) => {
                                            const m = multi as number;
                                            const isStrong = m > 1;
                                            const isNeutral = m === 1;

                                            // คำนวณเปอร์เซ็นต์จากฐาน 1.0 
                                            // เช่น 1.25 -> +25%, 0.75 -> -25%
                                            const percent = Math.abs(Math.round((m - 1) * 100));

                                            if (isNeutral) return null; // ไม่แสดงถ้าค่าเป็น 1.0 (ปกติ)

                                            return (
                                                <div key={target} className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2">
                                                        {isStrong ? (
                                                            <Swords size={14} className="text-rose-500" />
                                                        ) : (
                                                            <ShieldAlert size={14} className="text-slate-400" />
                                                        )}
                                                        <span className="font-bold text-slate-600 uppercase">{t('elementGuide.vs')} {target}</span>
                                                    </div>
                                                    <span className={`font-black px-2 py-0.5 rounded-md ${isStrong ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                                                        {isStrong ? '↑' : '↓'} {percent}%
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-600 transition-all active:scale-95"
                    >
                        {t('elementGuide.closeButton')}
                    </button>
                </div>
            </div>
        </div>
    );
}