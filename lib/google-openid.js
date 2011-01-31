var express = require('express');
var openid = require('openid');
var GOOGLE_ENDPOINT = 'https://www.google.com/accounts/o8/id';

var GoogleOpenid = function(app, baseURL, onAuthentication) {
    this.baseURL = baseURL.replace(/\/$/, ''); // remove trailing slash.
    var that = this;
    
    app.get('/googleopenid/verify', function(req, res) {
        that.verify(req, res, onAuthentication);
    });
    
    app.get('/googleopenid/authenticate', function(req, res) {
        that.authenticate(req, res);
    });
}

GoogleOpenid.prototype.verify = function(req, res, onAuthentication) {
    var openid_result = openid.verifyAssertion(req.url); // or req.url
    onAuthentication(req, res, openid_result);
}

GoogleOpenid.prototype.authenticate = function(req, res) {
    openid.authenticate(
        GOOGLE_ENDPOINT,
        this.baseURL + "/googleopenid/verify", // our callback URL
        null, // realm (optional)
        false, // attempt immediate authentication first?
        function(authUrl) {
            res.writeHead(302, { Location: authUrl });
            res.end();
        });
}

module.exports.create = function(app, hostname, onAuthentication) {
    return new GoogleOpenid(app, hostname, onAuthentication);
}
