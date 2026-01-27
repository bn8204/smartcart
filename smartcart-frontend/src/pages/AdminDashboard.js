import React, { useState, useEffect } from 'react';
import { orderService } from '../services/api';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      setOrders(response.data || []);
    } catch (err) {
      setMessage('Failed to load orders');
      setMessageType('error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatus(prev => ({
      ...prev,
      [orderId]: newStatus
    }));
  };

  const updateOrderStatus = async (orderId) => {
    const newStatus = selectedStatus[orderId];
    if (!newStatus) {
      setMessage('Please select a status');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setMessage(`✅ Order #${orderId} status updated to ${newStatus}`);
        setMessageType('success');
        fetchOrders();
        setExpandedOrder(null);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update status');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
      setMessageType('error');
      console.error(err);
    }
  };

  const handleApprovePayment = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID' })
      });

      if (response.ok) {
        setMessage(`✅ Payment for Order #${orderId} approved!`);
        setMessageType('success');
        fetchOrders();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Failed to approve payment');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
      setMessageType('error');
      console.error(err);
    }
  };

  const handleRejectPayment = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'FAILED' })
      });

      if (response.ok) {
        setMessage(`❌ Payment for Order #${orderId} rejected`);
        setMessageType('success');
        fetchOrders();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Failed to reject payment');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
      setMessageType('error');
      console.error(err);
    }
  };

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    paid: orders.filter(o => o.status === 'PAID').length,
    dispatched: orders.filter(o => o.status === 'DISPATCHED').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    failed: orders.filter(o => o.status === 'FAILED').length,
    totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0)
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return '#27ae60';
      case 'PENDING':
        return '#ff9800';
      case 'FAILED':
        return '#e74c3c';
      case 'DISPATCHED':
        return '#3498db';
      case 'OUT_FOR_DELIVERY':
        return '#9b59b6';
      case 'DELIVERED':
        return '#16a085';
      default:
        return '#95a5a6';
    }
  };

  const statusOptions = [
    'PENDING',
    'PAID',
    'DISPATCHED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'FAILED',
    'CANCELLED'
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading dashboard...</div>;
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <h1>🔧 Admin Dashboard</h1>

      {message && (
        <div className={`alert alert-${messageType === 'success' ? 'success' : 'error'}`} style={{ marginBottom: '1.5rem' }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '2px solid #eee',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'payments', label: '💰 Payment Verification', icon: '💰' },
          { id: 'orders', label: '📦 Order Management', icon: '📦' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              backgroundColor: activeTab === tab.id ? '#3498db' : '#f5f5f5',
              color: activeTab === tab.id ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: 'bold',
              borderRadius: '4px 4px 0 0',
              transition: 'all 0.3s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== OVERVIEW TAB ===== */}
      {activeTab === 'overview' && (
        <div>
          <h2>📊 Dashboard Overview</h2>
          
          {/* Statistics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              backgroundColor: '#fff3e0',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid #ff9800',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#ff9800' }}>Total Orders</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{stats.total}</p>
            </div>

            <div style={{
              backgroundColor: '#fce4ec',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid #e91e63',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#e91e63' }}>Pending Payment</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{stats.pending}</p>
            </div>

            <div style={{
              backgroundColor: '#e8f5e9',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid #27ae60',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#27ae60' }}>Paid</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{stats.paid}</p>
            </div>

            <div style={{
              backgroundColor: '#e3f2fd',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid #3498db',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#3498db' }}>Dispatched</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{stats.dispatched}</p>
            </div>

            <div style={{
              backgroundColor: '#e0f2f1',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid #16a085',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#16a085' }}>Delivered</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{stats.delivered}</p>
            </div>

            <div style={{
              backgroundColor: '#ffebee',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid #e74c3c',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#e74c3c' }}>Failed</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{stats.failed}</p>
            </div>

            <div style={{
              backgroundColor: '#f3e5f5',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid #9c27b0',
              textAlign: 'center',
              gridColumn: 'span auto'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#9c27b0' }}>Total Revenue</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>₹{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: '#e3f2fd',
            border: '2px solid #3498db',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <h3 style={{ marginTop: 0 }}>⚡ Quick Actions</h3>
            <p>Use the tabs above to:</p>
            <ul>
              <li>💰 <strong>Payment Verification</strong> - Approve or reject pending payments</li>
              <li>📦 <strong>Order Management</strong> - Update order status and track delivery</li>
            </ul>
          </div>
        </div>
      )}

      {/* ===== PAYMENT VERIFICATION TAB ===== */}
      {activeTab === 'payments' && (
        <div>
          <h2>💰 Payment Verification</h2>

          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            {[
              { status: 'PENDING', label: `⏳ Pending (${stats.pending})`, color: '#ff9800' }
            ].map(filter => (
              <button
                key={filter.status}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: filter.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Pending Orders */}
          {orders.filter(o => o.status === 'PENDING').length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              color: '#999'
            }}>
              <p>✅ No pending payments - All orders verified!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {orders.filter(o => o.status === 'PENDING').map((order) => (
                <div
                  key={order.id}
                  style={{
                    border: '2px solid #ff9800',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    backgroundColor: '#fff8e1'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>Order #{order.id}</h3>
                      <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>
                        ₹{parseFloat(order.total).toFixed(2)} | {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span style={{
                      backgroundColor: '#ff9800',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}>
                      ⏳ PENDING
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => handleApprovePayment(order.id)}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        backgroundColor: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                      }}
                    >
                      ✅ Approve Payment
                    </button>
                    <button
                      onClick={() => handleRejectPayment(order.id)}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                      }}
                    >
                      ❌ Reject Payment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== ORDER MANAGEMENT TAB ===== */}
      {activeTab === 'orders' && (
        <div>
          <h2>📦 Order Management</h2>

          <div style={{
            display: 'grid',
            gap: '1rem'
          }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {/* Order Header */}
                <div
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  style={{
                    padding: '1.5rem',
                    backgroundColor: '#f9f9f9',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                >
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Order #{order.id}</h3>
                    <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                      Date: {new Date(order.created_at).toLocaleDateString()} | Total: ₹{parseFloat(order.total).toFixed(2)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: getStatusColor(order.status),
                        color: 'white',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}
                    >
                      {order.status}
                    </span>
                    <span style={{ fontSize: '1.5rem' }}>
                      {expandedOrder === order.id ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div style={{ padding: '1.5rem', borderTop: '2px solid #eee' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ marginTop: '0' }}>📋 Order Details</h4>
                      <p><strong>Order ID:</strong> {order.id}</p>
                      <p><strong>User ID:</strong> {order.user_id}</p>
                      <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                      <p><strong>Total:</strong> ₹{parseFloat(order.total).toFixed(2)}</p>
                      <p><strong>Current Status:</strong> <span style={{ backgroundColor: getStatusColor(order.status), color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>{order.status}</span></p>
                    </div>

                    {/* Status Update */}
                    <div style={{
                      backgroundColor: '#f0f8ff',
                      padding: '1rem',
                      borderRadius: '6px',
                      border: '1px solid #3498db'
                    }}>
                      <h4 style={{ marginTop: '0', marginBottom: '1rem' }}>🔄 Update Status</h4>
                      
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            New Status:
                          </label>
                          <select
                            value={selectedStatus[order.id] || ''}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '1rem'
                            }}
                          >
                            <option value="">-- Select Status --</option>
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => updateOrderStatus(order.id)}
                          style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#27ae60',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Update Status
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
