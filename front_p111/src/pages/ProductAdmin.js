import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image_url: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    if (isEdit) {
      await axios.put(`http://localhost:5000/api/products/${editId}`, form);
      setIsEdit(false);
      setEditId(null);
    } else {
      await axios.post('http://localhost:5000/api/products', form);
    }
    setForm({ name: '', price: '', image_url: '' });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm({ name: product.name, price: product.price, image_url: product.image_url });
    setIsEdit(true);
    setEditId(product.id);
  };

  return (
    <div>
      <h2>Admin - Kelola Produk</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Nama Produk"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Harga Produk"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        />
        <button type="submit">{isEdit ? 'Update' : 'Tambah'}</button>
      </form>

      <div>
        {products.map((p) => (
          <div key={p.id} style={{ border: '1px solid gray', padding: 10, marginBottom: 10 }}>
            <h4>{p.name}</h4>
            <p>Rp {parseInt(p.price).toLocaleString()}</p>
            {p.image_url && <img src={p.image_url} alt={p.name} width="100" />}
            <br />
            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p.id)}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}
