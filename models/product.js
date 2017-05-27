/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 5/16/2017.
 */

var mongoose = require('mongoose');

var moment = require('moment');

var Schema = mongoose.Schema;

var ProductSchema = Schema(
	{
		title: { type: String, required: true, max: 200 },
		description: { type: String, required: true, max: 200 },
		price: { type: Number, required: true },
		images: [String],
		tags: [String]
		// tags: { type: String, enum: true, required: false }
	}
);

ProductSchema
	.virtual('decimalPrice')
	.get(function() {
		var decimal = '.00';
		var stringPrice = this.price.toString();
		return stringPrice + decimal;
	});

ProductSchema
	.virtual('imageURLs')
	.get(function() {
		var cloudfrontURL = 'd1nvyzkpjmn5w2.cloudfront.net/';
		var concatArray = this.images.map(function (image) {
			return cloudfrontURL + image;
		});
		return concatArray;
	});

module.exports = mongoose.model('Product', ProductSchema);