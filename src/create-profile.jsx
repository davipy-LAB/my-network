import React, { useState } from 'react';
import './create-profile.css';

function CreateProfile() {
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

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
      })
      .catch(err => console.error(err));
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
        <div className='container'>
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

            {profilePic && (
              <p className="file-name">{profilePic.name}</p>
            )}

            <button type="submit">Save User</button>
          </form>
        </div>
        <p>Once you have created your profile, you can access your account.</p>
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
