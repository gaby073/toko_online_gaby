const express = require('express');
const router = express.Router();
const db = require('../config/db');
 // koneksi database (pastikan file db.js ada)

router.get('/', (req, res) => {
  const sort = req.query.sort === 'desc' ? 'DESC' : 'ASC';
  const sql = `SELECT * FROM products ORDER BY price ${sort}`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Failed to fetch products' });
    }
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { name, price, image_url } = req.body;
  const sql = 'INSERT INTO products (name, price, image_url) VALUES (?, ?, ?)';
  db.query(sql, [name, price, image_url], (err, result) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).json({ message: 'Failed to add product' });
    }
    res.json({ message: 'Product added', id: result.insertId });
  });
});

router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Failed to delete product' });
    }
    res.json({ message: 'Product deleted' });
  });
});

// PUT /api/products/:id → Update produk
router.put('/:id', (req, res) => {
  const { name, price, image_url } = req.body;
  const { id } = req.params;

  console.log("✅ PUT route aktif. ID:", id); // Debug log
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Tambahan untuk caching
let productCache = null;
let lastFetched = 0;
const CACHE_DURATION = 1000 * 60 * 5; // 5 menit

// GET Produk dengan Caching
router.get('/', (req, res) => {
  const sort = req.query.sort === 'desc' ? 'DESC' : 'ASC';
  const now = Date.now();

  // ✅ Jika cache masih valid
  if (productCache && now - lastFetched < CACHE_DURATION) {
    console.log('📦 Produk dari cache');
    return res.json(productCache);
  }

  // 🔁 Query database jika cache sudah kadaluarsa
  const sql = `SELECT * FROM products ORDER BY price ${sort}`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Failed to fetch products' });
    }

    productCache = results;      // ✅ Simpan cache baru
    lastFetched = now;
    console.log('🛒 Produk dari database');
    res.json(results);
  });
});

// POST Produk
router.post('/', (req, res) => {
  const { name, price, image_url } = req.body;
  const sql = 'INSERT INTO products (name, price, image_url) VALUES (?, ?, ?)';
  db.query(sql, [name, price, image_url], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to add product' });
    }

    // ✅ Invalidate cache karena ada produk baru
    productCache = null;
    res.json({ message: 'Product added', id: result.insertId });
  });
});

// DELETE Produk
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Failed to delete product' });
    }

    // ✅ Invalidate cache
    productCache = null;
    res.json({ message: 'Product deleted' });
  });
});

// PUT Produk (Update)
router.put('/:id', (req, res) => {
  const { name, price, image_url } = req.body;
  const { id } = req.params;

  console.log("✅ PUT route aktif. ID:", id);

  db.query(
    'UPDATE products SET name=?, price=?, image_url=? WHERE id=?',
    [name, price, image_url, id],
    (err, result) => {
      if (err) {
        console.error('Gagal update produk:', err);
        return res.status(500).json({ message: 'Gagal update produk' });
      }

      // ✅ Invalidate cache
      productCache = null;
      res.json({ message: 'Produk berhasil diperbarui' });
    }
  );
});

module.exports = router;

  db.query(
    'UPDATE products SET name=?, price=?, image_url=? WHERE id=?',
    [name, price, image_url, id],
    (err, result) => {
      if (err) {
        console.error('Gagal update produk:', err);
        return res.status(500).json({ message: 'Gagal update produk' });
      }

      res.json({ message: 'Produk berhasil diperbarui' });
    }
  );
});



module.exports = router;
