/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 5/22/2017.
 */

var mongoose = require('mongoose');
var dbURL = process.argv[2],
	user = process.argv[3],
	pw = process.argv[4];
var dbURI = 'mongodb://' + user + ':' + pw + '@' + dbURL;

mongoose.connect(dbURI);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var async = require('async');
var Product = require('./models/product');

var products = [];

function productCreate(title, description, price, imageArray, tagArray, callback) {
	var productDetail = {
		title: title,
		description: description,
		price: price,
		images: imageArray,
		tags: tagArray
	};
	
	var product = new Product(productDetail);
	
	product.save(function (err) {
		if (err) {
		
		}
		products.push(product);
		// console.log('New Product: ' + product);
		callback(null, products);
	});
}

function createProducts(callback) {
	async.parallel(
		[
			function (callback) {
				productCreate("Product 1", "Take over! See to him! Look there! They're madmen! They're heading for the prison level. If you hurry, you might catch them. Follow me! You stand guard. Come on! Oh! All this excitement has overrun the circuits of my counterpart here.", 100, ["image01.jpeg", "image02.jpeg"], ["tag1", "tag2"], callback);
			},
			function (callback) {
				productCreate("Product 2", "Take over! See to him! Look there! They're madmen! They're heading for the prison level. If you hurry, you might catch them. Follow me! You stand guard. Come on! Oh! All this excitement has overrun the circuits of my counterpart here.", 200, ["image03.jpeg", "image04.jpeg"], ["tag1", "tag2"], callback);
			},
			function (callback) {
				productCreate("Product 3", "Take over! See to him! Look there! They're madmen! They're heading for the prison level. If you hurry, you might catch them. Follow me! You stand guard. Come on! Oh! All this excitement has overrun the circuits of my counterpart here.", 300, ["image01.jpeg", "image02.jpeg"], ["tag1", "tag2"], callback);
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