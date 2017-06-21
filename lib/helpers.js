/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 5/30/2017.
 */

exports.yell = function (message) {
	return message.toUpperCase();
};

exports.home_product = function(every, context, options) {
	var out = '', subcontext = [], i;
	if (context && context.length > 0) {
		for (i = 0; i < context.length; i++) {
			if (i > 0 && i % every === 0) {
				out += options.fn(subcontext);
				subcontext = [];
			}
			subcontext.push(context[i]);
		}
		out += options.fn(subcontext);
	}
	return out;
};

exports.cart_qty = function(context, options) {
	if (context === options)
		return 'selected';
};