const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/confirm', paymentController.confirmPayment);

module.exports = router;