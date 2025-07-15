import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ReceiptPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <p>Tidak ada data pembayaran.</p>;

  const {
    user_name,
    payment_method,
    cart,
    total_price,
    bank,
    kode_pembayaran,
    address
  } = state;

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: '600px' }}>
        <h4 className="text-center mb-3">🧾 Struk Pembayaran</h4>

        <p><strong>Nama:</strong> {user_name}</p>
        <p><strong>Metode Pembayaran:</strong> {payment_method}</p>

        {payment_method === 'transfer' && (
          <>
            <p><strong>Bank:</strong> {bank}</p>
            <p><strong>Kode Pembayaran:</strong> {kode_pembayaran}</p>
          </>
        )}

        {address && (
          <p><strong>Alamat Pengiriman:</strong> {address}</p>
        )}

        <p><strong>Daftar Produk:</strong></p>
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

        <div className="text-center mt-4">
          <h6 className="text-success">✅ Terima kasih telah berbelanja di <strong>GT</strong>!</h6>
        </div>

        <button className="btn btn-primary mt-3" onClick={() => navigate('/produk')}>
  ⬅️ Kembali ke Produk
</button>

      </div>
    </div>

          
  );
}
