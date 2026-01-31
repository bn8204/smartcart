/**
 * Payment Interrupt Handler Service
 * Manages payment interruptions, timeouts, retries, and recovery
 */

const orderRepo = require('../repositories/order.repository');
const notificationService = require('./notification.service');

// In-memory store for payment sessions (In production, use Redis)
const paymentSessions = new Map();

const PAYMENT_CONFIG = {
  TIMEOUT_MS: 30000, // 30 seconds timeout
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 2000,
  SESSION_EXPIRY_MS: 900000, // 15 minutes
};

/**
 * Create a payment session to track payment status
 */
exports.createPaymentSession = async (orderId, userId) => {
  const sessionId = `${orderId}-${userId}-${Date.now()}`;
  
  const session = {
    sessionId,
    orderId,
    userId,
    status: 'INITIATED',
    attempts: 0,
    startedAt: Date.now(),
    expiresAt: Date.now() + PAYMENT_CONFIG.SESSION_EXPIRY_MS,
    metadata: {
      interruptions: [],
      retries: [],
      lastActivity: Date.now()
    }
  };

  paymentSessions.set(sessionId, session);

  // Auto cleanup expired sessions
  setTimeout(() => {
    paymentSessions.delete(sessionId);
  }, PAYMENT_CONFIG.SESSION_EXPIRY_MS);

  return { sessionId, ...session };
};

/**
 * Get payment session details
 */
exports.getPaymentSession = (sessionId) => {
  return paymentSessions.get(sessionId);
};

/**
 * Handle payment interruption
 */
exports.handlePaymentInterruption = async (sessionId, reason, details = {}) => {
  const session = paymentSessions.get(sessionId);

  if (!session) {
    throw new Error('Payment session not found');
  }

  // Record interruption
  session.metadata.interruptions.push({
    timestamp: Date.now(),
    reason,
    details
  });

  session.status = 'INTERRUPTED';
  session.lastInterruptionReason = reason;

  console.log(`Payment interrupted for order ${session.orderId}:`, reason, details);

  return {
    sessionId,
    status: 'INTERRUPTED',
    message: 'Payment interrupted. You can resume or cancel.',
    canResume: session.attempts < PAYMENT_CONFIG.MAX_RETRIES
  };
};

/**
 * Resume a payment after interruption
 */
exports.resumePayment = async (sessionId) => {
  const session = paymentSessions.get(sessionId);

  if (!session) {
    throw new Error('Payment session not found');
  }

  if (session.status === 'COMPLETED') {
    return {
      status: 'ALREADY_COMPLETED',
      message: 'This payment was already completed'
    };
  }

  if (session.status === 'CANCELLED') {
    throw new Error('Payment was cancelled and cannot be resumed');
  }

  session.attempts++;
  session.metadata.retries.push({
    timestamp: Date.now(),
    attemptNumber: session.attempts
  });

  if (session.attempts > PAYMENT_CONFIG.MAX_RETRIES) {
    session.status = 'FAILED_MAX_RETRIES';
    throw new Error(`Maximum retry attempts (${PAYMENT_CONFIG.MAX_RETRIES}) exceeded`);
  }

  session.status = 'RESUMED';
  session.metadata.lastActivity = Date.now();

  return {
    sessionId,
    status: 'RESUMED',
    attempt: session.attempts,
    maxAttempts: PAYMENT_CONFIG.MAX_RETRIES,
    message: `Resuming payment attempt ${session.attempts}/${PAYMENT_CONFIG.MAX_RETRIES}`
  };
};

/**
 * Complete payment successfully
 */
exports.completePayment = async (sessionId, paymentDetails = {}) => {
  const session = paymentSessions.get(sessionId);

  if (!session) {
    throw new Error('Payment session not found');
  }

  session.status = 'COMPLETED';
  session.completedAt = Date.now();
  session.metadata.paymentDetails = paymentDetails;

  try {
    // Update order status to PAID after successful payment
    const result = await orderRepo.updateStatus(session.orderId, 'PAID');
    
    console.log(`Payment completed for order ${session.orderId}`);

    return {
      sessionId,
      orderId: session.orderId,
      status: 'COMPLETED',
      message: 'Payment processed successfully - Order marked as PAID',
      processingTime: session.completedAt - session.startedAt
    };
  } catch (error) {
    session.status = 'COMPLETION_FAILED';
    throw new Error('Failed to complete payment: ' + error.message);
  }
};

