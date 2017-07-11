/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

require('dotenv').config();

var express = require('express');
var exphbs = require('express-handlebars');
var helpers = require('./lib/helpers');

//Set up mongoose connection
var mongoose = require('mongoose');
/*var dbURL = process.argv[2],
	user = process.argv[3],
	pw = process.argv[4];
var dbURI = 'mongodb://' + user + ':' + pw + '@' + dbURL;*/
var dbURL = process.env.DB_HOST,
	user = process.env.DB_USER,
	pw = process.env.DB_PASS;
var dbURI = 'mongodb://' + user + ':' + pw + '@' + dbURL;
mongoose.connect(dbURI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

// var cookieSession = require('cookie-session');

// express-session
var session = require('express-session');

var index = require('./routes/index');
var products = require('./routes/products');
var cart = require('./routes/cart');

var app = express();

var hbs = exphbs.create({
	defaultLayout: 'main',
	helpers: helpers,
	partialsDir: [
		'views/partials/',
		'views/partials/head/'
	]
});

// view engine setup
/*app.engine('handlebars', exphbs({
	defaultLayout: 'main',
	helpers: 'helpers',
	partialsDir: [
		'views/partials/'
	]
}));*/
app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// express-session
app.use(session({
	saveUninitialized: true,
	secret: 'baby',
	resave: true,
	secure: false
	
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/product', products);
app.use('/cart', cart);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
