import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileDropdown() {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Apakah Anda ingin logout?');
    if (confirmLogout) {
      localStorage.removeItem('username');
      navigate('/login');
    }
  };

  if (!username) return null;

  return (
    <div style={{ position: 'fixed', top: 15, right: 20, zIndex: 999 }}>
      <div className="dropdown">
        <button
          className="btn btn-outline-secondary dropdown-toggle"
          onClick={() => setShowMenu(!showMenu)}
        >
          👤 {username}
        </button>
        {showMenu && (
          <ul className="dropdown-menu show" style={{ position: 'absolute', top: '100%', right: 0 }}>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                🚪 Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
