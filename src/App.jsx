import React, { useState, useEffect } from 'react';
import './i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ProfilePage from './pages/ProfilePage';
import IncomePage from './pages/IncomePage';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import AuthForm from './pages/AuthForm'; 
import { PreferencesProvider } from './context/PreferencesContext';
import Calculation from './pages/Calculation'
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState('light');
  const token = localStorage.getItem('token');

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

  const wrapWithLayout = (component) => (
    <Layout theme={theme} toggleTheme={toggleTheme} changeLanguage={changeLanguage}>
      {component}
    </Layout>
  );

  return (
    <PreferencesProvider>
      <Router>
        <Routes>
          {/* Головна доступна всім */}
          <Route
            path="/"
            element={wrapWithLayout(<HomePage />)}
          />

          {/* Калькулятор доступний всім */}
          <Route
            path="/calculator"
            element={wrapWithLayout(<Calculation />)}
          />

          {/* Доступ тільки для незалогінених */}
          <Route
            path="/auth"
            element={!token ? <AuthForm theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/" />}
          />

          {/* Приватні маршрути - тільки для залогінених */}
          <Route
            path="/profile"
            element={
              token
                ? wrapWithLayout(<ProfilePage />)
                : <Navigate to="/auth" />
            }
          />
          <Route
            path="/income"
            element={
              token
                ? wrapWithLayout(<IncomePage />)
                : <Navigate to="/auth" />
            }
          />
          <Route
            path="/analitics"
            element={
              token
                ? wrapWithLayout(<AnalyticsPage />)
                : <Navigate to="/auth" />
            }
          />

          {/* Якщо сторінка не знайдена */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </PreferencesProvider>
  );
}

export default App;
