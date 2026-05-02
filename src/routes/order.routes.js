const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/',   authMiddleware, orderController.placeOrder);
router.get('/my',  authMiddleware, orderController.getMyOrders);

module.exports = router;