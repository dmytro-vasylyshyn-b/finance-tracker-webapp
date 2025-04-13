// src/App.js

import React, { useState, useEffect } from 'react';
import './i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import Layout from './components/Layout'; // Новий компонент з Sidebar і Dropdown

function App() {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.classList.toggle('bg-dark', theme === 'dark');
    document.body.classList.toggle('text-white', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout theme={theme} toggleTheme={toggleTheme} changeLanguage={changeLanguage}>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout theme={theme} toggleTheme={toggleTheme} changeLanguage={changeLanguage}>
              <ProfilePage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
