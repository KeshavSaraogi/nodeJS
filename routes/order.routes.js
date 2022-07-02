const express = require('express');
const ordersController = require('../controllers/order.controller');
const router = express.router();

router.post('/', ordersController.addOrder);
router.get('/', ordersController.getOrder);

module.exports = router;