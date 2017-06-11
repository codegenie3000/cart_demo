/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 5/16/2017.
 */

var Product = require('../models/product');

/*
exports.product_list = function(req, res, next) {
	Product.find()
		.sort([ [ 'title', 'ascending' ] ])
		.exec(function (err, list_products) {
			if (err) {return next(err);}
			
			res.render('./partials/home_product_display', {
				product_display: list_products
			});
		});
};*/

exports.index = function(req, res, next) {
	Product.find({})
		.exec(function (err, list_products) {
			// Diplay title, decimal price, and main image
			if (err) { return next(err)}
			res.render('home', {
				headline: 'Amazing products',
				product: list_products
			});
		});
};

exports.product_detail = function (req, res, next) {
	console.log(req.params.id);
	Product.findById(req.params.id)
		.exec(function (err, product) {
			if (err)
				return next(err);
			var imageArray = product.imageURLArray;
			res.render('product_detail', {
				layout: 'product_detail',
				product_data: product,
				images: imageArray
				// title: product.title
			});
		});
};

exports.add_to_cart = function (req, res, next) {
	req.checkBody('qtySelect', 'Quantity must be specified.').notEmpty();
	req.sanitize('qtySelect');
	var productId = req.params.id;
	var qtySelected = req.body.qtySelect;
	var productArray = [];
	productArray.push({ itemId: productId, qty: qtySelected});
	req.session.itemQty = productArray;
	var foo = 'bar';
};