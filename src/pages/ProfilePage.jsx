import React, { useState, useEffect } from 'react';
import axios from "../api/axios";
import { useTranslation } from "react-i18next";
import { buildProfileUpdateDto } from '../modules/ProfileUpdateDto';
import './css/ProfilePage.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    patronymic: '',
    theme: 'light',
    language: 'ua',
    startPage: 'home',
    profilePic: null,
  });
  const { t } =useTranslation();

  

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
            
        if (!response.data) {
          console.error('Порожня відповідь або користувач не знайдений');
          return;
        }
    
        setUserData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          patronymic: response.data.middleName || '',
          theme: response.data.preferredTheme || 'light',
          language: response.data.preferredLanguage || 'ua',
          startPage: response.data.startPage || 'home',
          profilePic: response.data.profilePicUrl || null,
        });
      } catch (err) {
        console.error('Не вдалося завантажити дані профілю', err);
      }
    };
    

    if (token) {
      fetchUserData();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      if (files && files.length > 0) {
        setUserData({ ...userData, profilePic: URL.createObjectURL(files[0]) });
        handlePhotoUpload(files[0]);
      }
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = buildProfileUpdateDto(userData);
      await axios.put('/api/profile', updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Дані успішно оновлено');
    } catch (err) {
      console.error('Помилка при збереженні профілю', err);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Паролі не співпадають');
      return;
    }
    try {
      await axios.put('/api/profile/password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Пароль успішно змінено');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Помилка зміни пароля', err);
    }
  };

  const handlePhotoUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/api/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Фото завантажено успішно');
    } catch (err) {
      console.error('Помилка завантаження фото', err);
    }
  };

  return (
    <div className="profile-page">
      <h2>{t('user_profile')}</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>{t('first_name')}:</label>
          <input name="firstName" value={userData.firstName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>{t('last_name')}:</label>
          <input name="lastName" value={userData.lastName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>{t('patronymic')}:</label>
          <input name="patronymic" value={userData.patronymic} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>{t('profile_picture')}:</label>
          <input type="file" name="profilePic" accept="image/*" onChange={handleChange} />
          {userData.profilePic && (
            <>
              <p>{t('profile_preview')}:</p>
              <img src={userData.profilePic} alt="Profile Preview" className="preview-img" />
            </>
          )}
        </div>

        <div className="form-group">
          <label>{t('old_password')}:</label>
          <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} />

          <label>{t('new_password')}:</label>
          <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />

          <label>{t('confirm_password')}:</label>
          <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} />

          <button type="button" onClick={handleChangePassword} className="save-btn">
            {t('change_password')}
          </button>
        </div>

        <div className="form-group">
          <label>{t('default_theme')}:</label>
          <select name="theme" value={userData.theme} onChange={handleChange}>
            <option value="light">{t('switch_to_light')}</option>
            <option value="dark">{t('switch_to_dark')}</option>
          </select>
        </div>

        <div className="form-group">
          <label>{t('interface_language')}:</label>
          <select name="language" value={userData.language} onChange={handleChange}>
            <option value="ua">Українська</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="form-group">
          <label>{t('start_page')}:</label>
          <select name="startPage" value={userData.startPage} onChange={handleChange}>
            <option value="home">{t('home')}</option>
            <option value="income_expense">{t('income_expense')}</option>
            <option value="analytics">{t('analytics')}</option>
            <option value="calculator">{t('calculator')}</option>
            <option value="markets">{t('markets')}</option>
          </select>
        </div>

        <button type="submit" className="save-btn">{t('save_changes')}</button>
      </form>
    </div>
  );
};

export default ProfilePage;
