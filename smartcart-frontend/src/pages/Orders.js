import React, { useState, useEffect } from 'react';
import { orderService } from '../services/api';
import ProductRating from '../components/ProductRating';
import DeliveryFeedback from '../components/DeliveryFeedback';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Safe formatting functions
  const formatAmount = (amount) => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed === undefined || parsed === null) return '0.00';
    return parsed.toFixed(2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString();
  };

  const getOrderTotal = (order) => {
    // Support both field names: total (old) and totalAmount (new)
    return order.total || order.totalAmount || 0;
  };

  const getOrderDate = (order) => {
    // Support both field names: created_at (old) and createdAt (new)
    return order.created_at || order.createdAt || new Date().toISOString();
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      const orders = response.data || [];
      setOrders(orders);
      
      // Fetch items for each order
      orders.forEach(order => {
        fetchOrderItems(order.id);
      });
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId) => {
    try {
      const response = await orderService.getOrderItems(orderId);
      setOrderItems(prev => ({
        ...prev,
        [orderId]: response.data || []
      }));
    } catch (err) {
      console.error(`Failed to load items for order ${orderId}:`, err);
      setOrderItems(prev => ({
        ...prev,
        [orderId]: []
      }));
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading orders...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="cart-container">
        <h1>My Orders</h1>
        <div className="cart-empty">
          <p>No orders yet</p>
          <p>Start shopping to place your first order!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>My Orders</h1>
      <div>
        {orders.map((order) => (
          <div key={order.id} style={{
            borderBottom: '1px solid #ddd',
            padding: '1rem 0',
            marginBottom: '1rem'
          }}>
            <div 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => toggleOrderExpand(order.id)}
            >
              <div>
                <h3>Order #{order.id} {expandedOrder === order.id ? '▼' : '▶'}</h3>
                <p>Date: {formatDate(getOrderDate(order))}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#27ae60' }}>
                  ₹{formatAmount(getOrderTotal(order))}
                </p>
                <p style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: order.status === 'PAID' ? '#d4edda' : '#fff3cd',
                  color: order.status === 'PAID' ? '#155724' : '#856404',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  {order.status}
                </p>
              </div>
            </div>

            {/* Order Items */}
            {expandedOrder === order.id && (
              <div style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid #3498db' }}>
                <h4>Items:</h4>
                {orderItems[order.id] && orderItems[order.id].length > 0 ? (
                  <div>
                    {orderItems[order.id].map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid #ecf0f1'
                      }}>
                        <div>
                          <p><strong>{item.product_name || `Product #${item.product_id}`}</strong></p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 'bold' }}>
                            ₹{parseFloat(item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No items in this order</p>
                )}

                {/* Show Rating and Feedback for Delivered Orders */}
                {order.status === 'DELIVERED' && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ borderTop: '2px solid #3498db', paddingTop: '1rem', marginTop: '1rem' }}>
                      📝 Leave Feedback
                    </h4>
                    
                    {/* Product Ratings */}
                    {orderItems[order.id]?.map((item, index) => (
                      <ProductRating
                        key={`rating-${index}`}
                        orderId={order.id}
                        product={item}
                        onRatingSubmit={(data) => {
                          console.log('Product rating submitted:', data);
                        }}
                      />
                    ))}

                    {/* Delivery Feedback */}
                    <DeliveryFeedback
                      orderId={order.id}
                      onFeedbackSubmit={(data) => {
                        console.log('Delivery feedback submitted:', data);
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
