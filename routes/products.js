/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 5/16/2017.
 */
const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/:id', productController.productDetail);

router.post('/:id', productController.addToCart);

module.exports = router;