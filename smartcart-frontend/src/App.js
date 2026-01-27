import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import Support from './pages/Support';
import OrderTracking from './pages/OrderTracking';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCart([]);
    setCurrentPage('home');
  };

  const handleLoginSuccess = (userEmail) => {
    const userData = { email: userEmail };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onAddToCart={handleAddToCart} />;
      case 'products':
        return <Products onAddToCart={handleAddToCart} />;
      case 'cart':
        return <Cart items={cart} />;
      case 'orders':
        return <Orders />;
      case 'tracking':
        return <OrderTracking />;
      case 'support':
        return <Support />;
      case 'admin':
        return <AdminDashboard />;
      case 'register':
        return <Register onRegisterSuccess={() => setCurrentPage('login')} />;
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} />;
      default:
        return <Home onAddToCart={handleAddToCart} />;
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div className="App">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        user={user}
        onLogout={handleLogout}
        cartCount={cart.length}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
