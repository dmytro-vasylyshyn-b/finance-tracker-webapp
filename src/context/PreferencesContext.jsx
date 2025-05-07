// src/context/PreferencesContext.jsx
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import i18n from '../i18n';

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('uk');

  useEffect(() => {
    document.body.classList.toggle('bg-dark', theme === 'dark');
    document.body.classList.toggle('text-white', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const fetchPreferences = async () => {
    try {
      const res = await axios.get('/api/profile/preferences', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTheme(res.data.theme || 'light');
      setLanguage(res.data.language || 'uk');
    } catch (e) {
      console.warn("Не вдалося завантажити налаштування", e);
    }
  };

  const savePreferences = async (newPrefs) => {
    try {
      await axios.post('/api/profile/preferences', newPrefs, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTheme(newPrefs.theme);
      setLanguage(newPrefs.language);
    } catch (e) {
      console.error('Помилка збереження налаштувань', e);
    }
  };

  return (
    <PreferencesContext.Provider value={{ theme, setTheme, language, setLanguage, fetchPreferences, savePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};
