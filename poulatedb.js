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

var async = require('async');
