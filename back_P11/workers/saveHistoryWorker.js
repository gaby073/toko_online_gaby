const mongoose = require('../config/mongodb'); // pastikan path sesuai
const OrderHistory = require('../models/OrderHistory');

process.on('message', async (data) => {
  try {
    await OrderHistory.create(data);
    console.log('✅ Worker berhasil simpan riwayat');
    process.exit(0);
  } catch (err) {
    console.error('❌ Worker gagal simpan ke MongoDB:', err);
    process.exit(1);
  }
});
