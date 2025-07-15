import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PembelianPage() {
  const [purchases, setPurchases] = useState([]);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get('http://localhost:5000/api/orders/purchases', {
        params: filterDate ? { date: filterDate } : {}
      });
      setPurchases(res.data);
    };
    fetch();
  }, [filterDate]);

  return (
    <div className="container mt-4">
      <h4>📄 Data Pembelian</h4>
      <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="form-control mb-3" style={{ maxWidth: '200px' }} />
      <table className="table table-bordered">
        <thead><tr><th>User</th><th>Produk</th><th>Qty</th><th>Subtotal</th><th>Tanggal</th></tr></thead>
        <tbody>
          {purchases.map((p, i) => (
            <tr key={i}>
              <td>{p.user_name}</td>
              <td>{p.product_name}</td>
              <td>{p.quantity}</td>
              <td>Rp {parseInt(p.subtotal).toLocaleString()}</td>
              <td>{p.created_at.split('T')[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
