require.paths.unshift('../lib');

const PORT = 8888;
const HOST = 'localhost';

const express = require('express');
const openid = require('openid');
const app = module.exports = express.createServer();
const CALLBACK = 'http://localhost:8888/googleopenid/verify';
const onAuthentication = function(req, res, openid_result) {
    console.log(openid_result);
    res.send('hello world');
}

const GoogleOpenid = require('GoogleOpenid').create(app, CALLBACK, onAuthentication);

app.use(
    express.staticProvider(__dirname + '/public')
);

app.set('view engine', 'jade');

function googlelogin(req, res, next) {
    res.render('index.jade');
}

app.get('/', googlelogin, function(req, res) {
    console.log('conjo');
});

if (!module.parent) {
    app.listen(PORT, HOST);
}
