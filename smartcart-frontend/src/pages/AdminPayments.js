import React, { useState, useEffect } from 'react';
import { orderService } from '../services/api';

function AdminPayments() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('PENDING');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      setOrders(response.data || []);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
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
        setMessage('✅ Payment approved successfully!');
        fetchOrders();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Failed to approve payment');
      }
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
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
        setMessage('❌ Payment rejected');
        fetchOrders();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Failed to reject payment');
      }
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
      console.error(err);
    }
  };

  const filteredOrders = orders.filter(order => order.status === filter);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading orders...</div>;
  }

  return (
    <div className="cart-container">
      <h1>💰 Payment Verification Dashboard</h1>
      
      {message && (
        <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      {/* Filter Buttons */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('PENDING')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: filter === 'PENDING' ? '#ff9800' : '#ddd',
            color: filter === 'PENDING' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ⏳ Pending ({orders.filter(o => o.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setFilter('PAID')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: filter === 'PAID' ? '#27ae60' : '#ddd',
            color: filter === 'PAID' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ✅ Approved ({orders.filter(o => o.status === 'PAID').length})
        </button>
        <button
          onClick={() => setFilter('FAILED')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: filter === 'FAILED' ? '#e74c3c' : '#ddd',
            color: filter === 'FAILED' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ❌ Rejected ({orders.filter(o => o.status === 'FAILED').length})
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          <p>No {filter.toLowerCase()} orders</p>
        </div>
      ) : (
        <div>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              style={{
                border: '2px solid #ddd',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                backgroundColor: order.status === 'PENDING' ? '#fff8e1' : '#f5f5f5'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3>Order #{order.id}</h3>
                  <p>
                    <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{parseFloat(order.total).toFixed(2)}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        backgroundColor:
                          order.status === 'PENDING'
                            ? '#ff9800'
                            : order.status === 'PAID'
                            ? '#27ae60'
                            : '#e74c3c',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {order.status}
                    </span>
                  </p>
                </div>

                {/* Action Buttons */}
                {order.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => handleApprovePayment(order.id)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleRejectPayment(order.id)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}

                {order.status !== 'PENDING' && (
                  <div style={{ color: '#666', fontWeight: 'bold' }}>
                    {order.status === 'PAID' ? '✅ Approved' : '❌ Rejected'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPayments;
