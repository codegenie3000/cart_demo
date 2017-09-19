/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by jonathan on 6/14/17.
 */

var mailgunKey = process.env.MAILGUN_SECRET;
var mailgunDomain = process.env.MAILGUN_DOMAIN;
var mailgun = require('mailgun-js')({apiKey: mailgunKey, domain: mailgunDomain});

var stripeKeySecret = process.env.STRIPE_SECRET;
var stripe = require('stripe')(stripeKeySecret);

var Product = require('../models/product');
var Order = require('../models/order');

var ControllerHelpers = require('./controllerHelpers');

var modalHelpers = ControllerHelpers.modals;

exports.index = function(req, res, next) {
	if (req.session.itemQty) {
		//TODO convert into modules
		var cartItems = req.session.itemQty;
		var itemsInCart = [];

		if (cartItems.length > 0) {
			itemsInCart = cartItems.map(function (item) {
				return item.itemId;
			});
			Product.find({
				_id: {$in: itemsInCart}
			}, function(err, catalogItems) {

				var mergedCartItems = (function() {
					var merged = [];

					for (var i = 0; i < catalogItems.length; i++) {
						cartItems.forEach(function(cartItem) {
							if (cartItem.itemId === catalogItems[i].id) {
								catalogItems[i]['qty'] = cartItem.qty;
								merged.push(catalogItems[i]);
							}
						});
					}
					return merged;
				})();

				var subTotal = mergedCartItems.reduce(function (prevVal, elem) {
					return prevVal + (elem.qty * elem.price);
				},0);

				var shipping = (subTotal * 0.2);

				var total = subTotal + shipping;

				//TODO create regex and convert number to decimal and comma format
				console.log('ran with calc', subTotal.toString());
				res.render('cart', {
					itemsInCart: true,
					cartItems: mergedCartItems,
					subTotal: subTotal.toString(),
					shipping: shipping.toString(),
					total: total.toString(),
					general: {
						cart: true
					},
					pageName: 'Your cart'
				});
			});
		} else {
			res.render('cart', {
				itemsInCart: false,
				general: {
					cart: true
				},
				pageName: 'Your cart'
			});
		}
	} else {
		res.render('cart', {
			itemsInCart: false,
			general: {
				cart: true
			},
			pageName: 'Your cart'
		});
	}
};

exports.change_qty = function(req, res, next) {
	// TODO sanitize data
	// var itemObj = JSON.parse(req.body.data);
	// var sessionArray = req.session.itemQty;
	var itemObj = req.body;
	var sessionArray = req.session.itemQty;
	for (var i = 0; i < sessionArray.length; i++) {
		if (sessionArray[i].itemId === itemObj.itemId) {
			sessionArray[i].qty = parseInt(itemObj.qty);
		}
	}
	req.session.save(function (err) {
		if (err)
			return next(err);
		res.send('/cart');
	});
};

exports.remove_product = function(req, res, next) {
	var productId = req.params.id;
	var itemQtyArr = req.session.itemQty;
	// loop through session array
	// if the id in the object of the array matches the productId
	// then find the index of that object in the array
	// use splice to remove that element

	var index = itemQtyArr.findIndex(function (element) {
		var foo = element;
		return element.itemId === productId;
	});
	itemQtyArr.splice(index, 1);
	req.session.itemQty = itemQtyArr;
	req.session.save(function (err) {
		if (err)
			return next(err);
		res.redirect('/cart');
	});
	// res.redirect('/');
};

exports.submitBillingData = function(req, res, next) {
    var foo = req.param;
	req.checkBody('billingAddress', 'billing address must be received').notEmpty();
	req.sanitize('billingAddress');

	//TODO convert to module
	function safeJSONObject(postObject, propArray) {
		var safeObj = {};
		try {
			propArray.forEach(function(prop) {
				if (postObject.hasOwnProperty(prop)) {
					safeObj[prop] = postObject[prop];
				}
			});
			return safeObj;
		} catch (e) {
			return null;
		}
	}

	var propertiesToCheck = ['email', 'name', 'address1', 'address2', 'city', 'state', 'zip', 'phone', 'bill-same-as-ship'];

	var billingAddressObj = safeJSONObject(req.body, propertiesToCheck);

	var isBillingShippingSame = (function() {
		var isSame = (billingAddressObj['bill-same-as-ship']);
		delete billingAddressObj['bill-same-as-ship'];
		return isSame;
	})();

	var sessRef = req.session;

	sessRef.billingAddress = billingAddressObj;

	if (isBillingShippingSame) {
		var addressWithoutEmail = {};
		(function removeEmail() {
			for (var prop in billingAddressObj) {
				if (billingAddressObj.hasOwnProperty(prop) && prop !== 'email') {
					addressWithoutEmail[prop] = billingAddressObj[prop];
				}
			}
		})();
		sessRef.shippingAddress = addressWithoutEmail;
	}

	//TODO convert to module?
	req.session.save(function (err) {
		console.log('saved');
		if (err)
			return next(err);

		var checkout02URL = '/cart/shipping';
		var checkout03URL = '/cart/confirmation';

		isBillingShippingSame ? res.send(checkout03URL) : res.send(checkout02URL);
	});
};

