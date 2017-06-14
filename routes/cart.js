/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by jonathan on 6/14/17.
 */
var express = require('express');
var router = express.Router();

const cartController = require('../controllers/cartController');

router.get('/', cartController.index);

module.exports = router;