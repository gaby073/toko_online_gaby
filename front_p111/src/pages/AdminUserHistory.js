import React, { useState } from 'react';
import axios from 'axios';

export default function AdminUserHistory() {
  const [username, setUsername] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!username) {
      alert('Masukkan username terlebih dahulu!');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/orders/history/${username}`);
      setHistory(res.data);
    } catch (err) {
      alert('Gagal ambil riwayat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h4>🔎 Cek Riwayat Pembelian User</h4>
      <input
        className="form-control mb-2"
        placeholder="Masukkan Username (misalnya: ruth)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button className="btn btn-primary mb-3" onClick={fetchHistory} disabled={loading}>
        {loading ? 'Mengambil data...' : 'Lihat Riwayat'}
      </button>

      {history.length === 0 && !loading && (
        <p className="text-muted">Tidak ada riwayat ditemukan untuk user ini.</p>
      )}

      {history.map((order, i) => (
        <div key={i} className="card mb-3">
          <div className="card-body">
            <p><strong>Tanggal:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <p><strong>Metode Pembayaran:</strong> {order.payment_method}</p>
            <ul>
              {order.orders.map((item, j) => (
                <li key={j}>
                  {item.product_name} x {item.quantity} - Rp {item.subtotal.toLocaleString()}
                </li>
              ))}
            </ul>
            <p><strong>Total:</strong> Rp {order.total_price.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