exports.billing = function(req, res, next) {
	var stateArray = ControllerHelpers.stateList;
	var sessRef = req.session;
	if (sessRef.billingAddress) {
		var billingAddress = sessRef.billingAddress;

		res.render('billing_address', {
			pageName: 'Billing Address',
			stateList: stateArray,
			selectedState: billingAddress.state,
			name: billingAddress.name,
			email: billingAddress.email,
			address1: billingAddress.address1,
			address2: billingAddress.address2,
			city: billingAddress.city,
			zip: billingAddress.zip,
			phone: billingAddress.phone
		});
	} else {
		res.render('billing_address', {
			pageName: 'Billing Address',
			stateList: stateArray
		});
	}
};

exports.billingIsReady = function(req, res, next) {
    var session = req.session;
    if (session.hasOwnProperty('itemQty') && session.itemQty.length > 0) {
        res.send({allClear: 'true'});
    } else {
        res.send(modalHelpers.noItems);
    }
};

exports.shipping = function(req, res, next) {
	var stateArray = ControllerHelpers.stateList;
	var sessRef = req.session;
	if (sessRef.shippingAddress) {
		var shippingAddress = sessRef.shippingAddress;
		res.render('shipping_address', {
			pageName: 'Shipping Address',
			stateList: stateArray,
			selectedState: shippingAddress.state,
			name: shippingAddress.name,
			address1: shippingAddress.address1,
			address2: shippingAddress.address2,
			city: shippingAddress.city,
			zip: shippingAddress.zip,
			phone: shippingAddress.phone
		});
	} else {
		res.render('shipping_address', {
			pageName: 'Shipping Address',
			stateList: stateArray
		});
	}
};

exports.shippingIsReady = function(req, res, next) {
    var sess = req.session;
    if (sess.hasOwnProperty('itemQty') && sess.itemQty.length > 0) {
        if (sess.billingAddress) {
            res.send({allClear: 'true'});
        } else {
            res.send(modalHelpers.noBilling);
        }
    } else {
        res.send(modalHelpers.noItems);
    }
};

exports.confirmationIsReady = function(req, res, next) {
    var sess = req.session;
    if (sess.hasOwnProperty('itemQty') && sess.itemQty.length > 0 && sess.billingAddress && sess.shippingAddress) {
        res.send({allClear: 'true'});
    } else {
        if (sess.hasOwnProperty('itemQty') && sess.itemQty.length > 0) {
            if (sess.billingAddress || !sess.shippingAddress) {
                res.send(modalHelpers.noShipping);
            } else {
                res.send(modalHelpers.noBilling);
            }
        } else {
            res.send(modalHelpers.noItems);
        }
    }
};

exports.submitShippingData = function(req, res, next) {
	req.checkBody('shippingAddress', 'shipping address must be received').notEmpty();
	req.sanitize('shippingAddress');

	//TODO Create this as a module to export/import later
	function createShippingObject (requestBody, propArray) {
		var safeObj = {};
		try {
			propArray.forEach(function(prop) {
				if (requestBody.hasOwnProperty(prop)) {
					safeObj[prop] = requestBody[prop];
				}
			});
			return safeObj;
		} catch (e) {
			return null;
		}
	}
	var propertiesToCheck = ['name', 'address1', 'address2', 'city', 'state', 'zip', 'phone'];

	var shippingAddress = createShippingObject(req.body, propertiesToCheck);

	var sessRef = req.session;
	sessRef.shippingAddress = shippingAddress;

	// Create this as a module later
	req.session.save(function (err) {
		console.log('saved shipping address');
		if (err) return next(err);

		res.send('/cart/confirmation');
	});
};

