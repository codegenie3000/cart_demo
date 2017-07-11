/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by jonathan on 6/14/17.
 */
exports.about = function(req, res, next) {
	res.render('about', {
		general: {
			about: true
		},
		pageName: 'About'
	});
};