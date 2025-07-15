import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrderHistoryUser() {
  const [history, setHistory] = useState([]);

  // Ambil username dari localStorage
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      console.warn("Tidak ada username yang login.");
      return;
    }

    axios.get(`http://localhost:5000/api/orders/history/${username}`)
      .then(res => setHistory(res.data))
      .catch(err => console.error('Gagal ambil riwayat:', err));
  }, [username]);

  return (
    <div className="container mt-4">
      <h4>📜 Riwayat Pembelian {username}</h4>

      {history.length === 0 ? (
        <p>Tidak ada riwayat pembelian.</p>
      ) : (
        history.map((order, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <p><strong>Tanggal:</strong> {order.created_at ? new Date(order.created_at).toLocaleString() : 'Tidak diketahui'}</p>
              <p><strong>Metode Pembayaran:</strong> {order.payment_method}</p>
              <ul>
                {order.orders.map((item, i) => (
                  <li key={i}>
                    {item.product_name} x {item.quantity} - Rp {parseInt(item.subtotal).toLocaleString()}
                  </li>
                ))}
              </ul>
              <strong>Total: Rp {parseInt(order.total_price).toLocaleString()}</strong>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
