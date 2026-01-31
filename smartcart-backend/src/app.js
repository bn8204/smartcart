const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Test route
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// API Routes - Load them individually with error handling
try {
  console.log('Loading user routes...');
  app.use('/api/users', require('./routes/user.routes'));
  console.log('User routes loaded');
  
  console.log('Loading product routes...');
  app.use('/api/products', require('./routes/product.routes'));
  console.log('Product routes loaded');
  
  console.log('Loading order routes...');
  app.use('/api/orders', require('./routes/order.routes'));
  console.log('Order routes loaded');
  
  console.log('Loading payment routes...');
  app.use('/api/payments', require('./routes/payment.routes'));
  console.log('Payment routes loaded');
  
  console.log('Loading rating routes...');
  app.use('/api/ratings', require('./routes/rating.routes'));
  console.log('Rating routes loaded');
  
  console.log('All routes loaded successfully');
} catch (error) {
  console.error('Error loading routes:', error.message);
  console.error('Stack:', error.stack);
}

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

module.exports = app;