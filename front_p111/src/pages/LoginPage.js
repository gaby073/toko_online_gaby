import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      alert('Username dan password wajib diisi!');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);

      // ✅ Simpan username ke localStorage
      localStorage.setItem('username', res.data.username);
      console.log('Username disimpan:', localStorage.getItem('username'));

      alert('Login berhasil!');
      navigate('/produk'); // arahkan ke halaman produk setelah login
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Login gagal!');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="text-center mb-4">🔐 Login</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
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
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>

      {/* 🔽 Link ke register */}
      <div className="text-center mt-3">
        <p>Belum punya akun? <Link to="/register">Sign up</Link></p>
      </div>
    </div>
  );
}
