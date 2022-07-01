const express = require('express');
const { getProductDetails } = require('../controllers/products.controller');
const productsController = require('../controllers/products.controller');
const router = express.Router();

router.get('/products', productsController.getAllProducts);

router.get('/products/:id', getProductDetails);

module.exports = router;