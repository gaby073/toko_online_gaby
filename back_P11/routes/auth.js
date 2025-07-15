const express = require('express');
const router = express.Router();
const db = require('../config/db'); // koneksi ke MySQL
const bcrypt = require('bcrypt');

// ✅ REGISTER
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validasi input
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi!' });
  }

  try {
    // Cek apakah username atau email sudah digunakan
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, results) => {
      if (err) {
        console.error('❌ Error cek user:', err);
        return res.status(500).json({ message: 'Database error saat cek user' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Username atau email sudah digunakan' });
      }

      // Enkripsi password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simpan user
      db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (err2) => {
          if (err2) {
            console.error('❌ Error simpan user:', err2);
            return res.status(500).json({ message: 'Gagal menyimpan user' });
          }
          res.status(201).json({ message: 'Registrasi berhasil!' });
        }
      );
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ LOGIN
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi!' });
  }

  // Cari user
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error('❌ Login error:', err);
      return res.status(500).json({ message: 'Server error saat login' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }

    const user = results[0];

    // Verifikasi password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Password salah' });

    res.json({ message: 'Login berhasil', username: user.username });
  });
});

module.exports = router;
