/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 5/16/2017.
 */

var product = require('../models/product');

exports.product_list = function(req, res) {
	// res.render('products', {productName: products[0].name, productPrice: products[0].price});
	res.render('productTemplate');
	// products.forEach(function(product) {
	// 	res.render('product_list', {name: product.name, price: product.price});
	// });
};