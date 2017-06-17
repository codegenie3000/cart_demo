/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by jonathan on 6/14/17.
 */

var Product = require('../models/product');

exports.index = function(req, res, next) {
	
	var cartItems = req.session.itemQty;
	var itemsInCart = [];
	if (cartItems) {
		itemsInCart = cartItems.map(function (item) {
			return item.itemId;
		});
		Product.find({
			_id: {$in: itemsInCart}
		}, function(err, catalogItems) {
			
			
			res.render('cart', {
				layout: 'cart',
				item_in_cart: catalogItems,
				general: {
					cart: true
				}
			});
		});
	}
	// console.log(sess.itemQty);
	
};

/*
exports.returnData = function(req, res, next) {

}*/
