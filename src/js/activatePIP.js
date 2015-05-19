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
		play = require('app/sequencer/player'),
		global = require('app/global');


	function activate(script, done){
		// init global
		var glob = global(global());
		var name = script.name || 'anonymous PIP';

		// create local namespace
		glob[name] = glob.current = (_.isPlainObject(script.current) ? script.current : {});
		glob.current.logs || (glob.current.logs = []); // init logs object

		// set the main script as a global
		mainScript(script);

		var parseDef = parse();

		// activate main view and then display the loading screen
		main
			.activate()
			.done(function(){
				main
					.loading(parseDef) // activate loading screen
					.done(function(){
						main.empty(); // remove the loading screen
						play('next',{}); // activate task
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