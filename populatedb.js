/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 5/22/2017.
 */

const mongoose = require('mongoose');
const dbURL = process.argv[2],
	user = process.argv[3],
	pw = process.argv[4];
const dbURI = 'mongodb://' + user + ':' + pw + '@' + dbURL;

mongoose.connect(dbURI);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

const async = require('async');
const Product = require('./models/product');

const products = [];

function productCreate(title, description, price, imageArray, tagArray, callback) {
    const productDetail = {
		title: title,
		description: description,
		price: price,
		images: imageArray,
		tags: tagArray
	};

    const product = new Product(productDetail);
	
	product.save(function (err) {
		if (err) {
		
		}
		products.push(product);
		// console.log('New Product: ' + product);
		callback(null, products);
	});
}

function createProducts(callback) {
	async.series(
		[
			function (callback) {
				productCreate("Product 1", "Take over! See to him! Look there! They're madmen! They're heading for the prison level. If you hurry, you might catch them. Follow me! You stand guard. Come on! Oh! All this excitement has overrun the circuits of my counterpart here.", 100, ["product01.png", "product02.png"], ["tag1", "tag2"], callback);
			},
			function (callback) {
				productCreate("Product 2", "Take over! See to him! Look there! They're madmen! They're heading for the prison level. If you hurry, you might catch them. Follow me! You stand guard. Come on! Oh! All this excitement has overrun the circuits of my counterpart here.", 200, ["product03.png", "product04.png"], ["tag1", "tag2"], callback);
			},
			function (callback) {
				productCreate("Product 3", "Take over! See to him! Look there! They're madmen! They're heading for the prison level. If you hurry, you might catch them. Follow me! You stand guard. Come on! Oh! All this excitement has overrun the circuits of my counterpart here.", 300, ["product01.png", "product02.png"], ["tag1", "tag2"], callback);
			},
			function (callback) {
				productCreate("Product 4", "Take over! See to him! Look there! They're madmen! They're heading for the prison level. If you hurry, you might catch them. Follow me! You stand guard. Come on! Oh! All this excitement has overrun the circuits of my counterpart here.", 400, ["product03.png", "product04.png"], ["tag1", "tag2"], callback);
			},
			function (callback) {
				productCreate("Product 5", "Take over! See to him! Look there! They're madmen! They're heading for the prison level. If you hurry, you might catch them. Follow me! You stand guard. Come on! Oh! All this excitement has overrun the circuits of my counterpart here.", 500, ["product01.png", "product02.png"], ["tag1", "tag2"], callback);
			},
			function (callback) {
				productCreate("Product 6", "Take over! See to him! Look there! They're madmen! They're heading for the prison level. If you hurry, you might catch them. Follow me! You stand guard. Come on! Oh! All this excitement has overrun the circuits of my counterpart here.", 600, ["product03.png", "product04.png"], ["tag1", "tag2"], callback);
			}
		],
		callback
	);
}

async.series(
	[
		createProducts
	],
	function (err, res) {
		if (err)
			console.log('final error: ' +err);
		console.log(products);
		mongoose.connection.close();
	}
);