/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 5/16/2017.
 */

const Product = require('../models/product');

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
		.exec((err, list_products) => {
			// Diplay title, decimal price, and main image
			if (err) { return next(err)}
			res.render('home', {
				pageName: 'Catalog',
				general: {
					home: true
				},
				headline: 'Amazing products',
				product: list_products
			});
		});
};

exports.product_detail = function (req, res, next) {
	Product.findById(req.params.id)
		.exec((err, product) => {
			if (err)
				return next(err);
			const imageArray = product.imageURLArray;
			res.render('product_detail', {
				product_data: product,
				images: imageArray
				// title: product.title
			});
		});
};

exports.add_to_cart = function (req, res, next) {
	req.checkBody('qtySelect', 'Quantity must be specified.').notEmpty();
	req.sanitize('qtySelect');
	const itemObject = (function() {
        const productId =  req.params.id;
        const qtySelected = parseInt(req.body.qtySelect);
		return { itemId: productId, qty: qtySelected};
	})();
    const sess = req.session;
    const sessionItemArray = sess.itemQty;
	if (sessionItemArray) {
        let found = false;
		sessionItemArray.forEach(item => {
			if (item.itemId === itemObject.itemId) {
				item.qty += itemObject.qty;
				found = true;
			}
		});
		if (!found) {
			sessionItemArray.push(itemObject);
		}
	} else {
		sess.itemQty = [itemObject];
	}
	req.session.save(err => {
		if (err) {
			return next(err);
		} else {
			res.send('/cart');
		}
	});
};