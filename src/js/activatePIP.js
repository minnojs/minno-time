/**
 * Activate pip script
 * @param  {Object} script    The pip script we want to run
 * @param  {?function} done   A function to call once pip is over
 * @return {promise}
 */
define(function(require){

	var _ = require('underscore'),
		$ = require('jquery'),
		Player = require('app/sequencer/player');


	function activate(script, done){
		var player = new Player(script);
		player.on('done', done || dfltDone);
		$(document).ready(function(){
			player.start();
		});

		return _.bind(player.stop, player);

		function dfltDone(){
			window.location.href = _.get(script, 'settings.redirect', window.location.href);
		}
	}

	return activate;
});