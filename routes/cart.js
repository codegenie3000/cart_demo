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

router.post('/checkout01/next', cartController.check_out01_post);

router.post('/change_qty', cartController.change_qty);


router.get('/checkout01', cartController.check_out01);

router.get('/checkout02', cartController.check_out02);

router.get('/remove/:id', cartController.remove_product);

module.exports = router;