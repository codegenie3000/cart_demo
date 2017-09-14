/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();

chai.use(chaiHttp);

var agent = chai.request.agent(app);

describe('/GET index', function() {
    it('should return a 200', function(done) {
        agent
            .get('/')
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('/GET about', function() {
    it('should return a 200', function(done) {
        agent
            .get('/about')
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('/GET product', function() {
    it('should return a 200', function(done) {
        agent
            .get('/product/5930ab5b3488d916dc515420')
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('/POST add product to cart', function() {
    it('should return /cart', function(done) {
        agent
            .post('/product/5930ab5b3488d916dc515420')
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('/GET cart', function() {
    it('should return a 200', function(done) {
        agent
            .get('/cart')
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('/PUT cart - change qty', function() {
    it('should return a 200', function(done) {
        agent
            .put('/cart/change_qty')
            .send({'itemId': '5930ab5b3488d916dc515420', 'qty': '5'})
            .end(function(err, res) {
                res.should.have.status(200);
                res.text.should.equal('/cart');
                done();
            });
    });
});

describe('/GET billing address', function() {
    it('should return a 200', function(done) {
        agent
            .get('/cart/billing')
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('/POST billing address', function() {
    it('should return a 200', function(done) {
        agent
            .post('/cart/billing/submit')
            .send({
                'name': 'Jonathan Peralez',
                'email:': 'me@jonathanperalez.com',
                'address1': '123 Main St.',
                'address2': 'Apt 1',
                'city': 'Los Angeles',
                'state': 'CA',
                'zip:': '12345',
                'phone': '5555555555',
                'bill-same-as-ship': false
            })
            .end(function(err, res) {
                res.should.have.status(200);
                res.text.should.equal('/cart/shipping');
                done();
            });
    });
});

describe('/GET shipping address', function() {
    it('should return a 200', function(done) {
        agent
            .get('/cart/shipping')
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('/POST shipping address', function() {
    it('should return a 200 and return text', function(done) {
        agent
            .post('/cart/shipping/submit')
            .send({
                'name': 'Jonathan Peralez',
                'address1': '123 Main St.',
                'address2': 'Apt 1',
                'city': 'Los Angeles',
                'state': 'CA',
                'zip': '12345',
                'phone': '5555555555'
            })
            .end(function(err, res) {
                res.should.have.status(200);
                res.text.should.equal('/cart/confirmation');
                done();
            });
    });
});

describe('/GET confirmation', function() {
    it('should return a 200', function(done) {
        agent
            .get('/cart/confirmation')
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('/payment', function() {
    it('should return a 200', function(done) {
        agent
            .get('/cart/payment')
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });
});