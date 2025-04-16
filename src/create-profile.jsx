import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './create-profile.css';

function CreateProfile() {
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  // ✅ Primeiro recuperar email e senha
  const email = localStorage.getItem('emailTemp');
  const senha = localStorage.getItem('senhaTemp');

  // ✅ Agora sim pode verificar se existe
  if (!email || !senha) {
    navigate('/login');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ... resto do código segue igual ...


    // Autenticar usuário
    fetch('https://networq-wv7c.onrender.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password: senha }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          const userId = data.user.id; // Pega o ID do usuário autenticado

          // Criar o perfil
          const formData = new FormData();
          formData.append('userId', userId); // Enviar o userId
          formData.append('username', username);
          formData.append('profilePic', profilePic);

          fetch('https://networq-wv7c.onrender.com/api/create-profile', {
            method: 'POST',
            body: formData,
          })
            .then(res => res.json())
            .then(data => {
              console.log('Perfil criado:', data);

              // Armazenando os dados no localStorage após a criação do perfil
              localStorage.setItem('username', username);
              if (profilePic) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  localStorage.setItem('profilePic', reader.result); // Armazenando a imagem em base64
                };
                reader.readAsDataURL(profilePic); // Convertendo a imagem para base64
              }

              navigate('/mainpage'); // Redireciona para a mainpage
            })
            .catch(err => console.error('Erro ao criar o perfil:', err));
        }
      })
      .catch(err => console.error('Erro ao fazer login:', err));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  return (
    <div className="create-profile-wrapper">
      <div className="create-profile">
        <h2>Create Profile</h2>
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="profilePic" className="file-label">User Photo:</label>
          <input
            id="profilePic"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden-file"
          />

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
