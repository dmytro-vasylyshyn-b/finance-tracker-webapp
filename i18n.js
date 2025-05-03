// src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './src/locales/en.json';
import ukTranslations from './src/locales/uk.json';

const savedLang = localStorage.getItem('preferredLanguage') || 'uk';

i18n
  .use(initReactI18next) 
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      uk: {
        translation: ukTranslations,
      },
    },
    lng: savedLang, 
    fallbackLng: 'en', 
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
