const express = require('express');
const router = express.Router();
const db = require('../config/db');
require('../config/mongodb');
const OrderHistory = require('../models/OrderHistory');
const { fork } = require('child_process'); // ✅ Tambahan untuk Worker

// Tambah pesanan
router.post('/', (req, res) => {
  const { user_name, payment_method, items } = req.body;

  if (!user_name || !payment_method || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const total_price = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const insertOrderSQL = 'INSERT INTO orders (user_name, payment_method, total_price) VALUES (?, ?, ?)';
  db.query(insertOrderSQL, [user_name, payment_method, total_price], (err, result) => {
    if (err) {
      console.error("❌ Gagal simpan orders:", err);
      return res.status(500).json({ message: 'Gagal menyimpan pesanan utama' });
    }

    const orderId = result.insertId;
    const detailValues = items.map(item => [
      orderId,
      item.name,
      item.quantity,
      item.price * item.quantity
    ]);

    const insertDetailSQL = 'INSERT INTO order_details (order_id, product_name, quantity, subtotal) VALUES ?';
    db.query(insertDetailSQL, [detailValues], async (err2) => {
      if (err2) {
        console.error("❌ Gagal simpan order_details:", err2);
        return res.status(500).json({ message: 'Gagal menyimpan detail pesanan' });
      }

      // ✅ Kirim ke Worker (child process)
      const worker = fork('./workers/saveHistoryWorker.js');
      worker.send({
        user_name,
        payment_method,
        total_price,
        orders: items.map(item => ({
          product_name: item.name,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        })),
        created_at: new Date()
      });

      res.status(201).json({ message: 'Pembayaran berhasil', orderId });
    });
  });
});

// Income harian
router.get('/income/daily', (req, res) => {
  const sql = `
    SELECT DATE(created_at) AS date, SUM(total_price) AS total
    FROM orders
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('❌ Gagal ambil laporan harian:', err);
      return res.status(500).json({ message: 'Gagal ambil laporan harian' });
    }
    res.json(result);
  });
});

// Income bulanan
router.get('/income/monthly', (req, res) => {
  const sql = `
    SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(total_price) AS total
    FROM orders
    GROUP BY month
    ORDER BY month DESC
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('❌ Gagal ambil laporan bulanan:', err);
      return res.status(500).json({ message: 'Gagal ambil laporan bulanan' });
    }
    res.json(result);
  });
});

// Admin - semua pembelian
router.get('/purchases', (req, res) => {
  const { date } = req.query;
  let sql = `
    SELECT o.user_name, d.product_name, d.quantity, d.subtotal, o.created_at
    FROM orders o
    JOIN order_details d ON o.id = d.order_id
  `;
  const params = [];

  if (date) {
    sql += ' WHERE DATE(o.created_at) = ?';
    params.push(date);
  }

  sql += ' ORDER BY o.created_at DESC';

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('❌ Gagal ambil data pembelian:', err);
      return res.status(500).json({ message: 'Gagal ambil data pembelian' });
    }
    res.json(result);
  });
});

// Riwayat pembelian user
router.get('/history/:username', async (req, res) => {
  try {
    const data = await OrderHistory.find({ user_name: req.params.username }).sort({ created_at: -1 });
    res.json(data);
  } catch (err) {
    console.error('❌ Gagal ambil riwayat dari MongoDB:', err);
    res.status(500).json({ message: 'Gagal ambil data riwayat' });
  }
});

// GET /api/orders/admin/history/:username → Riwayat per user untuk admin
router.get('/admin/history/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const history = await OrderHistory.find({ user_name: username }).sort({ created_at: -1 });
    res.json(history);
  } catch (err) {
    console.error('❌ Admin gagal ambil riwayat:', err);
    res.status(500).json({ message: 'Gagal ambil riwayat user' });
  }
});


module.exports = router;
