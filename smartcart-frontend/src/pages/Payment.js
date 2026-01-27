import React, { useState } from 'react';
import { paymentService } from '../services/api';

function Payment({ orderId, onPaymentSuccess, onPaymentCancel }) {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePaymentData = () => {
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (!formData.cardNumber || formData.cardNumber.length !== 16) {
        setMessage('Card number must be 16 digits');
        setMessageType('error');
        return false;
      }
      if (!formData.cardHolder) {
        setMessage('Card holder name is required');
        setMessageType('error');
        return false;
      }
      if (!formData.expiryDate || !formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        setMessage('Expiry date must be in MM/YY format');
        setMessageType('error');
        return false;
      }
      if (!formData.cvv || formData.cvv.length !== 3) {
        setMessage('CVV must be 3 digits');
        setMessageType('error');
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!formData.upiId || !formData.upiId.includes('@')) {
        setMessage('Valid UPI ID is required (format: username@bank)');
        setMessageType('error');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePaymentData()) {
      return;
    }

    try {
      setLoading(true);
      setMessage('Processing payment...');
      setMessageType('info');

      const paymentData = {
        orderId: orderId,
        paymentMethod: paymentMethod,
        amount: formData.amount,
        status: 'PENDING_VERIFICATION'
      };

      // Add payment method specific details
      if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
        paymentData.cardLast4 = formData.cardNumber.slice(-4);
        paymentData.cardHolder = formData.cardHolder;
      } else if (paymentMethod === 'upi') {
        paymentData.upiId = formData.upiId;
      } else if (paymentMethod === 'cash') {
        paymentData.notes = 'Cash on delivery - pending verification';
      }

      // Create payment request
      const response = await paymentService.confirmPayment(paymentData);

      setMessage('✅ Payment request submitted! Waiting for verification...');
      setMessageType('success');

      setTimeout(() => {
        onPaymentSuccess();
      }, 2000);
    } catch (error) {
      setMessage('❌ Payment failed: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="form-container" style={{ maxWidth: '500px' }}>
        <h2>Payment Information</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>Order ID: <strong>#{orderId}</strong></p>

        {message && (
          <div className={`alert alert-${messageType === 'success' ? 'success' : messageType === 'error' ? 'error' : 'info'}`}
            style={{ marginBottom: '1rem' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Payment Method Selection */}
          <div className="form-group">
            <label>Payment Method</label>
            <select 
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setMessage('');
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="credit_card">💳 Credit Card</option>
              <option value="debit_card">💳 Debit Card</option>
              <option value="upi">📱 UPI</option>
              <option value="cash">💵 Cash on Delivery</option>
            </select>
          </div>

          {/* Credit/Debit Card Fields */}
          {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
            <>
              <div className="form-group">
                <label>Card Number (16 digits)</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="16"
                  required
                />
              </div>

              <div className="form-group">
                <label>Card Holder Name</label>
                <input
                  type="text"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Expiry Date (MM/YY)</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="12/25"
                    maxLength="5"
                    required
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label>CVV (3 digits)</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* UPI Field */}
          {paymentMethod === 'upi' && (
            <div className="form-group">
              <label>UPI ID</label>
              <input
                type="text"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                placeholder="username@bank"
                required
              />
            </div>
          )}

          {/* Cash on Delivery Info */}
          {paymentMethod === 'cash' && (
            <div style={{
              backgroundColor: '#fff3cd',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              color: '#856404'
            }}>
              <p><strong>Cash on Delivery</strong></p>
              <p>Payment will be collected at the time of delivery. Your order will be pending verification.</p>
            </div>
          )}

          {/* Form Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button 
              type="submit" 
              className="btn"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Processing...' : 'Submit Payment'}
            </button>
            <button 
              type="button"
              className="btn btn-danger"
              onClick={onPaymentCancel}
              disabled={loading}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>

        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '1rem', textAlign: 'center' }}>
          * This is a demo payment. All data is for testing purposes only.
        </p>
      </div>
    </div>
  );
}

export default Payment;
