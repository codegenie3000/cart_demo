/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 5/16/2017.
 */

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.render('home');
});

module.exports = router;