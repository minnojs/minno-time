/**
 * Activate pip script
 * @param  {Object} script    The pip script we want to run
 * @param  {?function} done   A function to call once pip is over
 * @return {promise}
 */
define(function(require){

	var _ = require('underscore'),
		mainScript = require('app/task/script'),
		main = require('app/task/main_view'),
		parse = require('app/task/parser'),
		Player = require('app/sequencer/player'),
		global = require('app/global');

	// expose object
	// GUI:
	//   loading
	//   play
	//
	// separate parser and preload
	// parser should return a instance of a database (sequence?)
	//
	// preloading should be optional, and manage the loading screen on its own...
	// preloader should expose the preloading functions, and should be used together with deep mixer walker (db.each('qeustions').map)
	//
	// start => preload.then(activate) // run the whole thing
	// activate => // start, no preload
	// preload => walk db, preload each
	//
	// I'm not clear were we wait for doc.ready
	// we can parse first for sure, preload? probably.
	// we might wait with the creation of main, this may be wrapped up in one of the setup functions...
	//

	function activate(script, done){
		// init global
		var glob = global();
		var name = script.name || 'anonymous PIP';
		var player = new Player(script.settings || {});

		// create local namespace
		glob[name] = glob.current = (_.isPlainObject(script.current) ? script.current : {});
		glob.current.logs || (glob.current.logs = []); // init logs object

		// set the main script as a global
		// @TODO: get this out of our hair
		mainScript(script);

		var parseDef = parse(script);

		// activate main view and then display the loading screen

		main
			.activate()
			.done(function(){
				main
					.loading(parseDef) // activate loading screen
					.done(function(){
						player.next('next',{}); // activate task
					})
					.fail(function(src){
						throw new Error('loading resource failed, do something about it! (you can start by checking the error log, you are probably reffering to the wrong url - ' + src +')');
					});
			});

		return main.deferred.promise()
			.then(done || function dfltDone(){
				var redirect = script.settings && script.settings.redirect;
				window.location.href = redirect || window.location.href;
			});
	}

	return activate;
});