exports.home_product = function(every, context, options) {
	let out = '';
	let subContext = [];
	if (context && context.length > 0) {
		for (let i = 0; i < context.length; i++) {
			if (i > 0 && i % every === 0) {
				out += options.fn(subContext);
				subContext = [];
			}
			subContext.push(context[i]);
		}
		out += options.fn(subContext);
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

// Adds the show-image class to the first image in the array
exports.addShowClassToFirstProductImage = function(context, options) {
    // context is product.imageURLArray
    // options is the inner html
    let out = '';
    if (context[0])
        context[0].displayFirstImage = ' show-image';

    context.forEach(function (el) {
        out += options.fn(el);
    });

    return out;
};