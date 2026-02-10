import React, { useState, useEffect, useRef } from 'react';
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
  
  // New state for interrupt handling
  const [sessionId, setSessionId] = useState(null);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [canResume, setCanResume] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);
  const unloadListenerRef = useRef(false);

  // Initialize payment session and setup event listeners
  useEffect(() => {
    const initializeSession = async () => {
      try {
        console.log('=== CREATING PAYMENT SESSION ===');
        console.log('Order ID:', orderId);
        const response = await paymentService.createPaymentSession(orderId);
        console.log('Session response:', response);
        console.log('Session ID from response.data:', response.data?.sessionId);
        setSessionId(response.data?.sessionId);
        setMaxAttempts(response.data?.maxAttempts || 3);
        console.log('Session ID set to state:', response.data?.sessionId);
      } catch (error) {
        console.error('Failed to initialize payment session:', error);
        setMessage(`Session Error: ${error.message || 'Failed to create payment session'}`);
        setMessageType('error');
      }
    };

    initializeSession();

    // Setup beforeunload listener to warn user
    const handleBeforeUnload = (e) => {
      if (loading && sessionId) {
        e.preventDefault();
        e.returnValue = 'Payment is in progress. Are you sure you want to leave?';
        return 'Payment is in progress. Are you sure you want to leave?';
      }
    };

    if (loading && sessionId) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      unloadListenerRef.current = true;
    }

    return () => {
      if (unloadListenerRef.current) {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    };
  }, [orderId, sessionId, loading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (unloadListenerRef.current) {
        window.removeEventListener('beforeunload', () => {});
      }
    };
  }, []);

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

  const initiatePaymentWithTimeout = (paymentRequest) => {
    return new Promise((resolve, reject) => {
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      // Set timeout for payment processing
      timeoutRef.current = setTimeout(() => {
        abortControllerRef.current.abort();
        handlePaymentTimeout();
        reject(new Error('Payment timeout exceeded'));
      }, 30000); // 30 second timeout

      // Simulate payment processing
      paymentService
        .confirmPayment(paymentRequest)
        .then((response) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          resolve(response);
        })
        .catch((error) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          reject(error);
        });
    });
  };

  const handlePaymentTimeout = async () => {
    if (!sessionId) return;

    setIsInterrupted(true);
    setCanResume(attemptCount < maxAttempts);
    setMessage(
      `⏱️ Payment timeout (attempt ${attemptCount + 1}/${maxAttempts}). You can retry or cancel.`
    );
    setMessageType('warning');
    setLoading(false);
  };

  const handlePaymentError = async (error) => {
    if (!sessionId) return;

    const isNetworkError = !error.response || error.code === 'ECONNABORTED';

    if (isNetworkError) {
      setIsInterrupted(true);
      setCanResume(attemptCount < maxAttempts);
      setMessage(
        `🌐 Network error detected (attempt ${attemptCount + 1}/${maxAttempts}). Would you like to retry?`
      );
      setMessageType('warning');
    }
  };

  const handlePaymentInterruption = async (reason) => {
    if (!sessionId) return;

    try {
      await paymentService.handlePaymentInterruption(sessionId, reason);
      setIsInterrupted(true);
      setCanResume(attemptCount < maxAttempts);
      setMessage(`Payment interrupted: ${reason}. You can resume or cancel.`);
      setMessageType('warning');
    } catch (error) {
      console.error('Error handling interruption:', error);
    }
  };

  const resumePayment = async () => {
    if (!sessionId || !canResume) return;

    try {
      setLoading(true);
      setMessage('Resuming payment...');
      setMessageType('info');

      // Resume the payment session
      await paymentService.resumePaymentSession(sessionId);

      setAttemptCount((prev) => prev + 1);
      setIsInterrupted(false);

      // Retry the payment
      await retryPayment();
    } catch (error) {
      setMessage(
        `❌ Resume failed: ${error.response?.data?.message || error.message}`
      );
      setMessageType('error');
      setLoading(false);
    }
  };

  const retryPayment = async () => {
    if (!validatePaymentData()) {
      return;
    }

    try {
      const paymentData = {
        orderId: orderId,
        paymentMethod: paymentMethod,
        amount: formData.amount,
        status: 'PENDING_VERIFICATION',
        sessionId: sessionId,
        retryAttempt: attemptCount + 1,
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

      // Process payment with timeout protection
      const response = await initiatePaymentWithTimeout(paymentData);

      // Complete payment in session
      await paymentService.completePaymentSession(sessionId, response);

      setMessage('✅ Payment request submitted! Waiting for verification...');
      setMessageType('success');
      setIsInterrupted(false);

      setTimeout(() => {
        onPaymentSuccess();
      }, 2000);
    } catch (error) {
      // Handle timeout specifically
      if (error.message === 'Payment timeout exceeded') {
        return; // Already handled by timeout handler
      }

      await handlePaymentError(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbortPayment = async () => {
    console.log('=== ABORT PAYMENT CLICKED ===');
    console.log('Session ID:', sessionId);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (sessionId) {
      try {
        console.log('Calling cancelPaymentSession with sessionId:', sessionId);
        const response = await paymentService.cancelPaymentSession(sessionId, 'User aborted');
        console.log('Cancel response:', response);
      } catch (error) {
        console.error('Error cancelling session:', error);
        setMessage(`Error: ${error.message || 'Failed to cancel payment'}`);
        setMessageType('error');
        setLoading(false);
        return;
      }
    } else {
      console.warn('No sessionId available');
    }

    setLoading(false);
    setIsInterrupted(false);
    setMessage('Payment cancelled successfully');
    setMessageType('info');

    setTimeout(() => {
      onPaymentCancel();
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    retryPayment();
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

          {/* Attempt Counter */}
          {attemptCount > 0 && (
            <div style={{
              backgroundColor: '#e8f4f8',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              color: '#0c5460',
              fontSize: '0.9rem'
            }}>
              📊 Attempt {attemptCount} of {maxAttempts}
            </div>
          )}

          {/* Form Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {!isInterrupted ? (
              <>
                <button 
                  type="submit" 
                  className="btn"
                  disabled={loading}
                  style={{ flex: 1, minWidth: '120px' }}
                >
                  {loading ? 'Processing...' : 'Submit Payment'}
                </button>
                <button 
                  type="button"
                  className="btn btn-danger"
                  onClick={handleAbortPayment}
                  disabled={loading}
                  style={{ flex: 1, minWidth: '120px' }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {canResume && (
                  <button 
                    type="button"
                    className="btn"
                    onClick={resumePayment}
                    disabled={loading}
                    style={{ flex: 1, minWidth: '120px' }}
                  >
                    {loading ? 'Resuming...' : '🔄 Retry Payment'}
                  </button>
                )}
                <button 
                  type="button"
                  className="btn btn-danger"
                  onClick={handleAbortPayment}
                  disabled={loading}
                  style={{ flex: 1, minWidth: '120px' }}
                >
                  Cancel Order
                </button>
              </>
            )}
          </div>
        </form>

        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '1rem', textAlign: 'center' }}>
          * This is a demo payment. All data is for testing purposes only.
        </p>
        {sessionId && <div style={{ fontSize: '0.7rem', marginTop: '0.5rem', textAlign: 'center' }}>Session: {sessionId}</div>}
      </div>
    </div>
  );
}

export default Payment;