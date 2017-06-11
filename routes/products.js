/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 5/16/2017.
 */
var express = require('express');
var router = express.Router();

const productController = require('../controllers/productController');

// router.get('/', productController.product_list);

router.get('/:id', productController.product_detail);

router.post('/:id', productController.add_to_cart);

module.exports = router;