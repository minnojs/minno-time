var path = require('path');
var express = require('express');
var app =  express();

app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');


app.get('/',function(req,res){
	res.redirect('/docs/tutorials/overview.html');
});

// server js files directly so that they do not get cached (as opposed to html or images that should always be cached)
app.get('*.js',function(req,res){
	// remove any trailing query string
	var url = req.url.replace(/\?.+$/,"");
	res.sendfile(path.resolve('.'+url), {maxAge:0});
});

// Cache images for one day
app.use(express['static'](path.resolve('.'),{maxAge:86400000}));

module.exports = app;