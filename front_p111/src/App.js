import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import ProductListUser from './pages/ProductListUser';
import PaymentPage from './pages/PaymentPage';
import ReceiptPage from './pages/ReceiptPage';
import OrderHistoryUser from './pages/OrderHistoryUser';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminUserHistory from './pages/AdminUserHistory';
import PendapatanPage from './pages/PendapatanPage';
import PembelianPage from './pages/PembelianPage';
import UserHistoryPage from './pages/UserHistoryPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/produk" element={<ProductListUser />} />
        <Route path="/bayar" element={<PaymentPage />} />
        <Route path="/struk" element={<ReceiptPage />} />
        <Route path="/riwayat" element={<OrderHistoryUser />} />
    
        <Route path="/admin/pendapatan" element={<PendapatanPage />} />
<Route path="/admin/pembelian" element={<PembelianPage />} />
<Route path="/admin/history" element={<UserHistoryPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/history" element={<AdminUserHistory />} />

        {/* Default route: redirect ke login */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
