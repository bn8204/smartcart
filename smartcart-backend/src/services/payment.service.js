const orderRepo = require('../repositories/order.repository');
const notificationService = require('./notification.service');

exports.confirmOrder = async (orderId) => {
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  try {
    console.log('Processing payment for order:', orderId);
    
    // Keep order as PENDING - admin will verify and approve
    const updateResult = await orderRepo.updateStatus(orderId, 'PENDING');
    console.log('Order status updated to PENDING:', updateResult);
    
    return { success: true, orderId, message: 'Payment submitted for verification' };
  } catch (error) {
    console.error('Payment confirmation error:', error);
    throw new Error('Failed to process payment: ' + error.message);
  }
};