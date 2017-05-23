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
		images: { type: String, enum: true, required: false },
		tags: { type: String, enum: true, required: false }
	}
);

ProductSchema
	.virtual('imageURL')
	.get(function() {
		return ''
	})