define(function(require){

	var _ = require('underscore');
	var Events = require('backbone').Events;
	var input = require('../interface/interface');
	var Stimuli = require('../stimulus/stimulus_collection');
	var interactions = require('./interactions');
	var global_trial = require('./current_trial');
	var counter = 0;

	function Trial(source, options){
		if (!source.interactions) {
			throw new Error('Interactions not defined.');
		}

		this.data = source.data || {};
		this.source = source;
		this._id = _.uniqueId('trial_');
		this.counter = counter++;
		this.container = options.container;

		this._layout_collection = new Stimuli(arrayWrap(source.layout),{trial:this, container:options.container});
		this._stimulus_collection = new Stimuli(arrayWrap(source.stimuli),{trial:this, container:options.container});

		// the next trial we want to play
		// by default this is simply the next trial, this can be changed using the goto action
		// the syntax is [destination, properties]
		this._next = ['next',{}];
	}

	_.extend(Trial.prototype,Events,{
		input: input,

		interactions: interactions,

		activate: function(){
			// set global trial
			global_trial(this);

			this.on('trial:stop', this.deactivate, this);
			this.on('trial:setAttr', this.setData, this);
			this.on('trial:setInput', this.setInput, this);
			this.on('trial:removeInput', this.removeInput, this);
			this.on('trial:resetTimer', this.resetTimer, this);
			this.on('trial:goto', this.updateGoto, this);

			// activate stimuli
			this._layout_collection.display_all();
			this._stimulus_collection.activate();

			// activate input
			this.input.add(arrayWrap(this.source.input));
			this.input.resetTimer();
			this.listenTo(this.input, 'all', function(type,eventData){
				// on all input events, attempt to interact
				this.interactions(this, this.source.interactions, eventData);
			});

			// fire the beginTrial event
			this.input.trigger('begin',{type:'begin', handle:'begin', latency:0});
		},

		deactivate: function(){
			// cancel all listeners
			this.input.destroy();

			// disable active stimuli
			this._stimulus_collection.disable();

			// unset global trial
			global_trial(undefined);

			this.trigger('trial:end', this._next[0], this._next[1]);

			// remove all listeners
			this.off();
			this.stopListening();
		},

		/**
		 * Dispacher callbacks
		 */

		setData: function(setter,eventData){
			if (_.isFunction(setter)) {
				setter.apply(this, [this.data,eventData]);
			} else {
				_.extend(this.data,setter);
			}
		},

		setInput: function(inputData){
			this.input.add(inputData);
		},

		removeInput: function(handleList){
			if (handleList == 'All' || _.include(handleList,'All')){
				this.input.destroy();
			} else {
				input.remove(handleList);
			}
		},

		resetTimer: function(options,eventData){
			// set current evenData to 0
			eventData.latency = 0;
			// reset the global timer
			this.input.resetTimer();
		},

		updateGoto: function(options){
			this._next = [options.destination, options.properties || {}];
		},

		/**
		 * Utility functions
		 */

		name: function(){
			// if we have an alias ues it
			if (this.source.alias) {return this.source.alias;}
			if (this.data.alias) {return this.data.alias;}

			// otherwise try using the set we inherited from
			if (_.isString(this.source.inherit)){return this.source.inherit;}
			if (_.isPlainObject(this.source.inherit)){return this.source.inherit.set;}

			// we're out of options here
			return this._id;
		}
	});

	function arrayWrap(arr){
		if (!arr){return [];}
		return _.isArray(arr) ? arr : [arr];
	}

	return Trial;
});