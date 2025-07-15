import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NavbarAdmin() {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <span className="navbar-brand">🛒 Admin Panel</span>
      <div className="ms-auto">
        <button className="btn btn-outline-light me-2" onClick={() => navigate('/')}>
          🏠 Produk
        </button>
        <button className="btn btn-outline-light me-2" onClick={() => navigate('/admin')}>
          📦 Dashboard
        </button>
        <button className="btn btn-outline-light" onClick={() => navigate('/admin/history')}>
          📜 Riwayat User
        </button>
      </div>
    </nav>
  );
}
