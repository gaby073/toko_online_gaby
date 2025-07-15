import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from '../components/ProfileDropdown';
import RiwayatSidebar from '../components/RiwayatSidebar';
import FeedbackSidebar from '../components/FeedbackSidebar';
import CartPopup from '../components/CartPopup';

export default function ProductListUser() {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('asc');
  const [cart, setCart] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products?sort=${sort}`)
      .then(res => setProducts(res.data));
  }, [sort]);

  const tambahKeKeranjang = (product) => {
    const sudahAda = cart.find(item => item.id === product.id);
    if (sudahAda) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const kurangiJumlah = (id) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    ));
  };

  const handleBayar = () => {
    if (cart.length === 0) {
      alert('Keranjang masih kosong!');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = (jawaban) => {
    setShowConfirm(false);
    if (jawaban === 'ya') {
      navigate('/bayar', { state: { cart } });
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar kiri */}
      <div className="p-3 border-end" style={{ width: '300px', height: '100vh', overflowY: 'auto' }}>
        <RiwayatSidebar username={username} />
        <hr />
        <FeedbackSidebar username={username} />
      </div>

      {/* Area produk */}
      <div className="container mt-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Produk</h2>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-primary" onClick={() => setShowCart(!showCart)}>
              🛒 Keranjang
            </button>
            <select className="form-select" style={{ width: '150px' }} value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="asc">Termurah</option>
              <option value="desc">Termahal</option>
            </select>
            <ProfileDropdown />
          </div>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {products.map(p => (
            <div className="col" key={p.id}>
              <div className="card h-100 shadow-sm" style={{ minHeight: '350px' }}>
                <img
                  src={p.image_url}
                  className="card-img-top"
                  alt={p.name}
                  style={{ height: '180px', objectFit: 'contain', padding: '10px', borderRadius: '10px' }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">Rp {parseInt(p.price).toLocaleString()}</p>
                  <button className="btn btn-primary" onClick={() => tambahKeKeranjang(p)}>
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Konfirmasi Checkout */}
        {showConfirm && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ background: 'rgba(0,0,0,0.5)', zIndex: 999 }}>
            <div className="bg-white p-4 rounded shadow" style={{ width: '90%', maxWidth: '400px' }}>
              <h5 className="text-center mb-3">Apakah Anda ingin melanjutkan pemesanan?</h5>
              <div className="d-flex justify-content-around">
                <button className="btn btn-success" onClick={() => handleConfirm('ya')}>Ya</button>
                <button className="btn btn-secondary" onClick={() => handleConfirm('tidak')}>Tidak</button>
              </div>
            </div>
          </div>
        )}

        {showCart && (
          <CartPopup
            cart={cart}
            onClose={() => setShowCart(false)}
            onCheckout={handleBayar}
            onTambah={tambahKeKeranjang}
            onKurangi={kurangiJumlah}
          />
        )}
      </div>
    </div>
  );
}
