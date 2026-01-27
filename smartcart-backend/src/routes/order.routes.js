const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.get('/:id/items', orderController.getOrderItems);
router.post('/:id/approve', orderController.approvePayment);
router.post('/:id/reject', orderController.rejectPayment);
router.post('/:id/update-status', orderController.updateOrderStatus);

module.exports = router;