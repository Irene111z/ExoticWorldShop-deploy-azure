import React, { useState, useEffect, useRef, useContext } from 'react';
import { fetchUserProfile, updateUserProfile } from '../../http/userAPI';
import './UserProfile.css'
import {Context} from '../../index'
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const {user} = useContext(Context)
  const navigate = useNavigate();
  const logout = () =>{
    user.setUser({})
    user.setIsAuth(false)
    localStorage.removeItem('token');
    navigate('/');
  }

  const [userData, setUserData] = useState({
    name: '',
    lastname: '',
    phone: '',
    email: '',
    delivery_info: '',
    img: '',
  });
  const [imgFile, setImgFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUserData({
          name: profile.name || '',
          lastname: profile.lastname || '',
          phone: profile.phone || '',
          email: profile.email || '',
          delivery_info: profile.delivery_info || '',
          img: profile.img || '',
        });
        setPreviewUrl(profile.img || '');
      } catch (error) {
        console.error('Помилка завантаження профілю:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImgFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('Будь ласка, виберіть зображення');
    }
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('lastname', userData.lastname);
    formData.append('phone', userData.phone);
    formData.append('email', userData.email);
    formData.append('delivery_info', userData.delivery_info);
    if (imgFile) {
      formData.append('img', imgFile);
    }

    try {
      const updated = await updateUserProfile(formData);
      setUserData((prev) => ({ ...prev, img: updated.img }));
      setPreviewUrl(updated.img);
      setIsEditing(false);
      alert('Профіль оновлено');
    } catch (error) {
      console.error('Помилка оновлення профілю:', error);
      alert('Не вдалося оновити профіль');
    }
  };

  return loading ? (
    <div>Завантаження профілю...</div>
  ) : (
    <div className="container-fluid container-xxl">
      <div className="d-flex flex-column">
        <form onSubmit={handleSubmit} className='user-profile-form mt-4'>
          <div className="d-flex mb-3 flex-row-reverse user-profile-icons">
            <img src="/static/edit-icon-white.svg" alt="" className='edit-profile-icon' onClick={() => setIsEditing(true)}/>
            <img src="/static/log-out-icon.svg" className='edit-profile-icon me-3' alt="" onClick={()=>logout()}/>
          </div>
          <div className='text-center'>
            <img
              src={previewUrl}
              alt="img"
              onClick={handleAvatarClick}
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '50%',
                cursor: isEditing ? 'pointer' : 'default',
                marginBottom: '1.5rem',
              }}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="d-flex">
            <div className='d-flex flex-column me-3'>
              <label>Прізвище:</label>
              <input
                type="text"
                name="lastname"
                value={userData.lastname}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className='d-flex flex-column'>
              <label className=''>Ім'я:</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className='d-flex flex-column'>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className='d-flex flex-column'>
            <label>Телефон:</label>
            <input
              type="tel"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className='d-flex flex-column'>
            <label>Адреса доставки:</label>
            <input
              type="text"
              name="delivery_info"
              value={userData.delivery_info}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          {isEditing ? (
            <div>
              <button type="submit" className='btn-save-profile-changes mt-2'>Зберегти</button>
            </div>
          ) : (
            <span></span>
          )}
        </form>
      </div>
      <div className="d-flex flex-column">

      </div>
    </div>
  );
};

export default UserProfile;
