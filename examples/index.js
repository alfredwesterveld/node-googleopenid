require.paths.unshift('../lib');

var PORT = 8888;
var HOST = 'localhost';

var express = require('express');
var app = module.exports = express.createServer();

var onAuthentication = function(req, res, openid_result) {
    console.log(openid_result);
    res.send("" + openid_result.identifier);
}

require('google-openid').create(app, 'http://localhost:8888', onAuthentication);

/**
 * Route middleware to showsa link to redirect to Google's OpenID provider.
 */
function googlelogin(req, res, next) {
    res.send('<html><head><title>Google Openid</title></head><body>' +
        '<a href="/googleopenid/authenticate">Sign in with your ' +
        '<img src="http://www.google.com/favicon.ico" border="0" />' +
        ' account</a></body></html>');
        
}

/**
 * this route uses googlelogin route middleware.
 */
app.get('/', googlelogin, function(req, res) {
});

if (!module.parent) {
    app.listen(PORT, HOST);
}
