import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CartPopup({ cart, onClose, onTambah, onKurangi }) {
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleBayar = () => {
    if (cart.length === 0) return alert('Keranjang kosong!');
    onClose();
    navigate('/bayar', { state: { cart } });
  };

  return (
    <div className="position-fixed top-0 end-0 bg-white border shadow p-3"
      style={{ width: '300px', height: '100vh', zIndex: 1000, overflowY: 'auto' }}>
      <h5 className="mb-3">🛒 Keranjang</h5>

      {cart.length === 0 ? (
        <p className="text-muted">Keranjang masih kosong</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map(item => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                <div className="me-2" style={{ flex: 1 }}>
                  <div>{item.name}</div>
                  <div className="d-flex align-items-center mt-1">
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => onKurangi(item.id)}
                    >-</button>
                    <span>{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-success ms-2"
                      onClick={() => onTambah(item)}
                    >+</button>
                  </div>
                </div>
                <div style={{ minWidth: '80px', textAlign: 'right' }}>
                  Rp {parseInt(item.price * item.quantity).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>

          <p><strong>Total:</strong> Rp {parseInt(total).toLocaleString()}</p>
          <button className="btn btn-success w-100 mb-2" onClick={handleBayar}>Checkout</button>
        </>
      )}

      <button className="btn btn-secondary w-100" onClick={onClose}>Tutup</button>
    </div>
  );
}
