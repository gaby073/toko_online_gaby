// src/components/PopupModal.js
import React from 'react';

export default function PopupModal({ show, onClose, children }) {
  if (!show) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
         style={{ background: 'rgba(0,0,0,0.5)', zIndex: 999 }}>
      <div className="bg-white p-4 rounded shadow" style={{ width: '90%', maxWidth: '400px' }}>
        <button className="btn-close float-end" onClick={onClose}></button>
        {children}
      </div>
    </div>
  );
}
