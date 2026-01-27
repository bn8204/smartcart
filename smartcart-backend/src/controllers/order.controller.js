const orderService = require('../services/order.service');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch orders' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.json({ message: 'SmartCart order created successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create order' });
  }
};

exports.getOrderItems = async (req, res) => {
  try {
    const items = await orderService.getOrderItems(req.params.id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch order items' });
  }
};

exports.approvePayment = async (req, res) => {
  try {
    const orderId = req.params.id;
    const result = await orderService.updateOrderStatus(orderId, 'PAID');
    res.json({ message: 'Payment approved successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to approve payment' });
  }
};

exports.rejectPayment = async (req, res) => {
  try {
    const orderId = req.params.id;
    const result = await orderService.updateOrderStatus(orderId, 'FAILED');
    res.json({ message: 'Payment rejected successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to reject payment' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['PENDING', 'PAID', 'DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'CANCELLED'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const result = await orderService.updateOrderStatus(orderId, status);
    res.json({ message: `Order status updated to ${status}`, result });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update order status' });
  }
};