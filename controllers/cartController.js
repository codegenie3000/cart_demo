/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by jonathan on 6/14/17.
 */

exports.index = function(req, res, next) {
	var sess = req.session;
	console.log(sess.itemQty);
	res.render('cart', {
		layout: 'cart',
		general: {
			cart: true
		}
	});
};

exports.returnData = function(req, res, next) {

}