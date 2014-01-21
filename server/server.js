var path = require('path');
var express = require('express');
var app =  express();

// Optional since express defaults to CWD/views
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


app.get('/',function(req,res){
	res.redirect('/tutorials/overview.html');
});

// app.use(express.directory(path.resolve('.')));
app.use(require('./pipDirectory')(path.resolve('.')));
app.use(express['static'](path.resolve('.')));


module.exports = app;

process.on('SIGTERM', function () {
	console.log("Closing");
	//app.close();
});
