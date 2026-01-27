import React, { useState } from 'react';
import { orderService } from '../services/api';
import Payment from './Payment';

function Cart({ items }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const total = items.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

  const handleCheckout = async () => {
    if (items.length === 0) {
      setMessage('Cart is empty');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);
      setMessage('Creating order...');
      setMessageType('info');
      console.log('Starting checkout process...');
      console.log('Items:', items);

      // Create order with items
      const orderData = {
        user_id: 1,
        total: total,
        status: 'pending',
        items: items.map(item => ({
          product_id: item.id,
          quantity: 1,
          price: item.price
        }))
      };

      console.log('Creating order with data:', orderData);
      const orderResponse = await orderService.createOrder(orderData);
      console.log('Order created:', orderResponse.data);
      
      const orderId = orderResponse.data.order?.id;
      if (!orderId) {
        throw new Error('No order ID received from server');
      }

      setCurrentOrderId(orderId);
      setShowPaymentForm(true);
      setMessage('');
      setLoading(false);
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      setMessage('❌ Order creation failed: ' + errorMsg);
      setMessageType('error');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setMessage('✅ Payment submitted for verification! Your order is pending.');
    setMessageType('success');
    
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setMessage('Payment cancelled');
    setMessageType('error');
  };

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <div className="cart-empty">
          <p>Your cart is empty</p>
          <p>Start adding products to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      {message && (
        <div className={`alert alert-${messageType === 'success' ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      <div>
        {items.map((item, index) => (
          <div key={index} className="cart-item">
            <div>
              <strong>{item.name}</strong>
            </div>
            <div>
              ₹{parseFloat(item.price).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">
        Total: ₹{total.toFixed(2)}
      </div>
      <button 
        className="btn" 
        style={{ marginTop: '2rem' }}
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Proceed to Checkout'}
      </button>

      {showPaymentForm && currentOrderId && (
        <Payment 
          orderId={currentOrderId}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={handlePaymentCancel}
        />
      )}
    </div>
  );
}

export default Cart;
