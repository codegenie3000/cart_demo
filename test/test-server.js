/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('/GET index', function() {
    it('should return a 200', function(done) {
        chai.request(server)
            .get('/')
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('/GET about', function() {
    it('should return a 200', function(done) {
        chai.request(server)
            .get('/about')
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('/GET product', function() {
    it('should return a 200', function(done) {
        chai.request(server)
            .get('/product/5930ab5b3488d916dc515420')
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('/GET cart', function() {
    it('should return a 200', function(done) {
        chai.request(server)
            .get('/cart')
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });
});