import React from 'react';

export default function ProductCard({ product, onBuy }) {
  return (
    <div
      className="card h-100 shadow-sm"
      style={{
        minHeight: '350px',
        backgroundColor: '#ffe6f0', // 🌸 pink soft
        border: '1px solid #ffc0cb', // pink border
        borderRadius: '15px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}
    >
      <img
        src={product.image_url}
        className="card-img-top"
        alt={product.name}
        style={{
          height: '180px',
          objectFit: 'contain',
          padding: '10px',
          borderRadius: '10px'
        }}
      />
      <div className="card-body text-center">
        <h5 className="card-title" style={{ color: '#b03060' }}>
          {product.name}
        </h5>
        <p className="card-text" style={{ color: '#d63384' }}>
          Rp {parseInt(product.price).toLocaleString()}
        </p>
        <button
          className="btn"
          style={{
            backgroundColor: '#ff69b4',
            color: 'white',
            borderRadius: '8px'
          }}
          onClick={() => onBuy(product)}
        >
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
}
