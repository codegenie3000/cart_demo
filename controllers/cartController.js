/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by jonathan on 6/14/17.
 */

const mailgunKey = process.env.MAILGUN_SECRET;
const mailgunDomain = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({apiKey: mailgunKey, domain: mailgunDomain});

const stripeKeySecret = process.env.STRIPE_SECRET;
const stripe = require('stripe')(stripeKeySecret);

const Product = require('../models/product');
const Order = require('../models/order');

const ControllerHelpers = require('./controllerHelpers');

const modalHelpers = ControllerHelpers.modals;

exports.index = function(req, res, next) {
	if (req.session.itemQty) {
		//TODO convert into modules
        const cartItems = req.session.itemQty;
		let itemsInCart = [];

		if (cartItems.length > 0) {
			itemsInCart = cartItems.map(item => {
				return item.itemId;
			});
			Product.find({
				_id: {$in: itemsInCart}
			}, function(err, catalogItems) {

				const mergedCartItems = (function() {
					const merged = [];

					for (let i = 0; i < catalogItems.length; i++) {
						cartItems.forEach(cartItem => {
							if (cartItem.itemId === catalogItems[i].id) {
								catalogItems[i]['qty'] = cartItem.qty;
								merged.push(catalogItems[i]);
							}
						});
					}
					return merged;
				})();

				const subTotal = mergedCartItems.reduce((prevVal, elem) => {
					return prevVal + (elem.qty * elem.price);
				}, 0);

                const shipping = (subTotal * 0.2);

                const total = subTotal + shipping;

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
    const itemObj = req.body;
    const sessionArray = req.session.itemQty;
	for (let i = 0; i < sessionArray.length; i++) {
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
    const productId = req.params.id;
    const itemQtyArr = req.session.itemQty;
	// loop through session array
	// if the id in the object of the array matches the productId
	// then find the index of that object in the array
	// use splice to remove that element

    const index = itemQtyArr.findIndex(function (element) {
		return element.itemId === productId;
	});
	itemQtyArr.splice(index, 1);
	req.session.itemQty = itemQtyArr;
	req.session.save(err => {
		if (err)
			return next(err);
		res.redirect('/cart');
	});
	// res.redirect('/');
};

exports.submitBillingData = function(req, res, next) {
	req.checkBody('billingAddress', 'billing address must be received').notEmpty();
	req.sanitize('billingAddress');

	//TODO convert to module
	function safeJSONObject(postObject, propArray) {
        const safeObj = {};
		try {
			propArray.forEach(prop => {
				if (postObject.hasOwnProperty(prop)) {
					safeObj[prop] = postObject[prop];
				}
			});
			return safeObj;
		} catch (e) {
			return null;
		}
	}

    const propertiesToCheck = ['email', 'name', 'address1', 'address2', 'city', 'state', 'zip', 'phone', 'bill-same-as-ship'];

    const billingAddressObj = safeJSONObject(req.body, propertiesToCheck);

    const isBillingShippingSame = (function() {
        const isSame = (billingAddressObj['bill-same-as-ship']);
		delete billingAddressObj['bill-same-as-ship'];
		return isSame;
	})();

    const sessRef = req.session;

	sessRef.billingAddress = billingAddressObj;

	if (isBillingShippingSame) {
        const addressWithoutEmail = {};
		(function removeEmail() {
			for (const prop in billingAddressObj) {
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

        const checkout02URL = '/cart/shipping';
        const checkout03URL = '/cart/confirmation';

		isBillingShippingSame ? res.send(checkout03URL) : res.send(checkout02URL);
	});
};

exports.billing = function(req, res, next) {
    const stateArray = ControllerHelpers.stateList;
    const sessRef = req.session;
	if (sessRef.billingAddress) {
        const billingAddress = sessRef.billingAddress;

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
    const session = req.session;
    if (session.hasOwnProperty('itemQty') && session.itemQty.length > 0) {
        res.send({allClear: 'true'});
    } else {
        res.send(modalHelpers.noItems);
    }
};

exports.shipping = function(req, res, next) {
    const stateArray = ControllerHelpers.stateList;
    const sessRef = req.session;
	if (sessRef.shippingAddress) {
        const shippingAddress = sessRef.shippingAddress;
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
    const sess = req.session;
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
    const sess = req.session;
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
        const safeObj = {};
		try {
			propArray.forEach(prop => {
				if (requestBody.hasOwnProperty(prop)) {
					safeObj[prop] = requestBody[prop];
				}
			});
			return safeObj;
		} catch (e) {
			return null;
		}
	}
    const propertiesToCheck = ['name', 'address1', 'address2', 'city', 'state', 'zip', 'phone'];

    const shippingAddress = createShippingObject(req.body, propertiesToCheck);

    const sessRef = req.session;
	sessRef.shippingAddress = shippingAddress;

	// Create this as a module later
	req.session.save(err => {
		console.log('saved shipping address');
		if (err) return next(err);

		res.send('/cart/confirmation');
	});
};

exports.checkoutConfirmation = function(req, res, next) {
	// session.itemQty is array with [{itemId: ..., qty: 2}, {...}]
	if (req.session) {

	    const addressFields = (function() {
	        const billingAddress = function() {
	            if (req.session.hasOwnProperty('billingAddress')) {
	                const billingAddressRef = req.session.billingAddress;
	                return {
                        name: billingAddressRef.name,
                        address: billingAddressRef.address1 + ', ' + billingAddressRef.address2,
                        city: billingAddressRef.city,
                        state: billingAddressRef.state,
                        zip: billingAddressRef.zip,
                        phone: billingAddressRef.phone,
                        email: billingAddressRef.email
                    };
                } else {
	                return {};
                }
            };
            const shippingAddress = function() {
                if (req.session.hasOwnProperty('shippingAddress')) {
                    const shippingAddressRef= req.session.shippingAddress;
                    return {
                        name: shippingAddressRef.name,
                        address: shippingAddressRef.address1 + ', ' + shippingAddressRef.address2,
                        city: shippingAddressRef.city,
                        state: shippingAddressRef.state,
                        zip: shippingAddressRef.zip,
                        phone: shippingAddressRef.phone
                    };
                } else {
                    return {};
                }
            };

	        return {
	            billing: billingAddress(),
                shipping: shippingAddress(),
            }
        })();
        /*const addressFields = (function () {
		    if (req.hasOwnProperty('session')) {
                const sessRef = req.session;
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
		})();*/

        if (req.session.hasOwnProperty('itemQty')) {
            const cart = req.session.itemQty;
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
		if (req.session.billingAddress) {
            const addressFields = (function() {
                const sessRef = req.session;
                const billingAddressRef = sessRef.billingAddress;

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
    const stripeToken = req.body.id;

    const session = req.session;
    const itemArray = session.itemQty;

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

    function saveOrder(error, orderDetail) {
        if (error) {
            console.log(error);
        } else {
            const order = new Order(orderDetail);
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

	function createOrderDetails(error, stripeTransaction, itemAndTotals) {
		if (error) {
			saveOrder(error);
		} else {
            const cartItems = session.itemQty;
            const billingAddress = session.billingAddress;
            const shippingAddress = session.shippingAddress;

            const orderDetails = {
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
					let text = '';

					for (let i = 0; i < 5; i++) {
						text += Math.floor(Math.random() * 10).toString();
					}
					return text;
				}
				
				(function checkOrderId() {
					const orderId = genOrderId();
					
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
	


	function emailUser(error, orderDetail) {
		const userData = {
			email: orderDetail.billingAddress.email,
			name: orderDetail.billingAddress.name,
			orderId: orderDetail.orderId
		};

		const emailData = {
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
	const session = req.session;
	const orderId = session.orderId;
	res.render('order_confirmation', {
		orderId: orderId,
		pageName: 'Order Confirmation'
	});
};