exports.checkoutConfirmation = function(req, res, next) {
	// session.itemQty is array with [{itemId: ..., qty: 2}, {...}]
	if (req.session) {
		var addressFields = (function () {
		    if (req.hasOwnProperty('session')) {
                var sessRef = req.session;
                var billingAddress;
                var shippingAddress;

                if (sessRef.hasOwnProperty('billingAddress')) {
                    var billingAddressRef = sessRef.billingAddress;
                    billingAddress = {
                        name: billingAddressRef.name,
                        address: billingAddressRef.address1 + ', ' + billingAddressRef.address2,
                        city: billingAddressRef.city,
                        state: billingAddressRef.state,
                        zip: billingAddressRef.zip,
                        phone: billingAddressRef.phone,
                        email: billingAddressRef.email
                    };
                } else {
                    billingAddress = {};
                }

                if (sessRef.hasOwnProperty('shippingAddress')) {
                    var shippingAddressRef = sessRef.shippingAddress;
                    shippingAddress = {
                        name: shippingAddressRef.name,
                        address: shippingAddressRef.address1 + ', ' + shippingAddressRef.address2,
                        city: shippingAddressRef.city,
                        state: shippingAddressRef.state,
                        zip: shippingAddressRef.zip,
                        phone: shippingAddressRef.phone
                    };
                } else {
                    shippingAddress = {};
                }
            }

			return {
				billing: billingAddress,
				shipping: shippingAddress
			}
		})();

        if (req.session.hasOwnProperty('itemQty')) {
            var cart = req.session.itemQty;
            ControllerHelpers.cart.cartItemTotal(cart, renderCartTotal);

            function renderCartTotal(error, cartTotalsObj) {
                if (error) {
                    console.log(error);
                } else {
                    res.render('cart_confirmation', {
                        billingAddress: addressFields.billing,
                        shippingAddress: addressFields.shipping,
                        pageName: 'Verify Information',
                        cartItem: cartTotalsObj.cartItems,
                        shipping: cartTotalsObj.shipping,
                        total: cartTotalsObj.total
                    });
                }
            }
        } else {
            res.render('cart_confirmation', {
                billingAddress: {},
                shippingAddress: {},
                pageName: 'Verify Information',
                cartItem: {},
                shipping: '0',
                total: '0'
            });
        }
	}
};

exports.payment = function(req, res, next) {
	if (req.session) {
		if (req.session.billing) {
            var addressFields = (function() {
                var sessRef = req.session;
                var billingAddressRef = sessRef.billingAddress;

                return {
                    name: billingAddressRef.name,
                    address: billingAddressRef.address1 + ', ' + billingAddressRef.address2,
                    city: billingAddressRef.city,
                    state: billingAddressRef.state,
                    zip: billingAddressRef.zip,
                    phone: billingAddressRef.phone,
                    email: billingAddressRef.email
                };
            })();
            res.render('card_entry', {
                billingAddress: addressFields
            });
        } else {
		    res.render('card_entry', {
		        billingAddress: {}
            });
        }
	}
};

exports.stripePost = function(req, res, next) {
	req.sanitize('stripeToken');
	var stripeToken = req.body.id;

	var session = req.session;
	var itemArray = session.itemQty;

	ControllerHelpers.cart.cartItemTotal(itemArray, createStripeCharge);

	function createStripeCharge (error, totalsObj) {
		if (error) {
			createOrderDetails(error);
		} else {
			stripe.charges.create({
				amount: totalsObj.total * 100,
				currency: 'usd',
				description: 'order_charge',
				source: stripeToken
			}, function (err, charge) {
				if (err) {
					createOrderDetails(err);
				} else {
					createOrderDetails(null, charge, totalsObj);
				}
			});
		}
	}

	function createOrderDetails(error, stripeTransaction, itemAndTotals) {
		if (error) {
			saveOrder(error);
		} else {
			var cartItems = session.itemQty;
			var billingAddress = session.billingAddress;
			var shippingAddress = session.shippingAddress;
			
			var orderDetails = {
				stripeTransactionId: stripeTransaction.id,
				billingAddress: billingAddress,
				shippingAddress: shippingAddress,
				shippingAmount: itemAndTotals.shipping,
				totalAmount: itemAndTotals.total,
				amountCharged: itemAndTotals.total,
				items: cartItems
			};

			(function genOrderIdAndCheck() {
				function genOrderId() {
					var text = '';

					for (var i = 0; i < 5; i++) {
						text += Math.floor(Math.random() * 10).toString();
					}
					return text;
				}
				
				(function checkOrderId() {
					var orderId = genOrderId();
					
					Order.find({orderId: orderId}, function (err, res) {
						if (err) {
							saveOrder(error);
						} else {
							if (res.length > 0) {
								checkOrderId();
							} else {
								orderDetails.orderId = orderId;
								session.orderId = orderId;
								saveOrder(null, orderDetails);
							}
						}
					});
				})();
			})();
		}
	}
	
	function saveOrder(error, orderDetail) {
		if (error) {
			console.log(error);
		} else {
			var order = new Order(orderDetail);
			emailUser(null, orderDetail);

			order.save(function (err, order) {
				if (err) {
					console.log(err);
				} else {
                    (function deleteItemsFromSession() {
                        delete session.itemQty;
                    })();
					res.send('/cart/success/');
				}
			});
		}
	}

	function emailUser(error, orderDetail) {
		var userData = {
			email: orderDetail.billingAddress.email,
			name: orderDetail.billingAddress.name,
			orderId: orderDetail.orderId
		};

		var emailData = {
			to: userData.email,
			from: 'Orders<orders@mg.jonathanperalez.com>',
			subject: 'Thank you for your order',
			text: 'Thank you for your order. Your order Id is: ' + userData.orderId
		};

		mailgun.messages().send(emailData, function(error, body) {
			console.log(body);
		});
	}
};

exports.success = function(req, res, next) {
	var session = req.session;
	var orderId = session.orderId;
	res.render('order_confirmation', {
		orderId: orderId,
		pageName: 'Order Confirmation'
	});
};