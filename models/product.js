/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 5/16/2017.
 */

const mongoose = require('mongoose');

// var moment = require('moment');

const Schema = mongoose.Schema;

const ProductSchema = Schema(
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
	.virtual('url')
	.get(function () {
		return '/products/' + this._id;
	});

ProductSchema
	.virtual('decimalPrice')
	.get(function() {
        const decimal = '.00';
        const stringPrice = this.price.toString();
		return stringPrice + decimal;
	});

ProductSchema
	.virtual('imageURLArray')
	.get(function() {
        const cloudfrontURL = 'd1nvyzkpjmn5w2.cloudfront.net/';
        return this.images.map(image => {
			return { image: 'https://' + cloudfrontURL + image };
		});
	});

ProductSchema
	.virtual('mainImage')
	.get(function() {
		const cloudfrontURL = 'd1nvyzkpjmn5w2.cloudfront.net/';
		return cloudfrontURL + this.images[0];
	});

module.exports = mongoose.model('Product', ProductSchema);