const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/:id', productController.productDetail);

router.post('/:id', productController.addToCart);

module.exports = router;