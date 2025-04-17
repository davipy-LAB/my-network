import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './create-profile.css';

function CreateProfile() {
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const email = localStorage.getItem('emailTemp');
  const senha = localStorage.getItem('senhaTemp');
  const username = localStorage.getItem('usernameTemp'); // Recupera o username do localStorage

  useEffect(() => {
    if (!email || !senha) {
      navigate('/login');
    }
  }, [email, senha, navigate]);

  if (!email || !senha) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('https://networq-wv7c.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: senha }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          const userId = data.user.id;

          const formData = new FormData();
          formData.append('userId', userId);
          formData.append('username', username); // Usa o username já salvo
          if (profilePic) formData.append('profilePic', profilePic);

          fetch('https://networq-wv7c.onrender.com/api/create-profile', {
            method: 'POST',
            body: formData,
          })
            .then(res => res.json())
            .then(profileData => {
              localStorage.setItem('username', username);
              localStorage.setItem('userId', userId);

              if (profilePic) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  localStorage.setItem('profilePic', reader.result);
                  navigate('/mainpage');
                };
                reader.readAsDataURL(profilePic);
              } else {
                navigate('/mainpage');
              }
            })
            .catch(err => console.error('Erro ao criar o perfil:', err));
        }
      })
      .catch(err => console.error('Erro ao fazer login:', err));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="create-profile-wrapper">
      <div className="create-profile">
        <h2>Create Profile</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="profilePic" className="file-label">User Photo:</label>
          <input id="profilePic" type="file" accept="image/*" onChange={handleImageChange} className="hidden-file" />
          {profilePic && <p className="file-name">{profilePic.name}</p>}

          <button type="submit">Save User</button>
        </form>
      </div>

      {preview && (
        <div className="preview-outside">
          <img src={preview} alt="Preview" className="preview-image" />
        </div>
      )}
    </div>
  );
}

export default CreateProfile;