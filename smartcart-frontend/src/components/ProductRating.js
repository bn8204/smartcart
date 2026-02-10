import React, { useState } from 'react';

function ProductRating({ orderId, product, onRatingSubmit }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // In real implementation, call API
      // await ratingService.submitProductRating({
      //   orderId,
      //   productId: product.id,
      //   rating,
      //   review
      // });

      setSubmitted(true);
      if (onRatingSubmit) {
        onRatingSubmit({ rating, review });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit rating');
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
        <p>✅ Thank you for rating {product?.product_name || product?.name}!</p>
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
      <h4>Rate this product</h4>
      
      {/* Star Rating */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Product Quality
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

      {/* Review Text */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Review (Optional)
        </label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience with this product..."
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
          {review.length}/500 characters
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
          backgroundColor: rating === 0 ? '#ccc' : '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: rating === 0 ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'Submitting...' : 'Submit Rating'}
      </button>
    </div>
  );
}

export default ProductRating;
