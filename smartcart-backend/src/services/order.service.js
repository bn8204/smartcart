const orderRepo = require('../repositories/order.repository');

exports.getAllOrders = async () => {
  return await orderRepo.findAll();
};

exports.createOrder = async (orderData) => {
  return await orderRepo.create(orderData);
};

exports.getOrderItems = async (orderId) => {
  return await orderRepo.findOrderItems(orderId);
};

exports.updateOrderStatus = async (orderId, status) => {
  return await orderRepo.updateStatus(orderId, status);
};