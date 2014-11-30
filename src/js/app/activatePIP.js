/**
 * Activate pip script
 * @param  {Object} script    The pip script we want to run
 * @param  {?function} done   A function to call once pip is over
 * @return {promise}
 */
define(function(require){

	var _ = require('underscore'),
		mainScript = require('./task/script'),
		main = require('app/task/main_view'),
		parse = require('app/task/parser'),
		play = require('app/sequencer/player'),
		global = require('./global');


	function activate(script, done){

		// set default done function
		var settings = script.settings || (script.settings = {});
		settings.$done = done || function dfltDone(){
			window.location.href = settings.redirect || window.location.href;
		};


		// init global
		var glob = global(global());
		var name = script.name || 'anonymous PIP';




		// warn of recurring task name
		if (glob[name] && console.warn){
			console.warn('The task "' + name + '" already exists. Overwriting it...');
		}

		// create local namespace
		glob[name] = glob.current = (_.isPlainObject(script.current) ? script.current : {});
		glob.current.logs || (glob.current.logs = []); // init logs object

		// set the main script
		mainScript(script);

		var parseDef = parse();

		// activate main view and then display the loading screen
		main
			.activate()
			.docReady()
			.done(function(){
				main
					.loading(parseDef) // activate loading screen
					.done(function(){
						main.empty(); // remove the loading screen
						play(); // activate task
					})
					.fail(function(src){
						throw new Error('loading resource failed, do something about it! (you can start by checking the error log, you are probably reffering to the wrong url - ' + src +')');
					});
			});
	}

	return activate;
});