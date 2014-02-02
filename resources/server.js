var path = require('path');
var express = require('express');
var app =  express();

app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');


app.get('/',function(req,res){
	res.redirect('/docs/tutorials/overview.html');
});

app.use(express['static'](path.resolve('.')));

module.exports = app;

process.on('SIGTERM', function () {
	console.log("Closing express");
});