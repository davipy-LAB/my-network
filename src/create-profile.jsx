import React, { useState } from 'react';

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
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Foto de Perfil:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files[0])}
        />

        <button type="submit">Salvar Perfil</button>
      </form>
    </div>
  );
}

export default CreateProfile;
