import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [user_name, setUserName] = useState(localStorage.getItem('username') || '');
  const [payment_method, setPaymentMethod] = useState('transfer');
  const [bank, setBank] = useState('');
  const [kodePembayaran, setKodePembayaran] = useState('');

  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const provinces = [
    'Aceh', 'Bali', 'Banten', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur',
    'DKI Jakarta', 'DI Yogyakarta', 'Sumatera Utara', 'Sumatera Barat',
    'Sumatera Selatan', 'Riau', 'Lampung', 'Kalimantan Barat', 'Kalimantan Timur',
    'Kalimantan Selatan', 'Sulawesi Utara', 'Sulawesi Selatan', 'Nusa Tenggara Barat',
    'Nusa Tenggara Timur'
  ];

  const cart = state?.cart || [];
  const total_price = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const generateKodePembayaran = (namaBank) => {
    const kode = Math.floor(100000000 + Math.random() * 900000000);
    setKodePembayaran(`${namaBank.toUpperCase()}-${kode}`);
  };

  const handleCheckout = async () => {
    if (!user_name || cart.length === 0 || !province || !city || !detailAddress || !postalCode) {
      alert('Semua data wajib diisi!');
      return;
    }

    const konfirmasi = window.confirm("Apakah Anda yakin ingin melanjutkan pembayaran?");
    if (!konfirmasi) return;

    const fullAddress = `${detailAddress}, ${city}, ${province}, ${postalCode}`;

    const payload = {
      user_name,
      payment_method,
      items: cart,
    };

    try {
      await axios.post('http://localhost:5000/api/orders', payload);
      alert('Pembayaran berhasil!');
      navigate('/struk', {
        state: {
          user_name,
          payment_method,
          cart,
          total_price,
          bank,
          kode_pembayaran: kodePembayaran,
          address: fullAddress
        }
      });
    } catch (err) {
      console.error('Error saat checkout:', err);
      alert('Gagal bayar!');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: '500px' }}>
        <h4 className="text-center mb-3">Pembayaran</h4>

        <input
          className="form-control mb-3"
          placeholder="Nama Anda"
          value={user_name}
          onChange={e => setUserName(e.target.value)}
          readOnly
        />

        <h5>📍 Alamat Pengiriman:</h5>

        <select
          className="form-select mb-2"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
        >
          <option value="">-- Pilih Provinsi --</option>
          {provinces.map((prov, i) => (
            <option key={i} value={prov}>{prov}</option>
          ))}
        </select>

        <input
          className="form-control mb-2"
          placeholder="Kabupaten/Kota"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Alamat Lengkap (Jalan/Nomor Rumah)"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
        />
        <input
          className="form-control mb-3"
          placeholder="Kode Pos"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />

        <select
          className="form-select mb-3"
          value={payment_method}
          onChange={e => {
            setPaymentMethod(e.target.value);
            setBank('');
            setKodePembayaran('');
          }}
        >
          <option value="transfer">Transfer</option>
          <option value="cod">COD</option>
        </select>

        {payment_method === 'transfer' && (
          <div className="mb-3">
            <label>Pilih Bank:</label>
            <select
              className="form-select"
              value={bank}
              onChange={(e) => {
                setBank(e.target.value);
                generateKodePembayaran(e.target.value);
              }}
            >
              <option value="">-- Pilih Bank --</option>
              <option value="BNI">BNI</option>
              <option value="BCA">BCA</option>
              <option value="MANDIRI">Mandiri</option>
            </select>

            {bank && (
              <div className="mt-2">
                <p><strong>Kode Pembayaran:</strong> {kodePembayaran}</p>
              </div>
            )}
          </div>
        )}

        <h5>🛒 Ringkasan Pembelian:</h5>
        <ul className="list-group mb-3">
          {cart.map((item) => (
            <li key={item.id} className="list-group-item d-flex align-items-center">
              <img src={item.image_url} alt={item.name} width="50" className="me-3" />
              <div className="flex-grow-1">
                {item.name} x {item.quantity}
              </div>
              <span>Rp {parseInt(item.price * item.quantity).toLocaleString()}</span>
            </li>
          ))}
        </ul>

        <h5>Total: Rp {parseInt(total_price).toLocaleString()}</h5>

        <button className="btn btn-success w-100 mt-3" onClick={handleCheckout}>
          Checkout
        </button>

        <button className="btn btn-outline-secondary w-100 mt-2" onClick={() => navigate('/produk')}>
          ⬅️ Kembali ke Produk
        </button>
      </div>
    </div>
  );
}
