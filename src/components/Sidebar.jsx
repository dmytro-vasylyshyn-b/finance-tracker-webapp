import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './css/Sidebar.css'
const Sidebar = ({ theme }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const linkClass = `nav-link sidebar-link`;

  return (
    <div className={`sidebar-wrapper theme-${theme}`}>
      <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <button className={`sidebar-toggle-btn ${theme}`} onClick={toggleSidebar}>
          {isOpen ? '✕' : '☰'}
        </button>

        <div className={`sidebar`}>
          <ul className="nav flex-column p-3">
            <li className="nav-item">
              <a href="/" className={linkClass}>{t('home')}</a>
            </li>
            <li className="nav-item">
              <a href="/income" className={linkClass}>{t('income_expense')}</a>
            </li>
            <li className="nav-item">
              <a href="/analitics" className={linkClass}>{t('analytics')}</a>
            </li>
            <li className="nav-item">
              <a href="/calculator" className={linkClass}>{t('calculator')}</a>
            </li>
            <li className="nav-item">
              <a href="markets" className={linkClass}>{t('markets')}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
