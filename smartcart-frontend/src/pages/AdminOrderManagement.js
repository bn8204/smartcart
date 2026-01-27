import React, { useState, useEffect } from 'react';
import { orderService } from '../services/api';

function AdminOrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
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
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading orders...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🔧 Admin - Order Management</h1>

      {message && (
        <div className={`alert alert-${messageType === 'success' ? 'success' : 'error'}`} style={{ marginBottom: '1.5rem' }}>
          {message}
        </div>
      )}

      <div style={{
        backgroundColor: '#e8f4f8',
        border: '2px solid #3498db',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>💡 How to Update Order Status:</h3>
        <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>Click on an order to expand it</li>
          <li>Select a new status from the dropdown</li>
          <li>Click "Update Status" button</li>
          <li>Order will move through tracking stages automatically</li>
        </ol>
        <p style={{ margin: '1rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
          <strong>Status Flow:</strong> PENDING → PAID → DISPATCHED → OUT_FOR_DELIVERY → DELIVERED
        </p>
      </div>

      {/* Orders List */}
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
                  <h4 style={{ marginTop: '0' }}>📦 Order Details</h4>
                  <p><strong>Order ID:</strong> {order.id}</p>
                  <p><strong>User ID:</strong> {order.user_id}</p>
                  <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                  <p><strong>Total:</strong> ₹{parseFloat(order.total).toFixed(2)}</p>
                  <p><strong>Current Status:</strong> <span style={{ backgroundColor: getStatusColor(order.status), color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>{order.status}</span></p>
                </div>

                {/* Status Update Section */}
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

                  {/* Status Flow Guide */}
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    backgroundColor: '#fff9e6',
                    borderLeft: '3px solid #ff9800',
                    fontSize: '0.85rem',
                    color: '#666'
                  }}>
                    <strong>Recommended Flow:</strong><br />
                    PENDING → PAID → DISPATCHED → OUT_FOR_DELIVERY → DELIVERED
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          <p>No orders found</p>
        </div>
      )}
    </div>
  );
}

export default AdminOrderManagement;
