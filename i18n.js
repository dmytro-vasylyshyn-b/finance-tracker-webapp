// src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Мовні файли
import enTranslations from './src/locales/en.json';
import ukTranslations from './src/locales/uk.json';

i18n
  .use(initReactI18next) // використовуємо react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      uk: {
        translation: ukTranslations,
      },
    },
    lng: 'uk', // Мова за замовчуванням
    fallbackLng: 'en', // Якщо мови немає, використовуємо цю
    interpolation: {
      escapeValue: false, // не потрібно екранізувати текст
    },
  });

export default i18n;
