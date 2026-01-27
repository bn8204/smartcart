import React, { useState } from 'react';
import { orderService } from '../services/api';

function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Safe formatting functions
  const formatAmount = (amount) => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed === undefined || parsed === null) return '0.00';
    return parsed.toFixed(2);
  };

  const getOrderDate = (order) => {
    // Support both field names: created_at (old) and createdAt (new)
    return order?.created_at || order?.createdAt || new Date().toISOString();
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!orderId.trim()) {
      setError('Please enter an Order ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setOrder(null);
      setOrderItems([]);

      // Fetch order details
      const ordersResponse = await orderService.getAllOrders();
      const foundOrder = ordersResponse.data.find(o => o.id == orderId);

      if (!foundOrder) {
        setError('Order not found. Please check your Order ID.');
        setSearched(true);
        setLoading(false);
        return;
      }

      setOrder(foundOrder);

      // Fetch order items
      try {
        const itemsResponse = await orderService.getOrderItems(orderId);
        setOrderItems(itemsResponse.data || []);
      } catch (itemError) {
        console.log('Could not fetch items:', itemError);
      }

      setSearched(true);
    } catch (err) {
      setError('Error fetching order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
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
      default:
        return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PAID':
        return '✅';
      case 'PENDING':
        return '⏳';
      case 'FAILED':
        return '❌';
      default:
        return '📦';
    }
  };

  const getTrackingStage = (status, createdAt) => {
    // Calculate days since order was placed
    const dateToUse = createdAt || new Date().toISOString();
    const orderDate = new Date(dateToUse);
    const currentDate = new Date();
    const daysSinceOrder = isNaN(orderDate.getTime()) ? 0 : Math.floor((currentDate - orderDate) / (1000 * 60 * 60 * 24));

    switch (status) {
      case 'PENDING':
        return [
          { stage: 'Order Placed', completed: true },
          { stage: 'Payment Pending', completed: true },
          { stage: 'Processing', completed: false },
          { stage: 'Dispatched', completed: false },
          { stage: 'Out for Delivery', completed: false },
          { stage: 'Delivered', completed: false }
        ];
      case 'PAID':
        return [
          { stage: 'Order Placed', completed: true },
          { stage: 'Payment Verified', completed: true },
          { stage: 'Processing', completed: true },
          { stage: 'Dispatched', completed: false },
          { stage: 'Out for Delivery', completed: false },
          { stage: 'Delivered', completed: false }
        ];
      case 'DISPATCHED':
        return [
          { stage: 'Order Placed', completed: true },
          { stage: 'Payment Verified', completed: true },
          { stage: 'Processing', completed: true },
          { stage: 'Dispatched', completed: true },
          { stage: 'Out for Delivery', completed: false },
          { stage: 'Delivered', completed: false }
        ];
      case 'OUT_FOR_DELIVERY':
        return [
          { stage: 'Order Placed', completed: true },
          { stage: 'Payment Verified', completed: true },
          { stage: 'Processing', completed: true },
          { stage: 'Dispatched', completed: true },
          { stage: 'Out for Delivery', completed: true },
          { stage: 'Delivered', completed: false }
        ];
      case 'DELIVERED':
        return [
          { stage: 'Order Placed', completed: true },
          { stage: 'Payment Verified', completed: true },
          { stage: 'Processing', completed: true },
          { stage: 'Dispatched', completed: true },
          { stage: 'Out for Delivery', completed: true },
          { stage: 'Delivered', completed: true }
        ];
      case 'FAILED':
      case 'CANCELLED':
        return [
          { stage: 'Order Placed', completed: true },
          { stage: 'Payment Failed', completed: true },
          { stage: 'Processing', completed: false },
          { stage: 'Dispatched', completed: false },
          { stage: 'Out for Delivery', completed: false },
          { stage: 'Delivered', completed: false }
        ];
      default:
        return [
          { stage: 'Order Placed', completed: false },
          { stage: 'Payment Failed', completed: false },
          { stage: 'Processing', completed: false },
          { stage: 'Dispatched', completed: false },
          { stage: 'Out for Delivery', completed: false },
          { stage: 'Delivered', completed: false }
        ];
    }
  };

  const stages = order ? getTrackingStage(order.status, getOrderDate(order)) : [];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1>📍 Order Tracking</h1>

      {/* Search Form */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Enter your Order ID (e.g., 1, 2, 3...)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: loading ? '#ccc' : '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </div>
        </form>

        <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '1rem' }}>
          💡 Tip: You can find your Order ID in the "My Orders" section or in your confirmation email.
        </p>
      </div>

      {/* Error Message */}
      {error && searched && (
        <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {/* Order Not Found */}
      {searched && !order && !error && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '2px solid #ffc107',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>Order Not Found</h3>
          <p>Please check your Order ID and try again.</p>
        </div>
      )}

      {/* Order Details */}
      {order && (
        <>
          {/* Order Header */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem 0' }}>Order #{order.id}</h2>
                <p style={{ color: '#666', margin: '0.25rem 0' }}>
                  Placed on: {new Date(getOrderDate(order)).toLocaleDateString()}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  backgroundColor: getStatusColor(order.status),
                  color: 'white',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}>
                  {getStatusIcon(order.status)} {order.status}
                </span>
                <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>
                  Total: ₹{formatAmount(order.total || order.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ marginBottom: '2rem' }}>📦 Delivery Progress</h3>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              position: 'relative'
            }}>
              {/* Timeline line */}
              <div style={{
                position: 'absolute',
                top: '15px',
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: '#eee',
                zIndex: 0
              }} />

              {stages.map((stage, idx) => (
                <div key={idx} style={{
                  flex: 1,
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: stage.completed ? '#27ae60' : '#ddd',
                    border: '2px solid white',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}>
                    {stage.completed ? '✓' : idx + 1}
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: stage.completed ? '#27ae60' : '#999',
                    fontWeight: stage.completed ? 'bold' : 'normal'
                  }}>
                    {stage.stage}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          {orderItems.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <h3 style={{ marginBottom: '1.5rem' }}>📦 Order Items</h3>

              {orderItems.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 0',
                  borderBottom: idx < orderItems.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>
                      {item.product_name || `Product #${item.product_id}`}
                    </h4>
                    <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>
                      ₹{formatAmount(item.price)}
                    </p>
                  </div>
                </div>
              ))}

              <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '2px solid #eee',
                textAlign: 'right'
              }}>
                <h3 style={{ margin: 0 }}>
                  Total: ₹{formatAmount(order.total || order.totalAmount)}
                </h3>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div style={{
            backgroundColor: '#e3f2fd',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #3498db'
          }}>
            <h4 style={{ margin: '0 0 1rem 0' }}>💬 Need Help?</h4>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              If your order is taking longer than expected or you have any questions, please contact our support team.
            </p>
            <button
              onClick={() => window.location.href = '#support'}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Contact Support
            </button>
          </div>
        </>
      )}

      {/* Placeholder when not searched */}
      {!searched && !order && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#999'
        }}>
          <p style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>📍</p>
          <p>Enter your Order ID above to track your package</p>
        </div>
      )}
    </div>
  );
}

export default OrderTracking;
