define(function(require){

	var _ = require('underscore');

	/**
	 * Constructor for PIPlayer script creator
	 * @return {Object}		Script creator
	 */
	function API(name){
		this.script = {
			global: {}, // the real global should be extended with this
			current: {}, // this is the actual namespace for this PIP
			trialSets: [],
			stimulusSets: [],
			mediaSets: [],
			sequence: []
		};

		this.script.name = name || 'anonymous PIP';

		this.settings = this.script.settings = {
			canvas: {
				maxWidth: 800,
				proportions: 0.8
			},
			hooks: {}
		};
	}

	_.extend(API.prototype, {

		// add set function
		addTrialSets: add_set('trial'),
		addStimulusSets: add_set('stimulus'),
		addMediaSets: add_set('media'),

		// settings
		addSettings: function(name, settingsObj){
			var settings;

			if (_.isPlainObject(settingsObj)){
				settings = this.settings[name] = this.settings[name] || {};
				_.extend(settings, settingsObj);
			} else {
				this.settings[name] = settingsObj;
			}

			return this;
		},

		addSequence: function(sequence){
			var script = this.script;
			_.isArray(sequence) || (sequence = [sequence]);

			script.sequence = script.sequence.concat(sequence);

			return this;
		},

		addGlobal: function(global){
			if (!_.isPlainObject(global)){
				throw new Error('global must be an object');
			}
			_.merge(this.getGlobal(), global);
		},

		getGlobal: function(){
			return window.piGlobal;
		},

		addCurrent: function(current){
			if (!_.isPlainObject(current)){
				throw new Error('current must be an object');
			}
			_.merge(this.script.current, current);
		},

		getCurrent: function(){
			return this.script.current;
		},

		// push a whole script
		addScript: function(obj){
			_.merge(this.script,obj);
		},

		// returns script (for debuging probably)
		getScript: function(){
			return this.script;
		},

		getLogs: function(){
			return this.script.current.logs;
		},

		// run the player, returns deferred
		play: function(){
			throw new Error('you should return API.script instead of calling API.play()!!');
		},

		post: function(url, obj){
			var $ = require('jquery');
			$.post(url, obj);
		}

	});

	return API;

	 /**
	  * Create a function that adds sets of a scpecific type
	  * @param {String} type  	The type of set setter to create
	  * @returns {Function} 	A setter object
	  */
	function add_set(type){

		/**
		 * Adds a set to the targetSet
		 * @param {String, Object} set    	Either full set object, or the name of this setArr
		 * @param {Array} setArr 			An array of objects for this set
		 * @returns {Object} The API object
		 *
		 * use examples:
		 * fn({
		 *   intro: [intro1, intro2],
		 *   Default: [defaultTrial]
		 * })
		 * fn('intro',[intro1, intro2])
		 * fn('Default',defaultTrial)
		 *
		 */
		function setSetter(set, setArr){

			// get the sets we want to extend (or create them)
			var targetSets = this.script[type + "Sets"] || (this.script[type + "Sets"] = []);
			var list;

			if (_.isPlainObject(set)) {
				list = _(set)
					// for each set of elements
					.map(function(value, key){
						// add the set name to each key
						_.each(value, function(v){v.set = key;});
						return value; // return the set
					})
					.flatten() // flatten all sets to a single array
					.value();
			}

			if (_.isArray(set)){
				list = set;
			}

			if (_.isString(set)){
				list = _.isArray(setArr) ? setArr : [setArr];
				list = _.map(list, function(value){
					value.set = set;
					return value;
				});

			}

			// merge the list into the targetSet
			targetSets.push.apply(targetSets, list);
		}

		return setSetter;
	}
});