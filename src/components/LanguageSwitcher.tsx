import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const changeLanguage = (lang: 'en' | 'th') => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
    localStorage.setItem('i18nextLng', lang);
    window.location.reload(); // Refresh to apply language changes
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
        {i18n.t('ui.language')}:
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all ${currentLang === 'en'
              ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage('th')}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all ${currentLang === 'th'
              ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
        >
          TH
        </button>
      </div>
    </div>
  );
}
