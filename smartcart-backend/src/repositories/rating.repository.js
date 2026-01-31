/**
 * Rating & Feedback Repository
 * Handles product ratings and delivery feedback
 */

const db = require('../config/db');

/**
 * Add product rating
 */
exports.addProductRating = async (orderId, productId, userId, rating, review) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO product_ratings 
      (order_id, product_id, user_id, rating, review, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [orderId, productId, userId, rating, review], (err, result) => {
      if (err) {
        console.error('Error adding product rating:', err);
        reject(err);
      } else {
        resolve({
          id: result.insertId,
          orderId,
          productId,
          userId,
          rating,
          review,
          createdAt: new Date()
        });
      }
    });
  });
};

/**
 * Get ratings for a product
 */
exports.getProductRatings = async (productId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        id,
        order_id as orderId,
        product_id as productId,
        user_id as userId,
        rating,
        review,
        created_at as createdAt
      FROM product_ratings
      WHERE product_id = ?
      ORDER BY created_at DESC
    `;

    db.query(query, [productId], (err, results) => {
      if (err) {
        console.error('Error fetching product ratings:', err);
        reject(err);
      } else {
        resolve(results || []);
      }
    });
  });
};

/**
 * Get average rating for a product
 */
exports.getProductAverageRating = async (productId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        AVG(rating) as averageRating,
        COUNT(*) as totalRatings
      FROM product_ratings
      WHERE product_id = ?
    `;

    db.query(query, [productId], (err, results) => {
      if (err) {
        console.error('Error calculating average rating:', err);
        reject(err);
      } else {
        const result = results[0] || { averageRating: 0, totalRatings: 0 };
        resolve({
          averageRating: result.averageRating ? Math.round(result.averageRating * 10) / 10 : 0,
          totalRatings: result.totalRatings || 0
        });
      }
    });
  });
};

/**
 * Add delivery feedback
 */
exports.addDeliveryFeedback = async (orderId, userId, rating, feedback, deliveryStatus) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO delivery_feedback 
      (order_id, user_id, rating, feedback, delivery_status, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [orderId, userId, rating, feedback, deliveryStatus], (err, result) => {
      if (err) {
        console.error('Error adding delivery feedback:', err);
        reject(err);
      } else {
        resolve({
          id: result.insertId,
          orderId,
          userId,
          rating,
          feedback,
          deliveryStatus,
          createdAt: new Date()
        });
      }
    });
  });
};

/**
 * Get delivery feedback for an order
 */
exports.getDeliveryFeedback = async (orderId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        id,
        order_id as orderId,
        user_id as userId,
        rating,
        feedback,
        delivery_status as deliveryStatus,
        created_at as createdAt
      FROM delivery_feedback
      WHERE order_id = ?
    `;

    db.query(query, [orderId], (err, results) => {
      if (err) {
        console.error('Error fetching delivery feedback:', err);
        reject(err);
      } else {
        resolve(results[0] || null);
      }
    });
  });
};

/**
 * Get all delivery feedback for a user
 */
exports.getUserDeliveryFeedback = async (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        id,
        order_id as orderId,
        user_id as userId,
        rating,
        feedback,
        delivery_status as deliveryStatus,
        created_at as createdAt
      FROM delivery_feedback
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;

    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching user delivery feedback:', err);
        reject(err);
      } else {
        resolve(results || []);
      }
    });
  });
};

/**
 * Get ratings for an order (all products)
 */
exports.getOrderRatings = async (orderId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        id,
        order_id as orderId,
        product_id as productId,
        user_id as userId,
        rating,
        review,
        created_at as createdAt
      FROM product_ratings
      WHERE order_id = ?
      ORDER BY created_at DESC
    `;

    db.query(query, [orderId], (err, results) => {
      if (err) {
        console.error('Error fetching order ratings:', err);
        reject(err);
      } else {
        resolve(results || []);
      }
    });
  });
};

/**
 * Check if order is already rated
 */
exports.isOrderRated = async (orderId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COUNT(*) as count FROM product_ratings WHERE order_id = ?
    `;

    db.query(query, [orderId], (err, results) => {
      if (err) {
        console.error('Error checking if order is rated:', err);
        reject(err);
      } else {
        resolve(results[0].count > 0);
      }
    });
  });
};

/**
 * Get overall delivery statistics
 */
exports.getDeliveryStatistics = async () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        delivery_status as deliveryStatus,
        COUNT(*) as count,
        AVG(rating) as averageRating
      FROM delivery_feedback
      GROUP BY delivery_status
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching delivery statistics:', err);
        reject(err);
      } else {
        resolve(results || []);
      }
    });
  });
};

module.exports = exports;
