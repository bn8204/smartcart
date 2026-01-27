const paymentService = require('../services/payment.service');

exports.confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    await paymentService.confirmOrder(orderId);
    res.json({ message: 'SmartCart payment confirmed, order confirmation email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Payment confirmation failed' });
  }
};