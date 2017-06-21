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
				
				var bar = [{a: 1}, {a: 2}];
				
				var foo = bar.reduce(function (prevVal, elem) {
					return prevVal + elem.a;
				}, 0);
				
				console.log(foo);
				
				res.render('cart', {
					layout: 'cart',
					item_in_cart: mergedCartItems,
					general: {
						cart: true
					},
					subTotal: foo
				});
			});
		}
	} else {
		res.render('cart', {
			layout: 'cart',
			general: {
				cart: true
			}
		});
	}
};