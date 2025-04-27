import React, { useState, useEffect } from 'react';
import axios from "../api/axios";
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

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/profile');
        setUserData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          patronymic: response.data.patronymic || '',
          theme: response.data.theme || 'light',
          language: response.data.language || 'ua',
          startPage: response.data.startPage || 'home',
          profilePic: response.data.profilePicUrl || null,
        });
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      setUserData({ ...userData, profilePic: URL.createObjectURL(files[0]) });
      handlePhotoUpload(files[0]);
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
      const updatedData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        patronymic: userData.patronymic,
        theme: userData.theme,
        language: userData.language,
        startPage: userData.startPage,
      };
      await axios.put('/api/profile', updatedData);
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
      });
      alert('Пароль змінено');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Помилка зміни паролю', err);
    }
  };

  const handlePhotoUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Фото завантажено:', res.data);
    } catch (err) {
      console.error('Не вдалося завантажити фото', err);
    }
  };

  return (
    <div className="profile-page">
      <h2>Профіль користувача</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Ім’я:</label>
          <input name="firstName" value={userData.firstName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Прізвище:</label>
          <input name="lastName" value={userData.lastName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>По батькові:</label>
          <input name="patronymic" value={userData.patronymic} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Фото профілю:</label>
          <input type="file" name="profilePic" accept="image/*" onChange={handleChange} />
          {userData.profilePic && <img src={userData.profilePic} alt="Profile Preview" className="preview-img" />}
        </div>

        <div className="form-group">
          <label>Старий пароль:</label>
          <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} />
          <label>Новий пароль:</label>
          <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />
          <label>Підтвердження пароля:</label>
          <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
          <button type="button" onClick={handleChangePassword} className="save-btn">Змінити пароль</button>
        </div>

        <div className="form-group">
          <label>Тема за замовчуванням:</label>
          <select name="theme" value={userData.theme} onChange={handleChange}>
            <option value="light">Світла</option>
            <option value="dark">Темна</option>
          </select>
        </div>

        <div className="form-group">
          <label>Мова інтерфейсу:</label>
          <select name="language" value={userData.language} onChange={handleChange}>
            <option value="ua">Українська</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="form-group">
          <label>Стартова сторінка:</label>
          <select name="startPage" value={userData.startPage} onChange={handleChange}>
            <option value="home">Головна</option>
            <option value="income_expense">Доходи/Витрати</option>
            <option value="analytics">Аналітика</option>
            <option value="calculator">Калькулятор</option>
            <option value="markets">Ринки</option>
          </select>
        </div>

        <button type="submit" className="save-btn">Зберегти зміни</button>
      </form>
    </div>
  );
};

export default ProfilePage;
