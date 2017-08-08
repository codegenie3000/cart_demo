/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by jonathan on 6/14/17.
 */

var Product = require('../models/product');

var ControllerHelpers = require('./controllerHelpers');

exports.index = function(req, res, next) {
	if (req.session.itemQty) {
		//TODO convert into modules
		var cartItems = req.session.itemQty;
		var itemsInCart = [];
		if (cartItems) {
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
		}
	} else {
		console.log('ran no calc');
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
		res.send({status: 'success'});
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

exports.check_out01_post = function(req, res, next) {
	req.checkBody('billingAddress', 'billing address must be received').notEmpty();
	req.sanitize('billingAddress');

	/*function safeJSONObject(JSONString, propArray, maxLength) {
		var parsedObj, safeObj = {};
		try {
			if (maxLength && JSONString.length > maxLength) {
				return null;
			} else {
				parsedObj = JSONString;
				if (typeof parsedObj !== 'object' || Array.isArray(parsedObj)) {
					safeObj = parsedObj;
				} else {
					propArray.forEach(function (prop) {
						if (parsedObj.hasOwnProperty(prop)) {
							safeObj[prop] = parsedObj[prop];
						}
					});
				}
			}
			return safeObj;
		} catch(e) {
			return null;
		}
	}*/

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

		var checkout02URL = '/cart/checkout02';
		var checkout03URL = '/cart/checkout03';

		isBillingShippingSame ? res.send(checkout03URL) : res.send(checkout02URL);
	});
};

exports.check_out01 = function(req, res, next) {
	res.render('checkout01', {
		pageName: 'Billing Address'
	});
};

exports.check_out02 = function(req, res, next) {
	res.render('checkout02', {
		pageName: 'Shipping Address'
	});
};

exports.checkout02Post = function(req, res, next) {
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
				return safeObj;
			});
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

		res.send('/cart/checkout03');
	});
};

exports.checkout03 = function(req, res, next) {
	// session.itemQty is array with [{itemId: ..., qty: 2}, {...}]

	var addressFields = function () {
		var sessRef = req.session;
		var billingAddressRef = sessRef.billingAddress;
		var shippingAddressRef = sessRef.shippingAddress;

		var billingAddress = {
			name: billingAddressRef.name,
			address: billingAddressRef.address1 + ', ' + billingAddressRef.address2,
			city: billingAddressRef.city,
			state: billingAddressRef.state,
			zip: billingAddressRef.zip,
			phone: billingAddressRef.phone,
			email: billingAddressRef.email
		};
		var shippingAddress = {
			name: shippingAddressRef.name,
			address: shippingAddressRef.address1 + ', ' + shippingAddressRef.address2,
			city: shippingAddressRef.city,
			state: shippingAddressRef.state,
			zip: shippingAddressRef.zip,
			phone: shippingAddressRef.phone
		};

		return {
			billing: billingAddress,
			shipping: shippingAddress
		}
	};
	var formFields = addressFields();

	res.render('checkout03', {
		billingAddress: formFields.billing,
		shippingAddress: formFields.shipping,
		pageName: 'Verify Information'
	});
};















































