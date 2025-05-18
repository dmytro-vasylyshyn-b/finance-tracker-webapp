import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import './css/DropdownMenu.css';
import { useNavigate } from 'react-router-dom';
import { PreferencesContext } from '../context/PreferencesContext';

const DropdownMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    theme,
    language,
    savePreferences,
  } = useContext(PreferencesContext);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    savePreferences({ theme: newTheme, language });
  };

  const toggleLanguage = () => {
    const newLang = language === 'uk' ? 'en' : 'uk';
    savePreferences({ theme, language: newLang });
  };

  const handleGoToProfile = () => navigate('/profile');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  const themeIcon = theme === 'light' ? '☀️' : '🌙';
  const langIcon = language === 'uk' ? 'UA' : 'EN';
  const themeClass = theme === 'dark' ? 'dark' : 'light';

  return (
    <div
      className={`d-flex align-items-center position-fixed ${themeClass}`}
      style={{
        top: '1rem',
        right: '1rem',
        zIndex: 1050,
        gap: '0.5rem',
      }}
    >
      {/* Перемикач мови */}
      <button
        onClick={toggleLanguage}
        className="btn btn-outline-secondary"
        title={language === 'uk' ? 'Switch to English' : 'Змінити мову на українську'}
      >
        {langIcon}
      </button>

      {/* Перемикач теми */}
      <button
        onClick={toggleTheme}
        className="btn btn-outline-secondary"
        title={theme === 'light' ? 'Switch to dark mode' : 'Перемкнути на світлу тему'}
      >
        {themeIcon}
      </button>

      {/* Кнопка випадаючого меню */}
      <div className="dropdown custom-dropdown">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          ⚙️ {t('options')}
        </button>
        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
          <li>
            <a className="dropdown-item" href="#" onClick={handleGoToProfile}>
              👤 {t('profile')}
            </a>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a className="dropdown-item text-danger" href="#" onClick={handleLogout}>
              🚪 {t('logout') || 'Вийти'}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DropdownMenu;
