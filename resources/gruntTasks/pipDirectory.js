/*
 * Grunt task for displaying PIP directories
 */

var path = require('path');
var jade = require('jade');
var md = require('marked');
var fs = require('fs');

module.exports = function(grunt){
	// create template()
	var tplPath = path.resolve(__dirname + '/../templates/pipDirectory.jade');
	var tplSrc = grunt.file.read(tplPath);
	var template = jade.compile(tplSrc,{
		filename: tplPath
	});

	grunt.registerMultiTask('pipDirectory','Creating indexes',function(){
		var done = this.async();

		// @TODO: warn about non existent folders
		this.files.forEach(function(file){

			// Warn on and remove invalid source files
			file.src.forEach(function(filepath) {
				//filepath = path.resolve(filepath);

				if (!grunt.file.exists(filepath) || !grunt.file.isDir(filepath)) {
					grunt.log.warn('Directory "' + filepath + '" not found.');
				} else {
					// ***
					// Parse directory
					// ***
					// @TODO: read yaml
					// @TODO: read readme.markdown

					var readme = "";
					var readmePath = path.join(filepath, 'README.md');
					if (grunt.file.exists(readmePath)) {
						readme = md(grunt.file.read(readmePath));
					}

					fs.readdir(filepath, function(err, files){

						if (err) {return grunt.log.error(err);}
						files = files
							// make sure this is a js file
							.filter(function(file){return file.length - file.lastIndexOf('.js') === 3; })
							.sort()
							.map(function(file){
								return {
									name: file.substring(0,file.length-3),
									js:path.join('..', filepath, file),
									docco: file.replace('.js','.html')
								};
							});

						grunt.file.write(path.join(file.dest,'index.html'),template({
							dir: filepath,
							files: files,
							readme: readme
						}));
						done();
					});


				}
				return true;

				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
				} else {
					// if this is a js file
					if (filepath.length - filepath.lastIndexOf('.js') === 3){
						console.log(filepath)
					}


				}

				return true;

					fs.readdir(path, function(err, files){
						if (err) return next(err);
						if (!hidden) files = removeHidden(files);
						if (filter) files = files.filter(filter);
						// make sure this is a js file
						files = files.filter(function(file){return file.length - file.lastIndexOf('.js') === 3; });
						files.sort();
					});




					var src = grunt.file.read(filepath);

					// run this file through markdown
					src = md(src);

					// run this file through the jade template
					src = template({
						content: src
					});
					console.log('Writing ' + filepath + ' ==> ' + file.dest);
					grunt.file.write(file.dest, src);
			});
		});
	});

	template;

};








/*
 * Middleware for connect/express that shows PIP script directories
 * Cheap ripoff of connect-directory
 */

/**
 * Module dependencies.
 */

var fs = require('fs')
	, parse = require('url').parse
	, path = require('path')
	, normalize = path.normalize
	, extname = path.extname
	, join = path.join
	, http = require('http')
	, utils = {
		error : function(code, msg){
			var err = new Error(msg || http.STATUS_CODES[code]);
			err.status = code;
			return err;
		}
	};

/*!
 * Icon cache.
 */

var cache = {};

/**
 * Directory:
 *
 * Serve directory listings with the given `root` path.
 *
 * Options:
 *
 *	- `hidden` display hidden (dot) files. Defaults to false.
 *	- `icons`	display icons. Defaults to false.
 *	- `filter` Apply this filter function to files. Defaults to false.
 *
 * @param {String} root
 * @param {Object} options
 * @return {Function}
 * @api public
 */

