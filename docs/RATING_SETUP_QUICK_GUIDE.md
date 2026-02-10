# Rating & Feedback System - Quick Setup Guide

## Step 1: Initialize Database

Run the SQL schema to create the required tables:

```bash
# Navigate to the backend directory
cd smartcart-backend

# Execute the schema file
mysql -u root -p smartcart_db < src/config/rating_schema.sql
```

**What Gets Created:**
- `product_ratings` table
- `delivery_feedback` table
- `product_rating_stats` view
- `delivery_feedback_stats` view

---

## Step 2: Verify Backend Files Exist

Check these files are created in your backend:

```
smartcart-backend/src/
├── repositories/rating.repository.js
├── services/rating.service.js
├── controllers/rating.controller.js
├── routes/rating.routes.js
└── config/rating_schema.sql
```

**Verify in app.js:**
```javascript
app.use('/api/ratings', require('./routes/rating.routes'));
```

---

## Step 3: Verify Frontend Files Exist

Check these files are created in your frontend:

```
smartcart-frontend/src/
├── components/
│   ├── ProductRating.js
│   └── DeliveryFeedback.js
├── pages/Orders.js (modified)
└── services/api.js (modified)
```

---

## Step 4: Enable API Calls in Orders.js

Update the callback functions to make actual API calls:

```javascript
// Find these callback handlers in Orders.js
const handleRatingSubmit = async (data) => {
  try {
    const response = await ratingService.submitProductRating({
      orderId: data.orderId,
      productId: data.productId,
      rating: data.rating,
      review: data.review
    });
    console.log('Rating submitted:', response);
    // Show success toast
  } catch (error) {
    console.error('Error submitting rating:', error);
    // Show error toast
  }
};

const handleFeedbackSubmit = async (data) => {
  try {
    const response = await ratingService.submitDeliveryFeedback({
      orderId: data.orderId,
      rating: data.rating,
      feedback: data.feedback,
      deliveryStatus: data.deliveryStatus
    });
    console.log('Feedback submitted:', response);
    // Show success toast
  } catch (error) {
    console.error('Error submitting feedback:', error);
    // Show error toast
  }
};
```

---

## Step 5: Test the System

### 1. Verify Database Tables Created
```bash
mysql -u root -p smartcart_db
```

```sql
-- Check tables
SHOW TABLES LIKE '%rating%';
DESCRIBE product_ratings;
DESCRIBE delivery_feedback;

-- Check views
SHOW TABLES LIKE '%stats%';
```

### 2. Test API Endpoints

```bash
# Get product ratings
curl -X GET http://localhost:5000/api/ratings/product/1

# Submit product rating
curl -X POST http://localhost:5000/api/ratings/product \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "orderId": 1,
    "productId": 1,
    "rating": 5,
    "review": "Great product!"
  }'

# Submit delivery feedback
curl -X POST http://localhost:5000/api/ratings/delivery \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "orderId": 1,
    "rating": 4,
    "deliveryStatus": "ON_TIME",
    "feedback": "Arrived quickly"
  }'

# Get delivery statistics
curl -X GET http://localhost:5000/api/ratings/delivery/statistics
```

### 3. Test in Frontend
1. Go to Orders page
2. Find a delivered order
3. Expand the order
4. You should see "Leave Feedback" section
5. Try submitting a product rating
6. Try submitting delivery feedback
7. Check browser console for success messages

---

## Step 6: Complete Integration

### Option A: Add Toast Notifications (Recommended)
```javascript
// Install react-toastify
npm install react-toastify

// Import in Orders.js
import { toast } from 'react-toastify';

// Use in callbacks
toast.success('Rating submitted successfully!');
toast.error('Failed to submit rating');
```

### Option B: Show Modal/Alert
```javascript
handleRatingSubmit = async (data) => {
  try {
    const response = await ratingService.submitProductRating(data);
    alert('Rating submitted successfully!');
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

---

## Step 7: Monitor & Maintain

### Check Database Growth
```sql
-- Check product ratings count
SELECT COUNT(*) FROM product_ratings;

-- Check delivery feedback count
SELECT COUNT(*) FROM delivery_feedback;

-- View statistics
SELECT * FROM product_rating_stats;
SELECT * FROM delivery_feedback_stats;
```

### Monitor API Logs
```bash
# Check backend logs for errors
tail -f smartcart-backend/logs/app.log
```

---

## Validation Rules Reference

### Product Rating
- Rating: 1-5 (required)
- Review: 0-500 characters (optional)
- Order: Must be DELIVERED
- Ownership: User must own the order

### Delivery Feedback
- Rating: 1-5 (required)
- Status: ON_TIME | EARLY | DELAYED (required)
- Feedback: 0-500 characters (optional)
- Order: Must be DELIVERED
- Unique: Only one feedback per order

---

## Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Rating must be between 1 and 5" | Invalid rating value | Select 1-5 stars |
| "Order not found or access denied" | Order doesn't exist or user doesn't own it | Try different order |
| "Only delivered orders can be rated" | Order status is not DELIVERED | Wait for delivery |
| "Order ID, Product ID, and rating are required" | Missing required fields | Fill all required fields |
| "Delivery status must be ON_TIME, EARLY, or DELAYED" | Invalid delivery status | Choose valid status |

---

## File Dependencies

```
Orders.js
  ├── ProductRating.js
  ├── DeliveryFeedback.js
  └── api.js (ratingService)
      └── Backend: /api/ratings/*

Backend Routes
  ├── rating.routes.js
  ├── rating.controller.js
  ├── rating.service.js
  └── rating.repository.js
      └── Database tables
```

---

## Environment Variables (if needed)

Add to `.env` in smartcart-backend:
```
DB_RATING_HOST=localhost
DB_RATING_PORT=3306
DB_RATING_NAME=smartcart_db
DB_RATING_USER=root
DB_RATING_PASS=your_password
```

---

## Troubleshooting

### Issue: Components don't appear
**Solution:** 
1. Check if order status is "DELIVERED"
2. Check browser console for errors
3. Verify components imported in Orders.js

### Issue: API calls fail with 401
**Solution:**
1. Check if authentication token is set
2. Verify token is not expired
3. Check if user is logged in

### Issue: Database tables don't exist
**Solution:**
1. Run schema file again: `mysql ... < rating_schema.sql`
2. Check MySQL error logs
3. Verify database permissions

### Issue: No success message after submit
**Solution:**
1. Check console for errors
2. Add toast notifications
3. Verify API response structure

---

## Next Steps

1. ✅ Initialize database
2. ✅ Verify files created
3. ✅ Enable API calls
4. ✅ Test endpoints
5. ✅ Add notifications
6. Optional: Create admin dashboard
7. Optional: Add advanced features

---

## Support & Documentation

- Full Documentation: See [RATING_AND_FEEDBACK_DOCUMENTATION.md](RATING_AND_FEEDBACK_DOCUMENTATION.md)
- API Reference: See Rating API endpoints section above
- Component Guide: See ProductRating and DeliveryFeedback component sections
- Database Guide: See Database Schema section above

---

**Quick Commands**

```bash
# Initialize database
mysql -u root -p smartcart_db < smartcart-backend/src/config/rating_schema.sql

# Start backend
cd smartcart-backend && npm start

# Start frontend
cd smartcart-frontend && npm start

# Test API
curl http://localhost:5000/api/ratings/delivery/statistics
```

---

**Version**: 1.0.0  
**Date**: January 31, 2026  
**Status**: ✅ Ready to Deploy
