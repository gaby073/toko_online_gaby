import React, { useState } from 'react';
import axios from 'axios';

export default function UserHistoryPage() {
  const [username, setUsername] = useState('');
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/admin/history/${username}`);
      setHistory(res.data);
    } catch {
      alert('Gagal mengambil riwayat');
    }
  };

  return (
    <div className="container mt-4">
      <h4>🔎 Riwayat Pembelian User</h4>
      <input
        placeholder="Masukkan Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="form-control mb-2"
      />
      <button className="btn btn-primary mb-3" onClick={fetchHistory}>Cari</button>
      {history.map((h, i) => (
        <div className="card mb-2" key={i}>
          <div className="card-body">
            <p><strong>Tanggal:</strong> {new Date(h.created_at).toLocaleString()}</p>
            <ul>
              {h.orders.map((item, j) => (
                <li key={j}>{item.product_name} x {item.quantity} - Rp {item.subtotal.toLocaleString()}</li>
              ))}
            </ul>
            <p><strong>Total:</strong> Rp {h.total_price.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
