# Payment Interrupt Handling - Architecture & Flow Diagrams

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐         ┌──────────────────┐                  │
│  │ Payment.js   │────────▶ │ api.js Services  │                 │
│  │ Component    │         │ (paymentService) │                 │
│  └──────────────┘         └──────────────────┘                 │
│                                    │                             │
│                                    ├─▶ Create Session            │
│                                    ├─▶ Resume Session            │
│                                    ├─▶ Complete Session          │
│                                    ├─▶ Cancel Session            │
│                                    └─▶ Poll Status              │
│                                                                   │
│  ┌─────────────────────────────┐                                │
│  │ PaymentStatusPoller.js       │                                │
│  │ (Real-time monitoring)       │                                │
│  └─────────────────────────────┘                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────┐                   │
│  │ payment.routes.js                        │                   │
│  │ /session/create, /resume, /complete ...  │                   │
│  └──────────────────────────────────────────┘                   │
│                      │                                            │
│                      ▼                                            │
│  ┌──────────────────────────────────────────┐                   │
│  │ payment.controller.js                    │                   │
│  │ 8 Endpoint Handlers                      │                   │
│  └──────────────────────────────────────────┘                   │
│                      │                                            │
│                      ▼                                            │
│  ┌──────────────────────────────────────────┐                   │
│  │ payment-interrupt.service.js             │                   │
│  │ - Session Management                     │                   │
│  │ - Interrupt Handling                     │                   │
│  │ - Retry Logic                            │                   │
│  │ - Cleanup & Expiry                       │                   │
│  └──────────────────────────────────────────┘                   │
│                      │                                            │
│                      ▼                                            │
│  ┌──────────────────────────────────────────┐                   │
│  │ In-Memory Session Store                  │                   │
│  │ (Map: sessionId → SessionData)            │                   │
│  └──────────────────────────────────────────┘                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Payment Flow Diagram

### 1. Normal/Successful Payment Flow

```
User
  │
  ├─ Opens Payment Modal
  │  └─▶ Component Mounts
  │     └─▶ Create Session
  │        └─▶ Session ID: "123-456-..."
  │
  ├─ Fills Payment Form
  │  └─▶ cardNumber, cardHolder, expiry, CVV
  │
  ├─ Clicks "Submit Payment"
  │  └─▶ handleSubmit()
  │     └─▶ validatePaymentData() ✓
  │        └─▶ initiatePaymentWithTimeout()
  │           ├─▶ Create AbortController
  │           ├─▶ Set 30s timeout
  │           └─▶ POST /payments/confirm
  │
  ├─ Wait for Response
  │  └─▶ completePaymentSession()
  │     └─▶ Status: COMPLETED
  │
  └─▶ Success Message
     └─▶ "✅ Payment submitted! Waiting for verification..."
        └─▶ Redirect to Orders (2s delay)
```

---

### 2. Timeout Interruption Flow

```
User
  │
  ├─ Clicks "Submit Payment"
  │  └─▶ initiatePaymentWithTimeout()
  │     ├─▶ timeoutRef = setTimeout(..., 30000)
  │     └─▶ API request in progress...
  │
  ├─ 30 Seconds Pass ⏱️
  │  └─▶ Timeout triggers
  │     └─▶ abortController.abort()
  │        └─▶ Request cancelled
  │
  ├─ handlePaymentTimeout()
  │  └─▶ handlePaymentInterruption(sessionId, 'TIMEOUT')
  │     └─▶ Session Status: INTERRUPTED
  │        └─▶ Set canResume = true (attemptCount < maxAttempts)
  │
  ├─ UI Updates
  │  └─▶ Show Warning: "⏱️ Payment timeout (attempt 1/3)"
  │     └─▶ Show Buttons: [Retry] [Cancel]
  │        └─▶ setLoading(false)
  │           └─▶ setIsInterrupted(true)
  │
  ├─ User Clicks "🔄 Retry Payment"
  │  └─▶ resumePayment()
  │     ├─▶ resumePaymentSession(sessionId)
  │     │  └─▶ Session Status: RESUMED
  │     │     └─▶ attempts++
  │     │
  │     └─▶ retryPayment()
  │        └─▶ initiatePaymentWithTimeout() again
  │           └─▶ Attempt 2 of 3
  │
  └─▶ Payment Success or Another Interrupt
     └─▶ Continue...
```