/**
 * Cancel payment
 */
exports.cancelPayment = async (sessionId, reason = 'User cancelled') => {
  console.log(`\n=== CANCEL PAYMENT REQUEST ===`);
  console.log(`Session ID: ${sessionId}`);
  console.log(`Reason: ${reason}`);
  
  const session = paymentSessions.get(sessionId);

  if (!session) {
    console.log(`Session not found for ID: ${sessionId}`);
    throw new Error('Payment session not found');
  }

  console.log(`Found session for order ${session.orderId}`);

  if (session.status === 'COMPLETED') {
    console.log(`Cannot cancel - payment already completed`);
    throw new Error('Cannot cancel a completed payment');
  }

  session.status = 'CANCELLED';
  session.cancelledAt = Date.now();
  session.cancelReason = reason;

  try {
    // Mark order as FAILED when payment is cancelled
    console.log(`Updating order ${session.orderId} status to FAILED`);
    const result = await orderRepo.updateStatus(session.orderId, 'FAILED');
    console.log(`Order status update result:`, result);
    
    console.log(`Payment cancelled for order ${session.orderId}:`, reason);
    console.log(`=== CANCEL PAYMENT COMPLETE ===\n`);

    return {
      sessionId,
      orderId: session.orderId,
      status: 'CANCELLED',
      message: 'Payment cancelled - Order marked as FAILED',
      reason
    };
  } catch (error) {
    console.error('Error cancelling payment:', error);
    throw new Error('Failed to cancel payment: ' + error.message);
  }
};

/**
 * Handle payment timeout
 */
exports.handlePaymentTimeout = async (sessionId) => {
  const session = paymentSessions.get(sessionId);

  if (!session) {
    throw new Error('Payment session not found');
  }

  const interruption = await exports.handlePaymentInterruption(
    sessionId,
    'TIMEOUT',
    { timeoutDuration: PAYMENT_CONFIG.TIMEOUT_MS }
  );

  return {
    ...interruption,
    canRetry: session.attempts < PAYMENT_CONFIG.MAX_RETRIES,
    timeoutDuration: PAYMENT_CONFIG.TIMEOUT_MS
  };
};

/**
 * Handle network error during payment
 */
exports.handleNetworkError = async (sessionId, error) => {
  const session = paymentSessions.get(sessionId);

  if (!session) {
    throw new Error('Payment session not found');
  }

  const interruption = await exports.handlePaymentInterruption(
    sessionId,
    'NETWORK_ERROR',
    { errorMessage: error.message }
  );

  return {
    ...interruption,
    suggestedAction: 'RETRY_OR_CANCEL'
  };
};

/**
 * Get payment session summary
 */
exports.getPaymentSessionSummary = (sessionId) => {
  const session = paymentSessions.get(sessionId);

  if (!session) {
    return null;
  }

  return {
    sessionId,
    orderId: session.orderId,
    userId: session.userId,
    status: session.status,
    attempts: session.attempts,
    maxAttempts: PAYMENT_CONFIG.MAX_RETRIES,
    durationSeconds: Math.round((Date.now() - session.startedAt) / 1000),
    interruptions: session.metadata.interruptions.length,
    lastInterruptionReason: session.lastInterruptionReason || null,
    canResume: 
      session.status === 'INTERRUPTED' && 
      session.attempts < PAYMENT_CONFIG.MAX_RETRIES
  };
};

/**
 * Cleanup expired sessions
 */
exports.cleanupExpiredSessions = () => {
  const now = Date.now();
  let cleanedCount = 0;

  paymentSessions.forEach((session, sessionId) => {
    if (session.expiresAt < now) {
      paymentSessions.delete(sessionId);
      cleanedCount++;
    }
  });

  if (cleanedCount > 0) {
    console.log(`Cleaned up ${cleanedCount} expired payment sessions`);
  }

  return cleanedCount;
};

/**
 * Get all active sessions (for monitoring)
 */
exports.getActiveSessions = () => {
  return Array.from(paymentSessions.values()).map(session => ({
    sessionId: session.sessionId,
    orderId: session.orderId,
    status: session.status,
    attempts: session.attempts,
    duration: Math.round((Date.now() - session.startedAt) / 1000)
  }));
};

// Periodic cleanup task (runs every 5 minutes)
setInterval(() => {
  exports.cleanupExpiredSessions();
}, 5 * 60 * 1000);

module.exports = exports;
