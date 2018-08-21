exports.about = function(req, res) {
	res.render('about', {
		general: {
			about: true
		},
		pageName: 'About'
	});
};