---

### 3. Network Error Interruption Flow

```
User
  │
  ├─ Clicks "Submit Payment"
  │  └─▶ initiatePaymentWithTimeout()
  │     └─▶ API Request (Network Active)
  │
  ├─ Network Drops 🌐
  │  └─▶ Network Error (ECONNABORTED or no response)
  │
  ├─ catch(error)
  │  └─▶ handlePaymentError(error)
  │     ├─▶ Check: isNetworkError = !response || code === ECONNABORTED
  │     └─▶ YES: Network Error Detected
  │        └─▶ handlePaymentInterruption(sessionId, 'NETWORK_ERROR')
  │           └─▶ Session Status: INTERRUPTED
  │
  ├─ UI Updates
  │  └─▶ Show Warning: "🌐 Network error detected (attempt 1/3)"
  │     └─▶ Show Buttons: [Retry] [Cancel]
  │        └─▶ setCanResume = true
  │
  ├─ User Reconnects Network
  │  └─▶ Ready to Retry
  │
  ├─ User Clicks "🔄 Retry Payment"
  │  └─▶ resumePayment()
  │     └─▶ retryPayment()
  │        └─▶ New attempt with fresh network
  │
  └─▶ Payment Success (Connection Restored)
     └─▶ "✅ Payment submitted!"
```

---

### 4. Max Retries Exceeded Flow

```
User
  │
  ├─ Attempt 1: Submit Payment
  │  └─▶ ⏱️ Timeout
  │     └─▶ Show "Retry" button
  │
  ├─ Attempt 2: Click "Retry"
  │  └─▶ 🌐 Network Error
  │     └─▶ Show "Retry" button
  │
  ├─ Attempt 3: Click "Retry"
  │  └─▶ ⏱️ Timeout Again
  │     └─▶ attemptCount = 3
  │        └─▶ Max Retries: 3/3
  │
  ├─ Backend Check
  │  └─▶ if (session.attempts > MAX_RETRIES) {
  │     └─▶ throw Error("Maximum retry attempts exceeded")
  │        └─▶ Session Status: FAILED_MAX_RETRIES
  │
  ├─ Frontend Check
  │  └─▶ if (attemptCount >= maxAttempts) {
  │     └─▶ setCanResume(false)
  │        └─▶ Hide Retry button
  │
  └─▶ UI Shows
     └─▶ "❌ Maximum retry attempts (3/3) exceeded"
        └─▶ Only [Cancel Order] button available
           └─▶ User must try again later
```

---

### 5. User Cancellation Flow

```
User
  │
  ├─ During Payment (Loading)
  │  └─▶ Can click "Cancel" button at any time
  │
  ├─ User Clicks "Cancel"
  │  └─▶ handleAbortPayment()
  │     │
  │     ├─▶ if (abortControllerRef) {
  │     │  └─▶ abortController.abort()  [Cancel request]
  │     │
  │     ├─▶ if (timeoutRef) {
  │     │  └─▶ clearTimeout()  [Cancel timer]
  │     │
  │     ├─▶ if (sessionId) {
  │     │  └─▶ cancelPaymentSession(sessionId, 'User aborted')
  │     │     └─▶ POST /payments/session/:id/cancel
  │     │        └─▶ Session Status: CANCELLED
  │     │           └─▶ Update Order to PENDING
  │     │
  │     ├─▶ setLoading(false)
  │     ├─▶ setIsInterrupted(false)
  │     └─▶ Show: "Payment cancelled"
  │
  └─▶ After 1 second
     └─▶ onPaymentCancel()
        └─▶ Close modal
           └─▶ Return to Cart
```

---

### 6. Browser Unload Warning Flow

