/*
 * The player API
 * used to set the script object and run the player
 * will be exported to window
 */

define(['jquery','./task/script','app/task/main_view','app/task/parser','app/sequencer/player', 'app/task/log/log_stack'],function($,script,main,parse,play,logStack){

	// the API object
	var API = {};

	// we allow activating the player only  once (otherwise we cause all sorts of terible problems: double parsing, pubsub clashes etc.)
	// this var follows wether we've already activated the player
	var player_activated = false;

	/*
	 * add set function
	 * type: pertains to the type of set we're adding (should be hord coded in the API)
	 * set: set name, or full set object
	 * setObj: in case set was a name - the set to add
	 *
	 * use examples:
	 * function('trial',{
	 *   intro: [intro1, intro2],
	 *   Default: [defaultTrial]
	 * })
	 * function('trial','intro',[intro1, intro2])
	 * function('trial','Default',defaultTrial)
	 *
	 */
	function add_set(type, set, setObj){
		// get the sets we want to extend (or create them)
		var targetSets = script[type + "Sets"] || (script[type + "Sets"] = {});

		// if we get an explicit object, simply extend the set
		if (typeof set != "string") {
			$.extend(true, targetSets,set);
		}

		// if we got a named object
		else {
			// make sure the objects to add are wrapped in an array
			$.isArray(setObj) || (setObj = [setObj]);
			// if this is a whole set merge it into the existing set (or create a new one)
			targetSets[set] = targetSets[set] ? $.merge(targetSets[set], setObj) : setObj;
		}
	}

	$.extend(API, {
		// settings
		addSettings: function(settings, settingsObj){
			script.settings || (script.settings = {});
			if (typeof settings != "string"){
				$.extend(true, script.settings ,settings);
			} else {
				if ($.isPlainObject(script.settings[settings])){
					$.extend(true, script.settings[settings], settingsObj);
				} else {
					script.settings[settings] = settingsObj;
				}
			}
			return this;
		},

		// add set function
		addTrialSets: function(set,setObj){add_set('trial',set,setObj); return this;},
		addStimulusSets: function(set,setObj){add_set('stimulus',set,setObj);return this;},
		addMediaSets: function(set,setObj){add_set('media',set,setObj);return this;},

		// add sequence
		addSequence: function(sequence){
			// make sure the sequence is an array
			$.isArray(sequence) || (sequence = [sequence]);
			// set sequence
			script.sequence = script.sequence ? $.merge(script.sequence, sequence) : sequence;

			return this;
		},

		// push a whole script
		addScript: function(json){
			$.extend(true,script,json);
			return this;
		},

		// returns script (for debuging probably)
		getScript: function(){
			return script;
		},

		getLogs: function(){
			return logStack;
		},

		// run the player, returns deferred
		play: function(){

			// make sure this is the first time we're playing this sequence
			if (player_activated) {
				throw new Error('Player has already been activated. You can only call API.play() once per session');
			}
			player_activated = true;

			var parseDef = parse();

			// activate main view and then display the loading screen
			main
				.activate()
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

			return this;
		}
	});

	return API;
});
