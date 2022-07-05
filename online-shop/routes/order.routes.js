const express = require('express');
const ordersController = require('../controllers/order.controller');
const router = express.Router();

router.post('/', ordersController.addOrder);
router.get('/', ordersController.getOrders);

router.get('/suceess', ordersController.getSuccess);
router.get('/failure', ordersController.getFailure);


module.exports = router;