```
User
  │
  ├─ During Payment (loading = true)
  │  └─▶ useEffect sets up beforeunload listener
  │     └─▶ window.addEventListener('beforeunload', handler)
  │
  ├─ Tries to Close Tab/Window
  │  └─▶ beforeunload event fires
  │     └─▶ if (loading && sessionId) {
  │        └─▶ Show Browser Warning:
  │           "⚠️ Payment is in progress.
  │            Are you sure you want to leave?"
  │
  ├─ User Options
  │  ├─ [Stay on Page] → Continue payment
  │  └─ [Leave Page] → Abandon payment
  │     └─▶ Session expires after 15 minutes
  │        └─▶ Auto-cleanup
  │
  └─▶ Cleanup
     └─▶ On component unmount:
        ├─▶ removeEventListener('beforeunload')
        ├─▶ clearTimeout(timeoutRef)
        └─▶ abort(abortControllerRef)
```

---

## Session State Machine

```
                        ┌─────────────────┐
                        │    INITIATED    │
                        │  (New Session)  │
                        └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
            ┌──────────────┐ ┌──────────┐ ┌──────────────┐
            │ INTERRUPTED  │ │COMPLETED │ │ CANCELLED    │
            │  (Timeout/   │ │ (Success)│ │ (User/Error) │
            │   Network)   │ └──────────┘ └──────────────┘
            └───────┬──────┘
                    │
                    └─▶ [User Clicks "Retry"]
                        │
                        ▼
                    ┌─────────────┐
                    │  RESUMED    │
                    │ (Attempt 2) │
                    └────┬────────┘
                         │
            ┌────────────┬┴───────────┐
            ▼            ▼            ▼
        COMPLETED   INTERRUPTED  FAILED_MAX_RETRIES
         (Success)  (Attempt 3)    (All Failed)
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend State                            │
├─────────────────────────────────────────────────────────────────┤
│  sessionId         (string)      ← from createPaymentSession   │
│  isInterrupted     (boolean)     ← from handleInterrupt        │
│  canResume         (boolean)     ← attemptCount < maxAttempts  │
│  attemptCount      (number)      ← increment on retry          │
│  maxAttempts       (number)      ← from API response           │
│  loading           (boolean)     ← during payment              │
│  message           (string)      ← user feedback               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API Requests
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Session Store                        │
├─────────────────────────────────────────────────────────────────┤
│  sessionId              unique identifier                        │
│  orderId                order being paid                        │
│  userId                 user making payment                     │
│  status                 INITIATED/RESUMED/COMPLETED/...         │
│  attempts               current attempt count                   │
│  startedAt              session creation time                   │
│  expiresAt              auto-cleanup time                       │
│  metadata {                                                      │
│    interruptions: [                                             │
│      { timestamp, reason, details }                             │
│    ],                                                            │
│    retries: [                                                   │
│      { timestamp, attemptNumber }                               │
│    ],                                                            │
│    lastActivity: timestamp                                      │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API Response
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend Rendering                         │
├─────────────────────────────────────────────────────────────────┤
│  ✓ Show attempt counter     if attemptCount > 0                │
│  ✓ Show timeout message     if interrupted && reason = TIMEOUT │
│  ✓ Show retry button        if canResume = true                │
│  ✓ Show cancel button       always enabled                      │
│  ✓ Show session ID          for debugging (bottom text)        │
│  ✓ Show form fields         if !isInterrupted                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Timing Diagram

```
Timeline (seconds)

T=0s    User submits payment
        ├─ Create session
        ├─ Validate form
        └─ POST /payments/confirm

T=0-2s  Network latency (typical)
        └─ API processing

T=2-30s Payment processing
        ├─ Server validates payment
        ├─ Processes with payment gateway
        └─ Returns response

T=30s   ⏱️ TIMEOUT TRIGGER (if no response)
        ├─ abortController.abort()
        ├─ timeoutRef clearTimeout()
        └─ handlePaymentTimeout()

T=30.5s UI Updates
        ├─ Set isInterrupted = true
        ├─ Show "Timeout" message
        └─ Show [Retry] button

T=31s   User sees Retry button
        └─ Can click anytime

T=32s   User clicks "Retry Payment"
        ├─ resumePaymentSession(sessionId)
        ├─ Clear previous state
        └─ Start new timeout (0-30s)

T=32-62s Retry processing (2nd attempt)
        └─ Same as first

...

T=92s   If all 3 attempts timeout
        └─ Show "Max retries exceeded"
