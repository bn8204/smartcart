/**
 * Payment Status Polling Service
 * Monitors payment status and handles real-time updates
 */

export class PaymentStatusPoller {
  constructor(sessionId, apiService, options = {}) {
    this.sessionId = sessionId;
    this.apiService = apiService;
    this.pollingInterval = options.pollingInterval || 2000; // 2 seconds
    this.maxAttempts = options.maxAttempts || 30; // 60 seconds total
    this.pollCount = 0;
    this.isPolling = false;
    this.pollingTimer = null;
    
    // Callbacks
    this.onStatusChange = options.onStatusChange || (() => {});
    this.onComplete = options.onComplete || (() => {});
    this.onError = options.onError || (() => {});
  }

  /**
   * Start polling for payment status
   */
  start() {
    if (this.isPolling) {
      console.warn('Polling already started');
      return;
    }

    this.isPolling = true;
    this.pollCount = 0;
    console.log(`Starting payment status polling for session ${this.sessionId}`);
    
    this.poll();
  }

  /**
   * Stop polling
   */
  stop() {
    this.isPolling = false;
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
      this.pollingTimer = null;
    }
    console.log('Stopped payment status polling');
  }

  /**
   * Poll payment status
   */
  poll = async () => {
    if (!this.isPolling) {
      return;
    }

    this.pollCount++;

    try {
      const response = await this.apiService.getPaymentSession(this.sessionId);
      const session = response.data;

      // Update status
      this.onStatusChange(session);

      // Check if payment is completed
      if (session.status === 'COMPLETED') {
        this.stop();
        this.onComplete(session);
        return;
      }

      // Check if payment failed
      if (session.status === 'CANCELLED' || session.status === 'FAILED_MAX_RETRIES') {
        this.stop();
        this.onError(session);
        return;
      }

      // Max poll attempts reached
      if (this.pollCount >= this.maxAttempts) {
        this.stop();
        this.onError({
          status: 'POLLING_TIMEOUT',
          message: 'Payment status check timeout',
          session
        });
        return;
      }

      // Schedule next poll
      this.pollingTimer = setTimeout(this.poll, this.pollingInterval);
    } catch (error) {
      console.error('Error polling payment status:', error);
      
      if (this.pollCount >= this.maxAttempts) {
        this.stop();
        this.onError(error);
      } else {
        // Retry polling on error
        this.pollingTimer = setTimeout(this.poll, this.pollingInterval);
      }
    }
  };

  /**
   * Get polling status
   */
  getStatus() {
    return {
      isPolling: this.isPolling,
      pollCount: this.pollCount,
      maxAttempts: this.maxAttempts,
      progress: Math.round((this.pollCount / this.maxAttempts) * 100)
    };
  }
}

/**
 * Higher-level hook for React components
 */
export const usePaymentStatusPoller = (sessionId, apiService, options = {}) => {
  const [pollerStatus, setPollerStatus] = React.useState(null);
  const [paymentStatus, setPaymentStatus] = React.useState(null);
  const [isComplete, setIsComplete] = React.useState(false);
  const [error, setError] = React.useState(null);
  const pollerRef = React.useRef(null);

  React.useEffect(() => {
    if (!sessionId) return;

    const poller = new PaymentStatusPoller(sessionId, apiService, {
      ...options,
      onStatusChange: (session) => {
        setPaymentStatus(session);
        setPollerStatus(poller.getStatus());
      },
      onComplete: (session) => {
        setPaymentStatus(session);
        setIsComplete(true);
        setPollerStatus(poller.getStatus());
      },
      onError: (errorData) => {
        setError(errorData);
        setPollerStatus(poller.getStatus());
      }
    });

    pollerRef.current = poller;
    poller.start();

    return () => {
      if (pollerRef.current) {
        pollerRef.current.stop();
      }
    };
  }, [sessionId, apiService, options]);

  const stopPolling = () => {
    if (pollerRef.current) {
      pollerRef.current.stop();
    }
  };

  return {
    paymentStatus,
    isComplete,
    error,
    pollerStatus,
    stopPolling
  };
};

export default PaymentStatusPoller;
