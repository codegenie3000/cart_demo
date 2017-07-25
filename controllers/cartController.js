/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by jonathan on 6/14/17.
 */

var Product = require('../models/product');

exports.index = function(req, res, next) {
	if (req.session.itemQty) {
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
	var itemObj = JSON.parse(req.body.data);
	var sessionArray = req.session.itemQty;
	for (var i = 0; i < sessionArray.length; i++) {
		if (sessionArray[i].itemId === itemObj.itemId) {
			sessionArray[i].qty = parseInt(itemObj.qty);
		}
	}
	req.session.save(function (err) {
		if (err)
			return next(err);
		console.log('ran');
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
	console.log('received post');

	function safeJSONObject(JSONString, propArray, maxLength) {
		var parsedObj, safeObj = {};
		try {
			if (maxLength && JSONString.length > maxLength) {
				return null;
			} else {
				parsedObj = JSON.parse(JSONString);
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
	}

	var propertiesToCheck = ['email', 'address1', 'address2', 'city', 'state', 'zip', 'phone', 'bill-same-as-ship'];
	var maxLength = 500;

	var addressObj = safeJSONObject(req.body.data, propertiesToCheck, maxLength);

	var sameAsShipping = addressObj['bill-same-as-ship'];
	delete addressObj['bill-same-as-ship'];

	var sess = req.session;
	sess.billingAddress = addressObj;
	sess.sameAsShipping = sameAsShipping;

	if (sameAsShipping) {
		sess.shippingAddress = addressObj;
	}
	req.session.save(function (err) {
		console.log('saved');
		if (err)
			return next(err);

		// res.json({'success': 'yes'});
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