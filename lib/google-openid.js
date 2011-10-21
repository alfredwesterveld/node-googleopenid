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
        that.authenticate(req, res, onAuthentication);
    });
};

GoogleOpenid.prototype.verify = function(req, res, onAuthentication) {
    this.relyingParty.verifyAssertion(req, function(error, result) {
        onAuthentication(error, req, res, result);
    });
};

GoogleOpenid.prototype.authenticate = function(req, res) {
    this.relyingParty = new openid.RelyingParty(
        this.baseURL + "/googleopenid/verify", // our callback URL
        null, // realm (optional)
        false, // stateless
        false, // strict mode
        null); // List of extensions to enable and include

    this.relyingParty.authenticate(GOOGLE_ENDPOINT, false, function(error, authUrl) {
        if (error) {
            onAuthentication(error);
        } else if (!authUrl) {
            onAuthentication('Authentication failed - no redirect url received');
        } else {
            res.writeHead(302, { Location: authUrl });
            res.end();
        }
    });
};

module.exports.create = function(app, baseURL, onAuthentication) {
    return new GoogleOpenid(app, baseURL, onAuthentication);
};
