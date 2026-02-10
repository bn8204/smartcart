const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');

// Product ratings
router.post('/product', ratingController.submitProductRating);
router.get('/product/:productId', ratingController.getProductRatings);
router.get('/order/:orderId', ratingController.getOrderRatings);

// Delivery feedback
router.post('/delivery', ratingController.submitDeliveryFeedback);
router.get('/delivery/order/:orderId', ratingController.getDeliveryFeedback);
router.get('/delivery/user/all', ratingController.getUserDeliveryFeedback);

// Admin statistics
router.get('/delivery/statistics', ratingController.getDeliveryStatistics);

module.exports = router;
