// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../components/NavbarAdmin';
import PopupModal from '../components/PopupModal'; // pastikan file ini ada!

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image_url: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false); // ✅ fix missing state
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Gagal ambil produk:', err);
    }
  };

  const handleSubmit = async () => {
  if (!form.name || !form.price || !form.image_url) {
    alert('Semua field wajib diisi!');
    return;
  }

  // ✅ Konfirmasi jika sedang menambah, bukan edit
  if (!editingId) {
    const konfirmasi = window.confirm('Apakah Anda yakin ingin menambahkan produk ini?');
    if (!konfirmasi) return;
  }

  try {
    if (editingId) {
      await axios.put(`http://localhost:5000/api/products/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post('http://localhost:5000/api/products', form);
    }
    setForm({ name: '', price: '', image_url: '' });
    setShowForm(false); // Tutup popup
    fetchProducts();
    alert('Produk berhasil disimpan!');
  } catch (err) {
    console.error('Gagal simpan produk:', err);
    alert('Terjadi kesalahan saat menyimpan produk.');
  }
};


  const handleEdit = (p) => {
    setForm({ name: p.name, price: p.price, image_url: p.image_url });
    setEditingId(p.id);
    setShowForm(true); // buka form edit
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Gagal hapus produk:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <NavbarAdmin />
      <div className="container mt-4">
        <div className="d-flex">
          {/* ====== Konten Utama ====== */}
          <div className="flex-grow-1 pe-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>📦 Manajemen Produk</h2>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                ➕ Tambah Produk
              </button>
            </div>

            {/* Kartu Produk */}
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {products.map(p => (
                <div className="col" key={p.id}>
                  <div className="card h-100">
                    <img
                      src={p.image_url}
                      className="card-img-top"
                      alt={p.name}
                      style={{ height: '180px', objectFit: 'contain' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">Rp {parseInt(p.price).toLocaleString()}</p>
                      <button className="btn btn-danger btn-sm me-2" onClick={() => deleteProduct(p.id)}>
                        Hapus
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)}>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ====== Sidebar Kanan ====== */}
          <div style={{ width: '250px' }}>
            <div className="card p-3 shadow-sm">
              <h5 className="mb-3 text-center">📊 Navigasi Admin</h5>
              <button className="btn btn-success mb-3" onClick={() => navigate('/admin/pendapatan')}>
                📈 Lihat Pendapatan
              </button>
              <button className="btn btn-info mb-3" onClick={() => navigate('/admin/pembelian')}>
                📄 Data Pembelian
              </button>
              <button className="btn btn-outline-primary" onClick={() => navigate('/admin/history')}>
                📜 History Pembelian User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔲 Popup Form Tambah/Edit Produk */}
      <PopupModal show={showForm} onClose={() => setShowForm(false)}>
        <h5 className="mb-3">{editingId ? '✏️ Edit Produk' : '🆕 Tambah Produk'}</h5>
        <input
          className="form-control mb-2"
          placeholder="Nama"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="form-control mb-2"
          type="number"
          placeholder="Harga"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Gambar URL"
          value={form.image_url}
          onChange={e => setForm({ ...form, image_url: e.target.value })}
        />
        <button className="btn btn-success w-100" onClick={handleSubmit}>
          {editingId ? 'Update Produk' : 'Simpan Produk'}
        </button>
      </PopupModal>
    </>
  );
}
