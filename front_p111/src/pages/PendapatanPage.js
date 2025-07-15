import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PendapatanPage() {
  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const d = await axios.get('http://localhost:5000/api/orders/income/daily');
      const m = await axios.get('http://localhost:5000/api/orders/income/monthly');
      setDaily(d.data);
      setMonthly(m.data);
    };
    fetch();
  }, []);

  return (
    <div className="container mt-4">
      <h4>📅 Pendapatan Harian</h4>
      <table className="table table-bordered">
        <thead><tr><th>Tanggal</th><th>Total</th></tr></thead>
        <tbody>
          {daily.map((d, i) => (
            <tr key={i}><td>{d.date}</td><td>Rp {parseInt(d.total).toLocaleString()}</td></tr>
          ))}
        </tbody>
      </table>

      <h4>🗓️ Pendapatan Bulanan</h4>
      <table className="table table-bordered">
        <thead><tr><th>Bulan</th><th>Total</th></tr></thead>
        <tbody>
          {monthly.map((m, i) => (
            <tr key={i}><td>{m.month}</td><td>Rp {parseInt(m.total).toLocaleString()}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
