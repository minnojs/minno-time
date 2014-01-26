var path = require('path');
var express = require('express');
var app =  express();

// Optional since express defaults to CWD/views
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


app.get('/',function(req,res){
	//res.redirect('/tutorials/overview.html');
	res.redirect('/tutorials/tutorial/hello.md');
});

app.get('/tutorials/tutorial/*.md',function(req,res,next){
	try {
		var fs = require('fs');
		var md = require('marked');
		var str = fs.readFileSync(path.resolve('.' + req.path), 'utf8');
		res.render('md',{
			//content: path.resolve('.' + req.path)
			content:md(str)
		});
	} catch(err) {
		next(err);
	}

});


// app.use(express.directory(path.resolve('.')));
app.use(require('./pipDirectory')(path.resolve('.')));
app.use(express['static'](path.resolve('.')));


module.exports = app;

process.on('SIGTERM', function () {
	console.log("Closing express");
});