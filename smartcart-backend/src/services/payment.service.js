const orderRepo = require('../repositories/order.repository');
const notificationService = require('./notification.service');

exports.confirmOrder = async (orderId) => {
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  try {
    console.log('Processing payment for order:', orderId);
    
    // Update order status to PAID after successful payment
    const updateResult = await orderRepo.updateStatus(orderId, 'PAID');
    console.log('Order status updated to PAID:', updateResult);
    
    return { success: true, orderId, message: 'Payment confirmed and order marked as PAID' };
  } catch (error) {
    console.error('Payment confirmation error:', error);
    throw new Error('Failed to process payment: ' + error.message);
  }
};