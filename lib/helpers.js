exports.home_product = function(every, context, options) {
	let out = '';
	let subcontext = [];
	if (context && context.length > 0) {
		for (let i = 0; i < context.length; i++) {
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

exports.selectState = function(abbrev, options) {
	if (abbrev === options.data.root.selectedState) {
		return 'selected';
	}
};