import React, { useState } from 'react';
import './create-profile.css'; // Importe o CSS para estilizar o componente

function CreateProfile() {
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('profilePic', profilePic);

    fetch('http://localhost:3001/api/create-profile', {
      method: 'POST',
      body: formData,
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      // Após o cadastro do perfil, você pode redirecionar para outra página ou mostrar uma mensagem de sucesso
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="create-profile">
      <h2>Criar Perfil</h2>
      <div className='container'>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="profilePic" className="file-label">Foto de Perfil:</label>
        <input
          id="profilePic"
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files[0])}
          className="hidden-file"
        />
        {profilePic && (
          <p className="file-name">{profilePic.name}</p>
        )}
        <button type="submit">Salvar Perfil</button>
      </form>
      </div>
      <p>Após criar o perfil, você poderá acessar sua conta.</p>
    </div>
  );
}

export default CreateProfile;
