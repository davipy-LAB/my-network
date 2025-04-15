import React, { useEffect, useState } from 'react';
import './mainpage.css';

function MainPage() {
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    // Recuperar os dados do localStorage
    const storedUsername = localStorage.getItem('username');
    const storedProfilePic = localStorage.getItem('profilePic');

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedProfilePic) {
      setProfilePic(storedProfilePic); // A imagem estará em base64
    }
  }, []);

  return (
    <div className="mainpage-wrapper">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>NetworQ</h2>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-profile">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="sidebar-profile-pic" />
            ) : (
              <div className="sidebar-no-profile-pic">No Profile Picture</div>
            )}
            <h3>{username}</h3>
          </div>
          <div className="sidebar-links">
            <a href="#">Home</a>
            <a href="#">Messages</a>
            <a href="#">Notifications</a>
            <a href="#">Settings</a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h2>Welcome to NetworQ, {username}!</h2>
          <button className="create-post-btn">Create Post</button>
        </div>
        
        {/* Feed */}
        <div className="feed">
          <div className="post">
            <div className="post-header">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="post-profile-pic" />
              ) : (
                <div className="post-no-profile-pic">No Profile</div>
              )}
              <h4>{username}</h4>
            </div>
            <p>This is a sample post content.</p>
            <div className="post-actions">
              <button>Like</button>
              <button>Comment</button>
              <button>Share</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
