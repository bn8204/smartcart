import React, { useState } from 'react';

function DeliveryFeedback({ orderId, onFeedbackSubmit }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('ON_TIME');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a delivery rating');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // In real implementation, call API
      // await ratingService.submitDeliveryFeedback({
      //   orderId,
      //   rating,
      //   feedback,
      //   deliveryStatus
      // });

      setSubmitted(true);
      if (onFeedbackSubmit) {
        onFeedbackSubmit({ rating, feedback, deliveryStatus });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit delivery feedback');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '4px',
        padding: '1rem',
        color: '#155724'
      }}>
        <p>✅ Thank you for your delivery feedback!</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      padding: '1rem',
      marginBottom: '1rem'
    }}>
      <h4>📦 Delivery Feedback</h4>
      
      {/* Delivery Status */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          How was the delivery?
        </label>
        <select
          value={deliveryStatus}
          onChange={(e) => setDeliveryStatus(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
        >
          <option value="ON_TIME">✅ Delivered on time</option>
          <option value="EARLY">🚀 Delivered early</option>
          <option value="DELAYED">⏳ Delivered late</option>
        </select>
      </div>

      {/* Star Rating */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Delivery Experience Rating
        </label>
        <div style={{ fontSize: '1.5rem', letterSpacing: '0.5rem' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleStarClick(star)}
              style={{
                cursor: 'pointer',
                color: star <= rating ? '#ffc107' : '#ddd',
                marginRight: '0.5rem',
                transition: 'color 0.2s'
              }}
            >
              ★
            </span>
          ))}
        </div>
        {rating > 0 && <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          {rating === 1 && 'Poor'}
          {rating === 2 && 'Fair'}
          {rating === 3 && 'Good'}
          {rating === 4 && 'Very Good'}
          {rating === 5 && 'Excellent'}
        </p>}
      </div>

      {/* Feedback Text */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Additional Feedback (Optional)
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us about your delivery experience (packaging, driver professionalism, etc.)..."
          maxLength={500}
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '0.5rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
          {feedback.length}/500 characters
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || rating === 0}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: rating === 0 ? '#ccc' : '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: rating === 0 ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </div>
  );
}

export default DeliveryFeedback;
