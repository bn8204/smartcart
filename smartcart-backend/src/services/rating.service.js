/**
 * Rating & Feedback Service
 * Handles business logic for ratings and feedback
 */

const ratingRepo = require('../repositories/rating.repository');
const orderRepo = require('../repositories/order.repository');

/**
 * Submit product rating for an order
 */
exports.submitProductRating = async (orderId, productId, userId, rating, review) => {
  try {
    // Validate rating (1-5)
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if order exists and belongs to user
    const order = await orderRepo.getOrderById(orderId);
    if (!order || order.user_id !== userId) {
      throw new Error('Order not found or access denied');
    }

    // Check if order is delivered
    if (order.status !== 'DELIVERED') {
      throw new Error('Only delivered orders can be rated');
    }

    // Add rating
    const ratingResult = await ratingRepo.addProductRating(
      orderId,
      productId,
      userId,
      rating,
      review || ''
    );

    return {
      success: true,
      message: 'Product rating submitted successfully',
      ratingId: ratingResult.id
    };
  } catch (error) {
    console.error('Error submitting product rating:', error);
    throw error;
  }
};

/**
 * Get product ratings
 */
exports.getProductRatings = async (productId) => {
  try {
    const ratings = await ratingRepo.getProductRatings(productId);
    const avgRating = await ratingRepo.getProductAverageRating(productId);

    return {
      ratings,
      averageRating: avgRating.averageRating,
      totalRatings: avgRating.totalRatings
    };
  } catch (error) {
    console.error('Error getting product ratings:', error);
    throw error;
  }
};

/**
 * Submit delivery feedback
 */
exports.submitDeliveryFeedback = async (orderId, userId, rating, feedback, deliveryStatus) => {
  try {
    // Validate rating (1-5)
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Validate delivery status
    const validStatuses = ['ON_TIME', 'DELAYED', 'EARLY'];
    if (!validStatuses.includes(deliveryStatus)) {
      throw new Error('Invalid delivery status');
    }

    // Check if order exists and belongs to user
    const order = await orderRepo.getOrderById(orderId);
    if (!order || order.user_id !== userId) {
      throw new Error('Order not found or access denied');
    }

    // Check if order is delivered
    if (order.status !== 'DELIVERED') {
      throw new Error('Only delivered orders can have delivery feedback');
    }

    // Add delivery feedback
    const feedbackResult = await ratingRepo.addDeliveryFeedback(
      orderId,
      userId,
      rating,
      feedback || '',
      deliveryStatus
    );

    return {
      success: true,
      message: 'Delivery feedback submitted successfully',
      feedbackId: feedbackResult.id
    };
  } catch (error) {
    console.error('Error submitting delivery feedback:', error);
    throw error;
  }
};

/**
 * Get delivery feedback for order
 */
exports.getDeliveryFeedback = async (orderId) => {
  try {
    const feedback = await ratingRepo.getDeliveryFeedback(orderId);
    return feedback || null;
  } catch (error) {
    console.error('Error getting delivery feedback:', error);
    throw error;
  }
};

/**
 * Get user's delivery feedback history
 */
exports.getUserDeliveryFeedback = async (userId) => {
  try {
    const feedbacks = await ratingRepo.getUserDeliveryFeedback(userId);
    return feedbacks;
  } catch (error) {
    console.error('Error getting user delivery feedback:', error);
    throw error;
  }
};

/**
 * Get ratings for an order
 */
exports.getOrderRatings = async (orderId) => {
  try {
    const ratings = await ratingRepo.getOrderRatings(orderId);
    return ratings;
  } catch (error) {
    console.error('Error getting order ratings:', error);
    throw error;
  }
};

/**
 * Get delivery statistics (admin)
 */
exports.getDeliveryStatistics = async () => {
  try {
    const stats = await ratingRepo.getDeliveryStatistics();
    return stats;
  } catch (error) {
    console.error('Error getting delivery statistics:', error);
    throw error;
  }
};

module.exports = exports;
