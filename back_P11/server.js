const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB
require('./config/mongodb'); // Pastikan file ./config/mongodb.js sudah ada dan koneksi berhasil

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/feedback', require('./routes/feedback')); // <-- Pastikan nama file-nya lowercase "feedback.js"
app.use('/api/auth', require('./routes/auth'));


app.get('/', (req, res) => {
  res.send('🟢 Toko Online Backend Ready');
});

// Jalankan server
app.listen(5000, () => {
  console.log('✅ Backend running at http://localhost:5000');
});
