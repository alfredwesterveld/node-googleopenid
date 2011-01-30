require.paths.unshift('../lib');

var PORT = 8888;
var HOST = 'localhost';

var express = require('express');
var app = module.exports = express.createServer();
app.set('view engine', 'jade');

var onAuthentication = function(req, res, openid_result) {
    console.log(openid_result);
    res.send("" + openid_result.identifier);
}
require('google-openid').create(app, onAuthentication);

function googlelogin(req, res, next) {
    res.render('index.jade');
}

app.get('/', googlelogin, function(req, res) {
});

if (!module.parent) {
    app.listen(PORT, HOST);
}
