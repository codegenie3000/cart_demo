/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 5/16/2017.
 */

const express = require('express');
const router = express.Router();

const generalController = require('../controllers/generalController');

const productController = require('../controllers/productController');
// get product list

router.get('/', productController.index);

router.get('/about', generalController.about);

module.exports = router;