```

---

## Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                     Payment Component                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  useEffect (Mount)                                               │
│  ├─ initializeSession()                                          │
│  │  └─ paymentService.createPaymentSession(orderId)             │
│  │     └─ setSessionId()                                        │
│  │                                                               │
│  └─ addEventListener('beforeunload')                            │
│     └─ Warn user if leaving during payment                      │
│                                                                   │
│  useEffect (Cleanup)                                             │
│  ├─ clearTimeout(timeoutRef)                                    │
│  ├─ abort(abortControllerRef)                                   │
│  └─ removeEventListener('beforeunload')                         │
│                                                                   │
│  handleSubmit()                                                   │
│  └─ retryPayment()                                               │
│     ├─ validatePaymentData()                                    │
│     └─ initiatePaymentWithTimeout()                             │
│        ├─ Set timeout                                            │
│        ├─ POST /payments/confirm                                │
│        └─ Handle response/error                                 │
│                                                                   │
│  handlePaymentTimeout()                                          │
│  └─ handlePaymentInterruption(sessionId, 'TIMEOUT')             │
│     └─ setIsInterrupted(true)                                   │
│        └─ setCanResume(attemptCount < maxAttempts)              │
│                                                                   │
│  resumePayment()                                                  │
│  ├─ paymentService.resumePaymentSession(sessionId)              │
│  ├─ setAttemptCount(prev + 1)                                   │
│  └─ retryPayment()                                               │
│                                                                   │
│  handleAbortPayment()                                            │
│  ├─ abortController.abort()                                     │
│  ├─ clearTimeout(timeoutRef)                                    │
│  ├─ cancelPaymentSession(sessionId)                             │
│  └─ onPaymentCancel()                                           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Retry Logic Flow Chart

```
START
  │
  ├─ Validate Payment Data
  │  ├─ Card Number (16 digits)
  │  ├─ Cardholder Name
  │  ├─ Expiry (MM/YY)
  │  └─ CVV (3 digits)
  │
  ├─ Create AbortController
  │
  ├─ Set 30s Timeout
  │  └─ If triggers → handlePaymentTimeout()
  │
  ├─ Send Payment Request
  │  │
  │  ├─ Success ✓
  │  │  └─ completePaymentSession()
  │  │     └─ Status: COMPLETED
  │  │        └─ Show "✅ Payment submitted!"
  │  │           └─ END (Success)
  │  │
  │  └─ Error ✕
  │     ├─ Check: Network Error?
  │     │  └─ YES → handlePaymentError()
  │     │     └─ Status: INTERRUPTED
  │     │
  │     └─ attemptCount < maxAttempts?
  │        ├─ YES → setCanResume(true)
  │        │  └─ Show [Retry] button
  │        │     └─ Await User Action
  │        │        ├─ User clicks [Retry]
  │        │        │  └─ resumePayment()
  │        │        │     └─ Loop back to "Validate..."
  │        │        │
  │        │        └─ User clicks [Cancel]
  │        │           └─ cancelPaymentSession()
  │        │              └─ END (Cancelled)
  │        │
  │        └─ NO → Max Retries Exceeded
  │           └─ Show "Max retries" error
  │              └─ Only [Cancel] available
  │                 └─ END (Failed - Max Retries)
```

---

## Summary: Key Interactions

```
┌─────────────────────────────────────────┐
│        User Actions & System Response    │
├─────────────────────────────────────────┤
│                                          │
│ User Action          System Response     │
│ ────────────────────────────────────────│
│ Submit Payment  →    Create Session      │
│                      Start Timeout       │
│                      Send to Backend     │
│                                          │
│ Wait (No Error) →    Complete Payment    │
│                      Show Success        │
│                                          │
│ Timeout/Error   →    Record Interrupt    │
│                      Show Retry Option   │
│                      setCanResume(true)  │
│                                          │
│ Click Retry     →    Resume Session      │
│                      Increment Attempt   │
│                      Try Again           │
│                                          │
│ Max Retries     →    Block Further       │
│                      Show Error          │
│                      setCanResume(false) │
│                                          │
│ Click Cancel    →    Abort Request       │
│                      Cancel Session      │
│                      Close Modal         │
│                      Return to Cart      │
│                                          │
└─────────────────────────────────────────┘
```

---

**Last Updated**: January 31, 2026  
**Version**: 1.0.0  
**Status**: ✅ Complete
