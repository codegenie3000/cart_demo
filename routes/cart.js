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

router.get('/checkout01', cartController.check_out01);

router.post('/change_qty', cartController.change_qty);

router.post('/checkout02', cartController.check_out_02_post);

router.get('/remove/:id', cartController.remove_product);

module.exports = router;