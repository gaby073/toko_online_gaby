const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST /api/feedback - Simpan feedback user
router.post('/', async (req, res) => {
  const { user_name, message } = req.body;

  if (!user_name || !message) {
    return res.status(400).json({ message: 'Nama dan pesan wajib diisi!' });
  }

  try {
    const feedback = await Feedback.create({ user_name, message });
    res.status(201).json({ message: 'Feedback dikirim', feedback });
  } catch (err) {
    console.error('❌ Gagal simpan feedback:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// GET /api/feedback - Ambil semua feedback (opsional)
router.get('/', async (req, res) => {
  try {
    const data = await Feedback.find().sort({ created_at: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil data' });
  }
});

module.exports = router;
