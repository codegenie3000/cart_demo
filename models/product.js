/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 5/16/2017.
 */

var SampleProductConstructor = function(name, price) {
	this.name = name;
	this.price = price;
};

var itemOne = new SampleProductConstructor('Coffee Mug', '10');
var itemTwo = new SampleProductConstructor('Pen', '2');
var itemThree = new SampleProductConstructor('Paper', '20');

var itemArray = [itemOne, itemTwo, itemThree];

module.exports = itemArray;