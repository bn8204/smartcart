# Rating & Feedback System - Documentation

## Overview

The Rating & Feedback system allows users to:
- **Rate Products** (1-5 stars) with optional reviews
- **Provide Delivery Feedback** about their delivery experience
- **Track Ratings History** for all their orders

---

## Features

### 📝 Product Ratings
- ✅ 5-star rating system
- ✅ Optional written reviews (up to 500 characters)
- ✅ Only available for delivered orders
- ✅ One rating per product per order
- ✅ View all ratings for a product

### 📦 Delivery Feedback
- ✅ 5-star delivery experience rating
- ✅ Delivery status tracking (On time, Early, Late)
- ✅ Optional detailed feedback (up to 500 characters)
- ✅ One feedback per order
- ✅ View delivery statistics

---

## Database Schema

### product_ratings Table
```sql
CREATE TABLE product_ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT (1-5),
  review TEXT (optional),
  created_at TIMESTAMP
)
```

### delivery_feedback Table
```sql
CREATE TABLE delivery_feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL UNIQUE,
  user_id INT NOT NULL,
  rating INT (1-5),
  feedback TEXT (optional),
  delivery_status ENUM('ON_TIME', 'EARLY', 'DELAYED'),
  created_at TIMESTAMP
)
```

---

## API Endpoints

### Product Ratings

#### Submit Product Rating
```
POST /api/ratings/product
Body: {
  orderId: number,
  productId: number,
  rating: number (1-5),
  review: string (optional, max 500 chars)
}
Response: {
  success: true,
  message: "Product rating submitted successfully",
  ratingId: number
}
```

#### Get Product Ratings
```
GET /api/ratings/product/:productId
Response: {
  ratings: [
    {
      id: number,
      orderId: number,
      productId: number,
      userId: number,
      rating: number,
      review: string,
      createdAt: timestamp
    }
  ],
  averageRating: number,
  totalRatings: number
}
```

#### Get Order Ratings
```
GET /api/ratings/order/:orderId
Response: [
  {
    id: number,
    orderId: number,
    productId: number,
    userId: number,
    rating: number,
    review: string,
    createdAt: timestamp
  }
]
```

### Delivery Feedback

#### Submit Delivery Feedback
```
POST /api/ratings/delivery
Body: {
  orderId: number,
  rating: number (1-5),
  feedback: string (optional, max 500 chars),
  deliveryStatus: "ON_TIME" | "EARLY" | "DELAYED"
}
Response: {
  success: true,
  message: "Delivery feedback submitted successfully",
  feedbackId: number
}
```

#### Get Delivery Feedback
```
GET /api/ratings/delivery/order/:orderId
Response: {
  id: number,
  orderId: number,
  userId: number,
  rating: number,
  feedback: string,
  deliveryStatus: string,
  createdAt: timestamp
}
```

#### Get User's Delivery Feedback History
```
GET /api/ratings/delivery/user/all
Response: [
  {
    id: number,
    orderId: number,
    userId: number,
    rating: number,
    feedback: string,
    deliveryStatus: string,
    createdAt: timestamp
  }
]
```

#### Get Delivery Statistics (Admin)
```
GET /api/ratings/delivery/statistics
Response: {
  statistics: [
    {
      deliveryStatus: string,
      count: number,
      averageRating: number,
      percentage: number
    }
  ]
}
```

---

## Frontend Components

### ProductRating Component
```jsx
import ProductRating from '../components/ProductRating';

<ProductRating 
  orderId={order.id}
  product={product}
  onRatingSubmit={(data) => {
    // Handle rating submission
    console.log('Rating:', data.rating, 'Review:', data.review);
  }}
/>
```

**Props:**
- `orderId` (number) - Order ID
- `product` (object) - Product details
- `onRatingSubmit` (function) - Callback when rating submitted

**Features:**
- 5-star rating selector
- Optional review text (max 500 chars)
- Character counter
- Submit button
- Success message after submission

### DeliveryFeedback Component
```jsx
import DeliveryFeedback from '../components/DeliveryFeedback';

<DeliveryFeedback 
  orderId={order.id}
  onFeedbackSubmit={(data) => {
    // Handle feedback submission
    console.log('Rating:', data.rating, 'Status:', data.deliveryStatus);
  }}
/>
```

**Props:**
- `orderId` (number) - Order ID
- `onFeedbackSubmit` (function) - Callback when feedback submitted

**Features:**
- Delivery status selector (On Time, Early, Late)
- 5-star experience rating
- Optional feedback text (max 500 chars)
- Character counter
- Submit button
- Success message after submission

---

## Usage Flow

### User Perspective

1. **Order Placed** → Payment Successful → Waiting for Delivery
2. **Order Delivered** → Status: DELIVERED
3. **View Orders** → Expand Order
4. **See Rating & Feedback Section** (only for DELIVERED orders)
5. **Rate Products** → Select 1-5 stars → Optional review → Submit
6. **Rate Delivery** → Select status → Select 1-5 stars → Optional feedback → Submit
7. **Success Message** → Feedback recorded

### Admin Perspective

1. **View Delivery Statistics** → `GET /api/ratings/delivery/statistics`
2. **See Breakdown** → On Time %, Early %, Delayed %
3. **See Delivery Ratings** → Average rating by status
4. **Review Product Ratings** → Get product-wise ratings

---

## Validation Rules

