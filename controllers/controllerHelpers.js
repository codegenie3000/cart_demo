const Product = require('../models/product');

exports.stateList = (function() {
	const newArray = [];
	const sourceArray = [
		{
			"name": "Alabama",
			"abbreviation": "AL"
		},
		{
			"name": "Alaska",
			"abbreviation": "AK"
		},
		{
			"name": "Arizona",
			"abbreviation": "AZ"
		},
		{
			"name": "Arkansas",
			"abbreviation": "AR"
		},
		{
			"name": "California",
			"abbreviation": "CA"
		},
		{
			"name": "Colorado",
			"abbreviation": "CO"
		},
		{
			"name": "Connecticut",
			"abbreviation": "CT"
		},
		{
			"name": "Delaware",
			"abbreviation": "DE"
		},
		{
			"name": "District Of Columbia",
			"abbreviation": "DC"
		},
		{
			"name": "Florida",
			"abbreviation": "FL"
		},
		{
			"name": "Georgia",
			"abbreviation": "GA"
		},
		{
			"name": "Hawaii",
			"abbreviation": "HI"
		},
		{
			"name": "Idaho",
			"abbreviation": "ID"
		},
		{
			"name": "Illinois",
			"abbreviation": "IL"
		},
		{
			"name": "Indiana",
			"abbreviation": "IN"
		},
		{
			"name": "Iowa",
			"abbreviation": "IA"
		},
		{
			"name": "Kansas",
			"abbreviation": "KS"
		},
		{
			"name": "Kentucky",
			"abbreviation": "KY"
		},
		{
			"name": "Louisiana",
			"abbreviation": "LA"
		},
		{
			"name": "Maine",
			"abbreviation": "ME"
		},
		{
			"name": "Maryland",
			"abbreviation": "MD"
		},
		{
			"name": "Massachusetts",
			"abbreviation": "MA"
		},
		{
			"name": "Michigan",
			"abbreviation": "MI"
		},
		{
			"name": "Minnesota",
			"abbreviation": "MN"
		},
		{
			"name": "Mississippi",
			"abbreviation": "MS"
		},
		{
			"name": "Missouri",
			"abbreviation": "MO"
		},
		{
			"name": "Montana",
			"abbreviation": "MT"
		},
		{
			"name": "Nebraska",
			"abbreviation": "NE"
		},
		{
			"name": "Nevada",
			"abbreviation": "NV"
		},
		{
			"name": "New Hampshire",
			"abbreviation": "NH"
		},
		{
			"name": "New Jersey",
			"abbreviation": "NJ"
		},
		{
			"name": "New Mexico",
			"abbreviation": "NM"
		},
		{
			"name": "New York",
			"abbreviation": "NY"
		},
		{
			"name": "North Carolina",
			"abbreviation": "NC"
		},
		{
			"name": "North Dakota",
			"abbreviation": "ND"
		},
		{
			"name": "Ohio",
			"abbreviation": "OH"
		},
		{
			"name": "Oklahoma",
			"abbreviation": "OK"
		},
		{
			"name": "Oregon",
			"abbreviation": "OR"
		},
		{
			"name": "Pennsylvania",
			"abbreviation": "PA"
		},
		{
			"name": "Rhode Island",
			"abbreviation": "RI"
		},
		{
			"name": "South Carolina",
			"abbreviation": "SC"
		},
		{
			"name": "South Dakota",
			"abbreviation": "SD"
		},
		{
			"name": "Tennessee",
			"abbreviation": "TN"
		},
		{
			"name": "Texas",
			"abbreviation": "TX"
		},
		{
			"name": "Utah",
			"abbreviation": "UT"
		},
		{
			"name": "Vermont",
			"abbreviation": "VT"
		},
		{
			"name": "Virginia",
			"abbreviation": "VA"
		},
		{
			"name": "Washington",
			"abbreviation": "WA"
		},
		{
			"name": "West Virginia",
			"abbreviation": "WV"
		},
		{
			"name": "Wisconsin",
			"abbreviation": "WI"
		},
		{
			"name": "Wyoming",
			"abbreviation": "WY"
		}
	];

	sourceArray.forEach(function(elem) {
		const newRecord = {stateName: elem.name, abbrev: elem.abbreviation};
		newArray.push(newRecord);
	});
	return newArray;
})();

exports.cart = (function() {
	const findProducts = ((cartItemQtyArray, callback) => {
        const itemsInCart = cartItemQtyArray.map(item => {
			return item.id;
		});

		Product.find({
			_id: {$in: itemsInCart}
		}, function(err, catalogItems) {
			if (err) return err;

            const mergedCartItems = (function() {
                const merged = [];

				for (let i = 0; i < catalogItems.length; i++) {
					cartItemQtyArray.forEach(cartItem => {
						if (cartItem.id === catalogItems[i].id) {
                            const tempItem = {};
							tempItem.qty = cartItem.qty.toString();
							tempItem.price = catalogItems[i].price.toString();
							tempItem.lineTotal = (catalogItems[i].price * cartItem.qty).toString();
							tempItem.title = catalogItems[i].title;
							merged.push(tempItem);
						}
					});
				}
				return merged;
			})();

            const subTotal = mergedCartItems.reduce((prevVal, elem) => {
				return prevVal + (elem.qty * elem.price);
			}, 0);

            const shipping = (subTotal * 0.1);

            const total = subTotal + shipping;

            const obj = {
				itemsInCart: true,
				cartItems: mergedCartItems,
				shipping: shipping,
				total: total
			};
			callback(null, obj);
		});
	});

	return {
		cartItemTotal: findProducts
	}
})();

exports.modals = (function() {
    function CreateModalObject(message, buttonURL, buttonMessage) {
        const obj = {};
        obj.allClear = 'false';
        obj.modalMessage = message;
        obj.buttonURL = buttonURL;
        obj.buttonMessage = buttonMessage;
        return obj;
    }
    const noItems = CreateModalObject('Please add some items to your cart before you check out', '/', 'View catalog');
    const noBilling = CreateModalObject('Please enter your billing address before you check out', '/cart/billing', 'Enter billing info');
    const noShipping = CreateModalObject('Please enter your shipping address before you check out', '/cart/shipping', 'Enter shipping info');
    return {
        noItems: noItems,
        noBilling: noBilling,
        noShipping: noShipping
    }
})();