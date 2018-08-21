const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');

router.get('/', cartController.index);

router.put('/change_qty', cartController.change_qty);

router.post('/billing/submit', cartController.submitBillingData);

router.post('/stripeSubmit', cartController.stripePost);

router.get('/billing', cartController.billing);

router.get('/billing/checkIfReady', cartController.billingIsReady);

router.post('/shipping/submit', cartController.submitShippingData);

router.get('/shipping', cartController.shipping);

router.get('/shipping/checkIfReady', cartController.shippingIsReady);

router.get('/confirmation', cartController.checkoutConfirmation);

router.get('/confirmation/checkIfReady', cartController.confirmationIsReady);

router.get('/payment', cartController.payment);

// router.get('/success/:orderId', cartController.success);
router.get('/success/', cartController.success);

router.get('/remove/:id', cartController.remove_product);


module.exports = router;