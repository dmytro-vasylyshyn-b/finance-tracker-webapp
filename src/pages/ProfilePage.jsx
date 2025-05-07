import React, { useState, useEffect, useRef, useContext } from 'react';
import { PreferencesContext } from '../context/PreferencesContext';
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
  const { t } = useTranslation();
  const { setTheme, setLanguage, savePreferences } = useContext(PreferencesContext);

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const fileInputRef = useRef(null);

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

        const imgPath = response.data.profileImagePath;
        if (imgPath) {
          const fullUrl = `http://localhost:8080${imgPath}`;
          setPreviewUrl(fullUrl);
        }        

      } catch (err) {
        console.error('Не вдалося завантажити дані профілю', err);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
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
      await savePreferences({
        theme: userData.theme,
        language: userData.language,
      });
  
      setTheme(userData.theme);
      setLanguage(userData.language);
      console.log
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

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedPhotoFile) return;

    const formData = new FormData();
    formData.append('file', selectedPhotoFile);

    try {
      await axios.post('/api/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Фото успішно завантажено');
    } catch (err) {
      console.error('Помилка завантаження фото', err);
    }
  };

  return (
    <div className={"profile-page"}>
      <div className={"profile-form-container"}>
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
  
          <div className="form-group full-width two-columns">
            <div className="password-column">
              <label>{t('old_password')}:</label>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
              />
  
              <label>{t('new_password')}:</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
  
              <label>{t('confirm_password')}:</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
  
              <button type="button" onClick={handleChangePassword} className="save-btn">
                {t('change_password')}
              </button>
            </div>
  
            <div className="photo-column">
              <label>{t('profile_picture')}:</label>
              <button type="button" onClick={handlePhotoClick} className="upload-btn">
                {t('choose_photo')}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileSelect}
              />
              {previewUrl && (
                <div className="photo-preview-wrapper">
                  <img src={previewUrl} className="circular-photo" alt="Preview" />
                  <button type="button" onClick={handlePhotoUpload} className="save-btn">
                    {t('save_photo')}
                  </button>
                </div>
              )}
            </div>
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
  
          <div className="form-group full-width">
            <label>{t('start_page')}:</label>
            <select name="startPage" value={userData.startPage} onChange={handleChange}>
              <option value="home">{t('home')}</option>
              <option value="income_expense">{t('income_expense')}</option>
              <option value="analytics">{t('analytics')}</option>
              <option value="calculator">{t('calculator')}</option>
              <option value="markets">{t('markets')}</option>
            </select>
          </div>
  
          <div className="form-group full-width">
            <button type="submit" className="save-btn">{t('save_changes')}</button>
          </div>
        </form>
      </div>
    </div>
  );  
  
};

export default ProfilePage;