exports = function directory(root, options){
	options = options || {};

	// root required
	if (!root) {
		throw new Error('directory() root path required');
	}
	var hidden = options.hidden
		, icons = options.icons
		, filter = options.filter;

	root = normalize(root);

	return function directory(req, res, next) {
		if ('GET' != req.method && 'HEAD' != req.method) {
			return next();
		}

		var accept = req.headers.accept || 'text/plain'
			, url = parse(req.url)
			, dir = decodeURIComponent(url.pathname)
			, path = normalize(join(root, dir))
			, originalUrl = parse(req.originalUrl)
			, originalDir = decodeURIComponent(originalUrl.pathname)
			, showUp = path != root && path != root + '/';

		// null byte(s), bad request
		if (~path.indexOf('\0')) return next(utils.error(400));

		// malicious path, forbidden
		if (0 !== path.indexOf(root)) return next(utils.error(403));


	};
};

/**
 * Respond with text/html.
 */

exports.html = function(req,res,files, next, dir, showUp){
	showUp;
	res.render('pipDirectory',{
		dir:dir,
		files: files
	});
};

/*
exports.html = function(req, res, files, next, dir, showUp, icons){
	fs.readFile(__dirname + '/pipDirectory.html', 'utf8', function(err, str){
		if (err) return next(err);
		fs.readFile(__dirname + '/style.css', 'utf8', function(err, style){
			if (err) return next(err);
			if (showUp) files.unshift('..');
			str = str
				.replace('{style}', style)
				.replace('{files}', html(files, dir, icons))
				.replace('{directory}', dir)
				.replace('{linked-path}', htmlPath(dir));
			res.setHeader('Content-Type', 'text/html');
			res.setHeader('Content-Length', str.length);
			res.end(str);
		});
	});
};
*/

/**
 * Respond with application/json.
 */

exports.json = function(req, res, files){
	files = JSON.stringify(files);
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Content-Length', files.length);
	res.end(files);
};

/**
 * Respond with text/plain.
 */

exports.plain = function(req, res, files){
	files = files.join('\n') + '\n';
	res.setHeader('Content-Type', 'text/plain');
	res.setHeader('Content-Length', files.length);
	res.end(files);
};

/**
 * Map html `dir`, returning a linked path.
 */

function htmlPath(dir) {
	var curr = [];
	return dir.split('/').map(function(part){
		curr.push(part);
		return '<a href="' + curr.join('/') + '">' + part + '</a>';
	}).join(' / ');
}

/**
 * Map html `files`, returning an html unordered list.
 */

function html(files, dir, useIcons) {
	return '<ul id="files">' + files.map(function(file){
		var icon = ''
			, classes = [];

		if (useIcons && '..' != file) {
			icon = icons[extname(file)] || icons.default;
			icon = '<img src="data:image/png;base64,' + load(icon) + '" />';
			classes.push('icon');
		}

		return '<li><a href="'
			+ join(dir, file)
			+ '" class="'
			+ classes.join(' ') + '"'
			+ ' title="' + file + '">'
			+ icon + file + '</a></li>';

	}).join('\n') + '</ul>';
}

/**
 * Load and cache the given `icon`.
 *
 * @param {String} icon
 * @return {String}
 * @api private
 */

function load(icon) {
	if (!cache[icon]) cache[icon] = fs.readFileSync(__dirname + '/../public/icons/' + icon, 'base64');
	return cache[icon];
}

/**
 * Filter "hidden" `files`, aka files
 * beginning with a `.`.
 *
 * @param {Array} files
 * @return {Array}
 * @api private
 */

function removeHidden(files) {
	return files.filter(function(file){
		return '.' != file[0];
	});
}

/**
 * Icon map.
 */

var icons = {
		'.js': 'page_white_code_red.png'
	, '.c': 'page_white_c.png'
	, '.h': 'page_white_h.png'
	, '.cc': 'page_white_cplusplus.png'
	, '.php': 'page_white_php.png'
	, '.rb': 'page_white_ruby.png'
	, '.cpp': 'page_white_cplusplus.png'
	, '.swf': 'page_white_flash.png'
	, '.pdf': 'page_white_acrobat.png'
	, 'default': 'page_white.png'
};

