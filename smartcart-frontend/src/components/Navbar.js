import React from 'react';

function Navbar({ currentPage, onNavigate, user, onLogout, cartCount }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => onNavigate('home')}>
        🛒 SmartCart
      </div>
      <ul className="navbar-nav">
        <li>
          <button 
            onClick={() => onNavigate('home')}
            className={currentPage === 'home' ? 'active' : ''}
          >
            Home
          </button>
        </li>
        <li>
          <button 
            onClick={() => onNavigate('products')}
            className={currentPage === 'products' ? 'active' : ''}
          >
            Products
          </button>
        </li>
        <li>
          <button 
            onClick={() => onNavigate('cart')}
            className={currentPage === 'cart' ? 'active' : ''}
          >
            Cart <span className="cart-badge">{cartCount}</span>
          </button>
        </li>
        {user && (
          <li>
            <button 
              onClick={() => onNavigate('orders')}
              className={currentPage === 'orders' ? 'active' : ''}
            >
              My Orders
            </button>
          </li>
        )}
        {/* Track Order */}
        <li>
          <button 
            onClick={() => onNavigate('tracking')}
            className={currentPage === 'tracking' ? 'active' : ''}
          >
            📍 Track
          </button>
        </li>
        {/* Support */}
        <li>
          <button 
            onClick={() => onNavigate('support')}
            className={currentPage === 'support' ? 'active' : ''}
          >
            💬 Support
          </button>
        </li>
        {/* Admin Dashboard */}
        <li>
          <button 
            onClick={() => onNavigate('admin')}
            className={currentPage === 'admin' ? 'active' : ''}
            style={{
              backgroundColor: currentPage === 'admin' ? '#e74c3c' : 'transparent',
              color: currentPage === 'admin' ? 'white' : 'white',
              padding: '0.5rem 1rem',
              border: '2px solid #e74c3c',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔧 Admin Dashboard
          </button>
        </li>
        {!user ? (
          <>
            <li>
              <button 
                onClick={() => onNavigate('register')}
                className={currentPage === 'register' ? 'active' : ''}
              >
                Register
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('login')}
                className={currentPage === 'login' ? 'active' : ''}
              >
                Login
              </button>
            </li>
          </>
        ) : (
          <li>
            <button onClick={onLogout}>
              Logout ({user.email})
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
