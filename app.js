require('dotenv').config();

const express = require('express');
const exphbs = require('express-handlebars');
const helpers = require('./lib/helpers');
const mongoose = require('mongoose');
const index = require('./routes/index');
const cart = require('./routes/cart');
const products = require('./routes/products');


//Set up mongoose connection
const dbURL = process.env.DB_HOST,
	user = process.env.DB_USER,
	pw = process.env.DB_PASS;
const dbURI = 'mongodb://' + user + ':' + pw + '@' + dbURL;

mongoose.connect(dbURI, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('db connected');
});

const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// var cookieSession = require('cookie-session');

// express-session
const session = require('express-session');
// var stripe = require('stripe')(process.env.STRIPE_SECRET);

const app = express();

const hbs = exphbs.create({
	defaultLayout: 'main',
	helpers: helpers,
	partialsDir: [
		'views/partials/',
		'views/partials/head/'
	]
});

app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// express-session
app.use(session({
	saveUninitialized: true,
	secret: 'An apple a day',
	resave: true,
	secure: true
	
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
app.use('/products', products);
app.use('/cart', cart);

// error route
app.get('*', (req, res) => {
    res.render('error');
});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;