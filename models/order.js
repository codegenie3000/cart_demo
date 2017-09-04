/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = Schema(
	{
		orderId: {type: String, required: true, max: 5},
		orderTimestamp: {type: Date, required: true, default: Date.now},
		stripeTransactionId: {type: String, required: true, max: 20},
		amountCharged: {type: Number, required: true},
		billingAddress: {
			name: {type: String, required: true, max: 200},
			email: {type: String, required: true, max: 100},
			address1: {type: String, required: true, max: 200},
			address2: {type: String, required: false, max: 100},
			state: {type: String, required: true, max: 2},
			city: {type: String, required: true, max: 200},
			zip: {type: String, required: true, max: 10},
			phone: {type: String, required: true, max: 20}
		},
		shippingAddress: {
			name: {type: String, required: true, max: 200},
			address1: {type: String, required: true, max: 200},
			address2: {type: String, required: false, max: 100},
			state: {type: String, required: true, max: 2},
			city: {type: String, required: true, max: 200},
			zip: {type: String, required: true, max: 10},
			phone: {type: String, required: true, max: 20}
		},
		shippingAmount: {type: Number, required: true},
		// salesTaxAmount: {type: Number, required: true},
		totalAmount: {type: Number, required: true},
		items: [
			{itemId: {type: String, required: true}},
			{qty: {type: Number, required: true}}
		]
	}
);

module.exports = mongoose.model('Order', OrderSchema);