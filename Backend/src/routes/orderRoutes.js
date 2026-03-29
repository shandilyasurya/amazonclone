const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, placeOrder)
  .get(protect, getOrders);

router.route('/:id')
  .get(protect, getOrderById);

module.exports = router;