### Product Rating
- ✅ Rating must be 1-5
- ✅ Order must exist and belong to user
- ✅ Order must have status DELIVERED
- ✅ Review max 500 characters
- ✅ One rating per product per order

### Delivery Feedback
- ✅ Rating must be 1-5
- ✅ Order must exist and belong to user
- ✅ Order must have status DELIVERED
- ✅ Delivery status must be ON_TIME, EARLY, or DELAYED
- ✅ Feedback max 500 characters
- ✅ One feedback per order (unique constraint)

---

## Error Handling

### Common Errors

#### Invalid Rating
```
Status: 400
{
  "message": "Rating must be between 1 and 5"
}
```

#### Order Not Found
```
Status: 400
{
  "message": "Order not found or access denied"
}
```

#### Order Not Delivered
```
Status: 400
{
  "message": "Only delivered orders can be rated"
}
```

#### Missing Required Fields
```
Status: 400
{
  "message": "Order ID, Product ID, and rating are required"
}
```

---

## Database Views

### product_rating_stats
Shows rating statistics for each product:
```sql
SELECT 
  product_id,
  product_name,
  total_ratings,
  average_rating,
  last_rating_date
FROM product_rating_stats;
```

### delivery_feedback_stats
Shows delivery feedback breakdown:
```sql
SELECT 
  delivery_status,
  count,
  average_rating,
  percentage
FROM delivery_feedback_stats;
```

---

## Integration with Orders Page

The Orders page automatically shows rating & feedback sections for delivered orders:

```jsx
{order.status === 'DELIVERED' && (
  <div>
    {/* Product Ratings for each item */}
    {orderItems[order.id]?.map((item) => (
      <ProductRating 
        orderId={order.id}
        product={item}
        onRatingSubmit={...}
      />
    ))}

    {/* Delivery Feedback */}
    <DeliveryFeedback 
      orderId={order.id}
      onFeedbackSubmit={...}
    />
  </div>
)}
```

---

## User Experience Flow

```
My Orders Page
  ↓
View Order #123
  ↓
Order Status: DELIVERED ✓
  ↓
Show "Leave Feedback" Section
  ↓
├─ Product 1: [★★★★★] [Write Review...]
├─ Product 2: [★★★★☆] [Write Review...]
└─ Delivery: [Choose Status] [★★★★★] [Write Feedback...]
  ↓
Submit Ratings & Feedback
  ↓
Success Messages
  ↓
Feedback Recorded
```

---

## Admin Dashboard Integration (Future)

- View all ratings/feedback
- Filter by date range
- Sort by rating
- View trends
- Export reports
- Monitor product performance
- Track delivery performance

---

## Files Created

### Backend
- `smartcart-backend/src/repositories/rating.repository.js` - Database operations
- `smartcart-backend/src/services/rating.service.js` - Business logic
- `smartcart-backend/src/controllers/rating.controller.js` - HTTP handlers
- `smartcart-backend/src/routes/rating.routes.js` - API routes
- `smartcart-backend/src/config/rating_schema.sql` - Database schema

### Frontend
- `smartcart-frontend/src/components/ProductRating.js` - Product rating component
- `smartcart-frontend/src/components/DeliveryFeedback.js` - Delivery feedback component

### Modified
- `smartcart-frontend/src/pages/Orders.js` - Added rating/feedback sections
- `smartcart-frontend/src/services/api.js` - Added rating service methods
- `smartcart-backend/src/app.js` - Added rating routes

---

## Testing Checklist

- [ ] Submit product rating (1-5 stars)
- [ ] Add review text (max 500 chars)
- [ ] Verify success message
- [ ] Submit delivery feedback
- [ ] Select delivery status (On Time/Early/Late)
- [ ] Add feedback text (max 500 chars)
- [ ] Get product ratings
- [ ] Get delivery feedback
- [ ] View delivery statistics
- [ ] Verify validations (rating range, order status, etc.)
- [ ] Verify only DELIVERED orders show rating section
- [ ] Verify unique constraint on delivery feedback (one per order)

---

## Performance Considerations

### Database
- Indexed on product_id, order_id, user_id for fast lookups
- Views for aggregated statistics
- UNIQUE constraint on delivery_feedback.order_id

### Frontend
- Lazy loading of rating components
- Minimal re-renders
- Client-side form validation
- Optimistic UI updates

### Backend
- Database connection pooling
- Efficient queries with proper indexing
- Caching for product statistics (optional)

---

## Security Considerations

- ✅ User ownership validation on all operations
- ✅ Order status verification (must be DELIVERED)
- ✅ Input validation (rating 1-5, text length)
- ✅ SQL injection prevention (parameterized queries)
- ✅ Authorization checks
- ✅ No sensitive data exposure

---

## Future Enhancements

1. **Email Notifications** - Notify sellers when product rated
2. **Admin Dashboard** - Visual analytics and reports
3. **Seller Responses** - Allow sellers to respond to reviews
4. **Helpful Votes** - Users vote on helpful reviews
5. **Verified Purchase Badge** - Show verified purchase indicator
6. **Photo Reviews** - Allow users to upload images
7. **Review Moderation** - Flag inappropriate reviews
8. **Sentiment Analysis** - Analyze review sentiment
9. **Recommendation Engine** - Use ratings for recommendations
10. **Comparison Charts** - Compare product ratings

---

**Version**: 1.0.0  
**Created**: January 31, 2026  
**Status**: ✅ Complete
