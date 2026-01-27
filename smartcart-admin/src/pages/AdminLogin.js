import React, { useState } from 'react';

function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Default admin credentials
  const ADMIN_EMAIL = 'admin@smartcart.com';
  const ADMIN_PASSWORD = 'admin@123';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate login verification
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        onLoginSuccess({
          email: email,
          name: 'Admin User',
          role: 'admin'
        });
      } else {
        setError('Invalid admin credentials. Please try again.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-form">
        <h1>🔐 Admin Login</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@smartcart.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={loading}
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px', fontSize: '0.85rem' }}>
          <strong>Demo Credentials:</strong>
          <p style={{ margin: '0.5rem 0 0 0' }}>
            Email: <code>admin@smartcart.com</code><br />
            Password: <code>admin@123</code>
          </p>
        </div>

        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '4px', fontSize: '0.85rem', color: '#1976d2' }}>
          <strong>⚠️ Admin Portal:</strong>
          <p style={{ margin: '0.5rem 0 0 0' }}>
            This is a restricted area. Only authorized admins can access this dashboard. Access is logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
