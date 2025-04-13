import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      setUserData({ ...userData, profilePic: URL.createObjectURL(files[0]) });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saved user data:', userData);
    // Тут можна зробити запит на бекенд для збереження
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
          <label>Зміна пароля:</label>
          <input type="password" placeholder="Старий пароль" />
          <input type="password" placeholder="Новий пароль" />
          <input type="password" placeholder="Підтвердження пароля" />
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
