import React, { useState, useEffect } from 'react';
import './App.css';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const savedAdmin = localStorage.getItem('adminUser');
    const adminToken = localStorage.getItem('adminToken');
    
    if (savedAdmin && adminToken) {
      setAdminUser(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  const handleAdminLogin = (adminData) => {
    localStorage.setItem('adminUser', JSON.stringify(adminData));
    localStorage.setItem('adminToken', 'admin-token-' + Date.now());
    setAdminUser(adminData);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    setAdminUser(null);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  if (!adminUser) {
    return <AdminLogin onLoginSuccess={handleAdminLogin} />;
  }

  return (
    <div className="App">
      <AdminDashboard adminUser={adminUser} onLogout={handleAdminLogout} />
    </div>
  );
}

export default App;
