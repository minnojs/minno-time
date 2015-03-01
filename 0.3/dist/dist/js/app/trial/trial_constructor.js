define(function(require){

	var $ = require('jquery');
	var _ = require('underscore');
	var pubsub = require('utils/pubsub');
	var input = require('utils/interface/interface');
	var Stimuli = require('app/stimulus/stimulus_collection');
	var interactions = require('./interactions');
	var global_trial = require('./current_trial');
	var inflate = require('../inflator');
	var main = require('app/task/main_view');
	var counter = 0;

	var Trial = function(trialData){

		// inflate trial source
		var data = inflate(trialData,'trial');

		// extend trial with inflated data @todo maybe get rid of this, we have al the info in _source anyway
		_.extend(this, data);

		// make sure we always have a data container
		this.data || (this.data = {});

		// keep source for later use
		this._source = data;

		// create a uniqueId for this trial
		this._id = _.uniqueId('trial_');
		this.counter = counter++;

		// make sure we have all our stuff :)
		//if (!this.input) throw new Error('Input module not defined');
		if (!this.interactions) {
			throw new Error('Interactions not defined');
		}

		// add layout stimuli
		this._layout_collection = new Stimuli(this.layout || [],{trial:this});

		// add main stimuli
		this._stimulus_collection = new Stimuli(this.stimuli  || [],{trial:this});

		// subscription stack
		this._pubsubStack = [];

		// the next trial we want to play
		// by default this is simply the next trial, this can be changed using the goto action
		// the syntax is [destination, properties]
		this._next = ['next',{}];

		// the trial deferred (used to follow when the trial ends)
		this.deferred = $.Deferred();
	};

	_.extend(Trial.prototype,{

		activate: function(){

			var self = this;

			// set global trial
			global_trial(this);

			// display layout elements
			this._layout_collection.display_all();

			// subscribe to end trial
			pubsub.subscribe("trial:end",this._pubsubStack,_.bind(this.deactivate,this));

			// subscribe to set attribute
			pubsub.subscribe("trial:setAttr",this._pubsubStack,function(setter,eventData){
				if (_.isFunction(setter)) {
					setter.apply(self, [self.data,eventData]);
				} else {
					_.extend(self.data,setter);
				}
			});

			// subscribe to set input
			pubsub.subscribe("trial:setInput",this._pubsubStack,function(inputData){
				input.add(inputData);
			});

			// subscribe to remove input
			pubsub.subscribe("trial:removeInput",this._pubsubStack,function(handleList){
				if (handleList == 'All' || _.include(handleList,'All')){
					input.destroy();
				} else {
					input.remove(handleList);
				}
			});

			// subscribe to goto
			pubsub.subscribe("trial:goto",this._pubsubStack,function(options){
				self._next = [options.destination, options.properties || {}];
			});

			// activate input
			input.add(this.input || []);

			// activate stimuli
			this._stimulus_collection.activate();

			// reset the interface timer so that event latencies are relative to now.
			input.resetTimer();

			// listen for interaction
			interactions.activate(this.interactions);

			// return the trial deferred
			return this.deferred.promise();
		},

		deactivate: function(){
			var self = this;

			// cancel all listeners
			input.destroy();

			// disable active stimuli
			this._stimulus_collection.disable();

			// stop interaction listeners
			interactions.disable();

			// unsubscribe
			_.each(this._pubsubStack, function(handle) {
				pubsub.unsubscribe(handle);
			});
			this._pubsubStack = [];

			// unset global trial
			global_trial(undefined);

			// IE7 or lower
			// @todo: improve very ugly solution to ie7 bug, we need the no timeout solution for ipad where this causes a blink
			if (document.all && !document.addEventListener) {
				// resolve this trial (inside timeout, to make sure the endtrial subscription ends. ie7 bug)
				setTimeout(function(){
					// remove all stimuli from canvas (needs to be inside timeout to prevent blink in some browsers)
					main.empty();
					self.deferred.resolve(self._next[0], self._next[1]);

				},1);
			} else {
				// regular resolve (let the deferred know were we are going next)
				main.empty();
				self.deferred.resolve(self._next[0], self._next[1]);
			}
		},

		name: function(){
			// if we have an alias ues it
			if (this.data.alias) {
				return this.data.alias;
			}
			// otherwise try using the set we inherited from
			if (_.isString(this.inherit)){
				return this.inherit;
			}
			if (_.isPlainObject(this.inherit)){
				return this.inherit.set;
			}
			return false; // we're out of options here
		}
	});

	return Trial;
});