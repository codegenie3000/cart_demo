const Product = require('../models/product');

exports.index = function(req, res, next) {
    Product.find({}, function(err, allProducts) {
        if (err) {
            return next(err)
        } else {
            res.render('home', {
				pageName: 'Catalog',
                products: allProducts
            });
        }
    });
};

exports.productDetail = function (req, res, next) {
	Product.findById(req.params.id, (err, product) => {
		if (err)
			return next(err);
		res.render('product_detail', {
			product: product
		});
	});
};

exports.addToCart = function (req, res, next) {
	req.checkBody('qtySelect', 'Quantity must be specified.').notEmpty();
	req.sanitize('qtySelect');

	const addedToCart = {
	    id: req.params.id,
        qty: parseInt(req.body.qtySelect)
    };

	// const itemObject = (function() {
     //    const productId =  req.params.id;
     //    const qtySelected = parseInt(req.body.qtySelect);
	// 	return { itemId: productId, qty: qtySelected};
	// })();
    const sessionItemArray = req.session.itemQty;
	if (sessionItemArray) {
        let found = false;
		sessionItemArray.forEach(item => {
			if (item.id === addedToCart.id) {
				item.qty += addedToCart.qty;
				found = true;
			}
		});
		if (!found) {
			sessionItemArray.push(addedToCart);
		}
	} else {
		req.session.itemQty = [addedToCart];
	}
	req.session.save(err => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/cart');
		}
	});
};