import React from 'react';
import { useTranslation } from 'react-i18next';
import './css/DropdownMenu.css';
import { useNavigate } from 'react-router-dom';

const DropdownMenu = ({ theme, toggleTheme, changeLanguage }) => {
  const { t } = useTranslation();
  const navigate = useNavigate(); 

  const handleChangeTheme = () => {
    toggleTheme();
  };

  const handleGoToProfile = () => {
    navigate('/profile'); 
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // або navigate('/login') — залежно від маршруту
    window.location.reload(); // оновлює стан додатку
  };

  const themeClass = theme === 'dark' ? 'dark' : 'light';

  return (
    <div
      className={`dropdown custom-dropdown ${themeClass}`}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 1050,
      }}
    >
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
          <a className="dropdown-item" href="#" onClick={handleChangeTheme}>
            {theme === 'light' ? '🌙 ' + t('switch_to_dark') : '☀️ ' + t('switch_to_light')}
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#" onClick={() => changeLanguage('en')}>
            🇬🇧 English
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#" onClick={() => changeLanguage('uk')}>
            🇺🇦 Українська
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
  );
};

export default DropdownMenu;
