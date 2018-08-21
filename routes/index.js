const express = require('express');
const router = express.Router();

const generalController = require('../controllers/generalController');

const productController = require('../controllers/productController');
// get product list

router.get('/', productController.index);

router.get('/about', generalController.about);

module.exports = router;