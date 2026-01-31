const paymentService = require('../services/payment.service');
const paymentInterruptService = require('../services/payment-interrupt.service');

exports.confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    await paymentService.confirmOrder(orderId);
    res.json({ message: 'SmartCart payment confirmed, order confirmation email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Payment confirmation failed' });
  }
};

// Payment Session Management Endpoints

/**
 * Create a new payment session
 */
exports.createPaymentSession = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user?.id || 'anonymous';

    const session = await paymentInterruptService.createPaymentSession(orderId, userId);

    res.json({
      success: true,
      sessionId: session.sessionId,
      maxAttempts: 3,
      message: 'Payment session created'
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create payment session' });
  }
};

/**
 * Get payment session details
 */
exports.getPaymentSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = paymentInterruptService.getPaymentSession(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Payment session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Resume payment after interruption
 */
exports.resumePaymentSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await paymentInterruptService.resumePayment(sessionId);

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Complete payment
 */
exports.completePaymentSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const paymentDetails = req.body;

    const result = await paymentInterruptService.completePayment(sessionId, paymentDetails);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Cancel payment
 */
exports.cancelPaymentSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { reason } = req.body;

    console.log(`\n>>> API CALL: POST /api/payments/session/${sessionId}/cancel`);
    console.log(`Reason: ${reason}`);

    const result = await paymentInterruptService.cancelPayment(sessionId, reason);

    console.log(`<<< RESPONSE: Payment cancelled successfully\n`);
    res.json(result);
  } catch (error) {
    console.error('Error in cancelPaymentSession:', error.message);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Handle payment interruption
 */
exports.handlePaymentInterruption = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { reason } = req.body;

    const result = await paymentInterruptService.handlePaymentInterruption(sessionId, reason);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get payment session summary
 */
exports.getPaymentSessionSummary = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const summary = paymentInterruptService.getPaymentSessionSummary(sessionId);

    if (!summary) {
      return res.status(404).json({ message: 'Payment session not found' });
    }

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all active payment sessions (admin endpoint)
 */
exports.getActiveSessions = async (req, res) => {
  try {
    const sessions = paymentInterruptService.getActiveSessions();
    res.json({ sessions, total: sessions.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};