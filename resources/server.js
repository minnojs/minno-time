var path = require('path');
var express = require('express');
var app =  express();

app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');


app.get('/',function(req,res){
	res.redirect('/docs/tutorials/overview.html');
});

// Cache images but not js for one day
app.use('/resources/examples/images',express['static'](path.resolve('./resources/examples/images'),{maxAge:86400000}));
app.use(express['static'](path.resolve('.')));

module.exports = app;