/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by jonathan on 6/14/17.
 */
var express = require('express');
var router = express.Router();

const cartController = require('../controllers/cartController');

router.get('/', cartController.index);

router.put('/change_qty', cartController.change_qty);

router.post('/checkout01/submit', cartController.check_out01_post);

router.get('/checkout01', cartController.check_out01);

router.post('/checkout02/submit', cartController.checkout02Post);

router.get('/checkout02', cartController.check_out02);

router.get('/checkout03', cartController.checkout03);

router.get('/checkout04', cartController.checkout04);

router.get('/remove/:id', cartController.remove_product);

module.exports = router;