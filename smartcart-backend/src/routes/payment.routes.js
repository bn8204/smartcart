const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Legacy endpoint
router.post('/confirm', paymentController.confirmPayment);

// Payment Session Management Routes
router.post('/session/create', paymentController.createPaymentSession);
router.get('/session/:sessionId', paymentController.getPaymentSession);
router.post('/session/:sessionId/resume', paymentController.resumePaymentSession);
router.post('/session/:sessionId/complete', paymentController.completePaymentSession);
router.post('/session/:sessionId/cancel', paymentController.cancelPaymentSession);
router.post('/session/:sessionId/interrupt', paymentController.handlePaymentInterruption);
router.get('/session/:sessionId/summary', paymentController.getPaymentSessionSummary);

// Admin endpoint for monitoring
router.get('/sessions/active', paymentController.getActiveSessions);

module.exports = router;