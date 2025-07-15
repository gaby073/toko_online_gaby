import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi password
    if (form.password !== form.confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok!');
      return;
    }

    // Validasi semua field diisi
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      alert('Semua field wajib diisi!');
      return;
    }

    try {
      // Kirim data ke backend (gunakan "username" bukan "name")
      await axios.post('http://localhost:5000/api/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password
      });

      alert('Registrasi berhasil!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Registrasi gagal!');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="text-center mb-4">📝 Register</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          type="text"
          name="username"
          placeholder="Nama Lengkap"
          value={form.username}
          onChange={handleChange}
        />
        <input
          className="form-control mb-3"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="form-control mb-3"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <input
          className="form-control mb-3"
          type="password"
          name="confirmPassword"
          placeholder="Konfirmasi Password"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-primary w-100">Daftar</button>
      </form>

      {/* Link ke halaman login */}
      <div className="text-center mt-3">
        <p>Sudah punya akun? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
