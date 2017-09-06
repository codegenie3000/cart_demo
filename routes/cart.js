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

router.post('/billing/submit', cartController.submitBillingData);

router.post('/stripeSubmit', cartController.stripePost);

router.get('/billing', cartController.billing);

router.post('/shipping/submit', cartController.submitShippingData);

router.get('/shipping', cartController.shipping);

router.get('/confirmation', cartController.checkoutConfirmation);

router.get('/payment', cartController.payment);

// router.get('/success/:orderId', cartController.success);
router.get('/success/', cartController.success);

router.get('/remove/:id', cartController.remove_product);


module.exports = router;