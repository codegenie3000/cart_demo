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

exports.product_list = function(req, res, next) {
	Product.find({})
		.exec(function (err, list_products) {
			if (err) { return next(err)}
			// console.log(list_products);
			/*
			* goal: <div class="row">
			*           <div class="col-sm-6">
			*               <img>
			*           </div>
			*       </div>
			* calculate # of rows
			* create array with [ [ col, col ], [col, col] ], [...]
			*
			* */
			res.render('home', {
				headline: 'Amazing products',
				product_display: list_products
			});
		});
};