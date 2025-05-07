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

  return (
    <PreferencesProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              token ? (
                <Layout theme={theme} toggleTheme={toggleTheme} changeLanguage={changeLanguage}>
                  <HomePage />
                </Layout>
              ) : (
                <Navigate to="/auth" /> 
              )
            }
          />
          <Route
            path="/profile"
            element={
              token ? (
                <Layout theme={theme} toggleTheme={toggleTheme} changeLanguage={changeLanguage}>
                  <ProfilePage />
                </Layout>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/auth"
            element={token ? <Navigate to="/" /> : <AuthForm theme={theme} toggleTheme={toggleTheme} />}
          />
          <Route
              path="/income"
              element={
                token ? (
                  <Layout theme={theme} toggleTheme={toggleTheme} changeLanguage={changeLanguage}>
                    <IncomePage />
                  </Layout>
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
        </Routes>
      </Router>
    </PreferencesProvider>

  );
}

export default App;
