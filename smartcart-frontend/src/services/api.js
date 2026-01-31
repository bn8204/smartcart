import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Services
export const userService = {
  register: (userData) => apiClient.post('/users/register', userData),
  login: (credentials) => apiClient.post('/users/login', credentials),
};

// Product Services
export const productService = {
  getAllProducts: () => apiClient.get('/products'),
  getProductById: (id) => apiClient.get(`/products/${id}`),
};

// Order Services
export const orderService = {
  getAllOrders: () => apiClient.get('/orders'),
  createOrder: (orderData) => apiClient.post('/orders', orderData),
  getOrderItems: (orderId) => apiClient.get(`/orders/${orderId}/items`),
};

// Payment Services
export const paymentService = {
  confirmPayment: (paymentData) => apiClient.post('/payments/confirm', paymentData),
  
  // Payment Session Management
  createPaymentSession: (orderId) => 
    apiClient.post('/payments/session/create', { orderId }),
  
  getPaymentSession: (sessionId) => 
    apiClient.get(`/payments/session/${sessionId}`),
  
  resumePaymentSession: (sessionId) => 
    apiClient.post(`/payments/session/${sessionId}/resume`),
  
  completePaymentSession: (sessionId, paymentDetails) => 
    apiClient.post(`/payments/session/${sessionId}/complete`, paymentDetails),
  
  cancelPaymentSession: (sessionId, reason) => 
    apiClient.post(`/payments/session/${sessionId}/cancel`, { reason }),
  
  // Interrupt Handling
  handlePaymentInterruption: (sessionId, reason) => 
    apiClient.post(`/payments/session/${sessionId}/interrupt`, { reason }),
  
  getPaymentSessionSummary: (sessionId) => 
    apiClient.get(`/payments/session/${sessionId}/summary`),
};

// Rating & Feedback Services
export const ratingService = {
  submitProductRating: (data) => apiClient.post('/ratings/product', data),
  getProductRatings: (productId) => apiClient.get(`/ratings/product/${productId}`),
  getOrderRatings: (orderId) => apiClient.get(`/ratings/order/${orderId}`),
  
  submitDeliveryFeedback: (data) => apiClient.post('/ratings/delivery', data),
  getDeliveryFeedback: (orderId) => apiClient.get(`/ratings/delivery/order/${orderId}`),
  getUserDeliveryFeedback: () => apiClient.get('/ratings/delivery/user/all'),
  
  getDeliveryStatistics: () => apiClient.get('/ratings/delivery/statistics'),
};
