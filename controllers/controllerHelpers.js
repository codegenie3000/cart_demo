/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

var Product = require('../models/product');

exports.fetchCartPrices = function(cartItemQtyArray) {
	var itemsInCart = [];
	if (cartItemQtyArray) {
		itemsInCart = cartItemQtyArray.map(function (item) {
			return item.itemId;
		});
		Product.find({
			_id: {$in: itemsInCart}
		}, function(err, catalogItems) {

			var mergedCartItems = (function() {
				var merged = [];

				for (var i = 0; i < catalogItems.length; i++) {
					cartItemQtyArray.forEach(function(cartItem) {
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

			return {
				itemsInCart: true,
				cartItems: mergedCartItems,
				shipping: shipping.toString(),
				total: total.toString()
			}
		});
	}
};