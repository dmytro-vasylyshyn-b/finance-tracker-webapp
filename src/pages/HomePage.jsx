// src/pages/HomePage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  return <h1>{t('welcome_message')}</h1>;
};

export default HomePage;
