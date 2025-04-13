// src/components/Layout.jsx

import React from 'react';
import Sidebar from './Sidebar';
import DropdownMenu from './DropdownMenu';

const Layout = ({ theme, toggleTheme, changeLanguage, children }) => {
  return (
    <div className={`app-wrapper ${theme}`}>
      <DropdownMenu
        theme={theme}
        toggleTheme={toggleTheme}
        changeLanguage={changeLanguage}
      />
      <Sidebar theme={theme} />
      <main className="container mt-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
