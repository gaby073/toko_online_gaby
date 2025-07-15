import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RiwayatSidebar({ username }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (username) {
      axios.get(`http://localhost:5000/api/orders/history/${username}`)
        .then(res => setHistory(res.data));
    }
  }, [username]);

  return (
    <div>
      <h6>📜 Riwayat Pembelian</h6>
      {history.length === 0 ? (
        <p>(Belum ada)</p>
      ) : (
        history.map((order, i) => (
          <div key={i} className="border p-2 mb-2 bg-light">
            <p className="mb-1"><strong>{new Date(order.created_at).toLocaleDateString()}</strong></p>
            <ul className="mb-1">
              {order.orders.map((item, j) => (
                <li key={j}>{item.product_name} x {item.quantity}</li>
              ))}
            </ul>
            <small>Total: Rp {order.total_price.toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}
