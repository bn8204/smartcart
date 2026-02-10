/**
 * Rating & Feedback Controller
 * Handles HTTP requests for ratings and feedback
 */

const ratingService = require('../services/rating.service');

/**
 * Submit product rating
 */
exports.submitProductRating = async (req, res) => {
  try {
    const { orderId, productId, rating, review } = req.body;
    const userId = req.user?.id;

    if (!orderId || !productId || !rating) {
      return res.status(400).json({
        message: 'Order ID, Product ID, and rating are required'
      });
    }

    const result = await ratingService.submitProductRating(
      orderId,
      productId,
      userId,
      rating,
      review
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get product ratings
 */
exports.getProductRatings = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const result = await ratingService.getProductRatings(productId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Submit delivery feedback
 */
exports.submitDeliveryFeedback = async (req, res) => {
  try {
    const { orderId, rating, feedback, deliveryStatus } = req.body;
    const userId = req.user?.id;

    if (!orderId || !rating || !deliveryStatus) {
      return res.status(400).json({
        message: 'Order ID, rating, and delivery status are required'
      });
    }

    const result = await ratingService.submitDeliveryFeedback(
      orderId,
      userId,
      rating,
      feedback,
      deliveryStatus
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get delivery feedback for order
 */
exports.getDeliveryFeedback = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const feedback = await ratingService.getDeliveryFeedback(orderId);
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get user's delivery feedback history
 */
exports.getUserDeliveryFeedback = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const feedbacks = await ratingService.getUserDeliveryFeedback(userId);
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get ratings for an order
 */
exports.getOrderRatings = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const ratings = await ratingService.getOrderRatings(orderId);
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get delivery statistics (admin)
 */
exports.getDeliveryStatistics = async (req, res) => {
  try {
    const stats = await ratingService.getDeliveryStatistics();
    res.json({ statistics: stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
