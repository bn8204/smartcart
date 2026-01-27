const emailRepo = require('../repositories/email.repository');

exports.sendOrderConfirmation = async (orderId) => {
  if (!orderId) {
    throw new Error('Order ID is required for sending confirmation');
  }

  try {
    console.log(`SmartCart: Sending order confirmation email for order ${orderId}`);
    const result = await emailRepo.logEmail(orderId);
    console.log(`SmartCart: Order confirmation email sent for order ${orderId}`);
    return result;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Failed to send notification: ' + error.message);
  }
};