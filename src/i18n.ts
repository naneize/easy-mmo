import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // นำกลับมา

import enTranslations from './locales/en/translation.json';
import thTranslations from './locales/th/translation.json';

const resources = {
  en: { translation: enTranslations },
  th: { translation: thTranslations }
};

i18n
  .use(LanguageDetector) // ให้ระบบตรวจจับภาษาที่ผู้เล่นเลือกไว้ล่าสุด
  .use(initReactI18next)
  .init({
    resources,
    // lng: 'th',  <-- ลบบรรทัดนี้ออก หรือ Comment ไว้ เพื่อไม่ให้มันล็อคตายตัว
    fallbackLng: 'th', // ถ้าหาภาษาไม่เจอ ให้ใช้ภาษาไทย
    debug: false,

    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'], // เช็คจากที่เคยบันทึกไว้ในเครื่องก่อน
      caches: ['localStorage'] // บันทึกภาษาที่เลือกไว้ลงในเครื่อง
    }
  });

export default i18n;