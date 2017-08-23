/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

var mongoose = require('mongoose');

var moment = require('moment');

var Schema = mongoose.Schema;

var CustomerSchema = Schema(
	{
		name: {type: String, required: true, max: 200},
		email: {type: String, required: true, max: 100},
		address1: {type: String, required: true, max: 200},
		address2: {type: String, required: false, max: 100},
		state: {type: String, required: true, max: 2},
		city: {type: String, required: true, max: 200},
		zip: {type: String, required: true, max: 10},
		phone: {type: String, required: true, max: 20}
	}
);

module.exports = mongoose.model('Customer', CustomerSchema);