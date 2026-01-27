import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

function AdminDashboard({ adminUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    paidOrders: 0,
    dispatchedOrders: 0,
    deliveredOrders: 0,
    failedOrders: 0,
    totalRevenue: 0
  });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE}/orders`);
      setOrders(response.data || []);
      calculateStats(response.data || []);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (ordersList) => {
    const stats = {
      totalOrders: ordersList.length,
      pendingOrders: 0,
      paidOrders: 0,
      dispatchedOrders: 0,
      deliveredOrders: 0,
      failedOrders: 0,
      totalRevenue: 0
    };

    ordersList.forEach(order => {
      const amount = parseFloat(order.totalAmount) || 0;
      
      switch(order.status) {
        case 'PENDING':
          stats.pendingOrders++;
          break;
        case 'PAID':
          stats.paidOrders++;
          stats.totalRevenue += amount;
          break;
        case 'DISPATCHED':
        case 'OUT_FOR_DELIVERY':
          stats.dispatchedOrders++;
          stats.totalRevenue += amount;
          break;
        case 'DELIVERED':
          stats.deliveredOrders++;
          stats.totalRevenue += amount;
          break;
        case 'FAILED':
        case 'CANCELLED':
          stats.failedOrders++;
          break;
        default:
          break;
      }
    });

    setStats(stats);
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    setStatusUpdateLoading(orderId);
    try {
      await axios.post(`${API_BASE}/orders/${orderId}/update-status`, {
        status: newStatus
      });
      
      // Refresh orders
      await fetchOrders();
      setExpandedOrder(null);
    } catch (err) {
      alert('Failed to update order status: ' + (err.response?.data?.message || err.message));
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': '#ff9800',
      'PAID': '#4caf50',
      'DISPATCHED': '#2196f3',
      'OUT_FOR_DELIVERY': '#673ab7',
      'DELIVERED': '#00bcd4',
      'FAILED': '#f44336',
      'CANCELLED': '#9e9e9e'
    };
    return colors[status] || '#666';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed === undefined || parsed === null) return '0';
    return parsed.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>📊 Admin Dashboard</h1>
          <p>Welcome back, {adminUser?.name || 'Admin'}</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📈 Overview
        </button>
        <button 
          className={activeTab === 'payment' ? 'active' : ''}
          onClick={() => setActiveTab('payment')}
        >
          💰 Payment Verification
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          📦 Order Management
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
          <p>{error}</p>
          <button onClick={fetchOrders}>Retry</button>
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              <h2>Dashboard Overview</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>📋 Total Orders</h3>
                  <p className="stat-value">{stats.totalOrders}</p>
                </div>
                <div className="stat-card pending">
                  <h3>⏳ Pending Orders</h3>
                  <p className="stat-value">{stats.pendingOrders}</p>
                </div>
                <div className="stat-card paid">
                  <h3>✅ Paid Orders</h3>
                  <p className="stat-value">{stats.paidOrders}</p>
                </div>
                <div className="stat-card dispatched">
                  <h3>🚚 Dispatched Orders</h3>
                  <p className="stat-value">{stats.dispatchedOrders}</p>
                </div>
                <div className="stat-card delivered">
                  <h3>📦 Delivered Orders</h3>
                  <p className="stat-value">{stats.deliveredOrders}</p>
                </div>
                <div className="stat-card failed">
                  <h3>❌ Failed/Cancelled</h3>
                  <p className="stat-value">{stats.failedOrders}</p>
                </div>
                <div className="stat-card revenue">
                  <h3>💵 Total Revenue</h3>
                  <p className="stat-value">₹{formatAmount(stats.totalRevenue)}</p>
                </div>
              </div>

              <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <h3>📊 Quick Stats</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  <div>
                    <p><strong>Pending Payment:</strong></p>
                    <p style={{ fontSize: '1.2rem', color: '#ff9800' }}>{stats.pendingOrders} orders</p>
                  </div>
                  <div>
                    <p><strong>Success Rate:</strong></p>
                    <p style={{ fontSize: '1.2rem', color: '#4caf50' }}>
                      {stats.totalOrders > 0 ? ((stats.deliveredOrders / stats.totalOrders * 100).toFixed(1)) : 0}%
                    </p>
                  </div>
                  <div>
                    <p><strong>Avg Order Value:</strong></p>
                    <p style={{ fontSize: '1.2rem', color: '#2196f3' }}>
                      ₹{formatAmount(stats.totalOrders > 0 ? (stats.totalRevenue / (stats.paidOrders || 1)) : 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Verification Tab */}
          {activeTab === 'payment' && (
            <div className="tab-content">
              <h2>💰 Payment Verification</h2>
              <p style={{ color: '#666', marginBottom: '1rem' }}>Review and approve pending payments</p>
              
              {orders.filter(o => o.status === 'PENDING').length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                  <p>No pending payments to verify</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.filter(o => o.status === 'PENDING').map(order => (
                    <div key={order.id} className="order-card">
                      <div 
                        className="order-header"
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      >
                        <div>
                          <h3>Order #{order.id}</h3>
                          <p className="order-date">{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                          <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                            {order.status}
                          </span>
                          <span style={{ marginLeft: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            ₹{formatAmount(order.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {expandedOrder === order.id && (
                        <div className="order-details">
                          <div style={{ marginBottom: '1rem' }}>
                            <p><strong>Customer:</strong> {order.userName || 'Unknown'}</p>
                            <p><strong>Email:</strong> {order.userEmail || 'N/A'}</p>
                            <p><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>
                            <p><strong>Amount:</strong> ₹{formatAmount(order.totalAmount)}</p>
                          </div>

                          <div className="status-actions">
                            <button 
                              className="btn-approve"
                              onClick={() => updateOrderStatus(order.id, 'PAID')}
                              disabled={statusUpdateLoading === order.id}
                            >
                              {statusUpdateLoading === order.id ? '⏳ Processing...' : '✅ Approve Payment'}
                            </button>
                            <button 
                              className="btn-reject"
                              onClick={() => updateOrderStatus(order.id, 'FAILED')}
                              disabled={statusUpdateLoading === order.id}
                            >
                              {statusUpdateLoading === order.id ? '⏳ Processing...' : '❌ Reject Payment'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Order Management Tab */}
          {activeTab === 'orders' && (
            <div className="tab-content">
              <h2>📦 Order Management</h2>
              <p style={{ color: '#666', marginBottom: '1rem' }}>Track and update order statuses</p>
              
              {orders.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                  <p>No orders found</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div 
                        className="order-header"
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      >
                        <div>
                          <h3>Order #{order.id}</h3>
                          <p className="order-date">{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                          <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                            {order.status}
                          </span>
                          <span style={{ marginLeft: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            ₹{formatAmount(order.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {expandedOrder === order.id && (
                        <div className="order-details">
                          <div style={{ marginBottom: '1rem' }}>
                            <p><strong>Customer:</strong> {order.userName || 'Unknown'}</p>
                            <p><strong>Email:</strong> {order.userEmail || 'N/A'}</p>
                            <p><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>
                            <p><strong>Current Status:</strong> {order.status}</p>
                          </div>

                          <div className="status-actions">
                            <label><strong>Update Status:</strong></label>
                            <select 
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              disabled={statusUpdateLoading === order.id}
                            >
                              <option value="PENDING">⏳ Pending</option>
                              <option value="PAID">✅ Paid</option>
                              <option value="DISPATCHED">📦 Dispatched</option>
                              <option value="OUT_FOR_DELIVERY">🚚 Out for Delivery</option>
                              <option value="DELIVERED">✔️ Delivered</option>
                              <option value="FAILED">❌ Failed</option>
                              <option value="CANCELLED">🚫 Cancelled</option>
                            </select>
                            {statusUpdateLoading === order.id && <span style={{ marginLeft: '1rem' }}>Updating...</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
