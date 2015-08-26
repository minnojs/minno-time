define(function(require){

	var _ = require('underscore')
		, pubsub = require('utils/pubsub')
		, global = require('app/global');

 	var actions = {
		/*
		 * Stimulus actions
		 */

		showStim: function(trial, actionObj){
			var handle = actionObj.handle || actionObj;
			trial.trigger('stim:start',handle);
		},

		hideStim: function(trial, actionObj){
			var handle = actionObj.handle || actionObj;
			trial.trigger('stim:stop',handle);
		},

		setStimAttr: function(trial, actionObj){
			var handle = actionObj.handle;
			var setter = actionObj.setter;
			trial.trigger('stim:setAttr',handle,setter);
		},

		/*
		 * Trial actions
		 */

		setTrialAttr: function(trial, actionObj, eventData){
			if (typeof actionObj.setter == 'undefined') {
				throw new Error('The setTrialAttr action requires a setter property');
			}
			trial.trigger('trial:setAttr',actionObj.setter, eventData);
		},

		setInput: function(trial, actionObj){
			if (typeof actionObj.input == 'undefined') {
				throw new Error('The setInput action requires an input property');
			}
			trial.trigger('trial:setInput',actionObj.input);
		},

		trigger: function(trial, actionObj){
			if (typeof actionObj.handle == 'undefined') {
				throw new Error('The trigger action requires a handle property');
			}
			trial.trigger('trial:setInput',{handle:actionObj.handle,on:'timeout',duration:+actionObj.duration || 0});
		},

		removeInput: function(trial, actionObj){
			if (typeof actionObj.handle == 'undefined') {
				throw new Error('The removeInput action requires a handle property');
			}
			trial.trigger('trial:removeInput',actionObj.handle);
		},

		// we use es3 true to protect from trailing commas in IE7. Here jshint thinks goto is a reserved word.
		/* jshint es3:false */
		goto: function(trial, actionObj){
			trial.trigger('trial:goto',actionObj);
		},

		endTrial: function(trial){
			trial.trigger('trial:end');
		},

		resetTimer: function(trial, actionObj, eventData){
			trial.trigger('trial:resetTimer', actionObj, eventData);
		},

		/*
		 * Logger
		 */

		log: function(trial, actionObj, eventData){
			pubsub.publish('log',[actionObj, eventData]);
		},

		/*
		 * Misc
		 */

		setGlobalAttr: function(trial, actionObj){
			switch (typeof actionObj.setter){
				case 'function':
					actionObj.setter.apply(null,[global(), actionObj]);
					break;
				case 'object':
					_.extend(global(), actionObj.setter);
					break;
				default:
					throw new Error('setGlobalAttr requires a "setter" property');
			}
		},

		custom: function(trial, actionObj, eventData){
			if (typeof actionObj.fn != 'function') {
				throw new Error('The custom action requires a fn propery');
			}
			actionObj.fn.apply(null, [actionObj, eventData,global()]);
		},

		canvas: function(trial, actionObj){
			var $canvas = require('app/task/main_view').$el;
			var canvas = require('app/task/canvasConstructor');
			var trial = require('app/trial/current_trial')();
			var map = {
				background 			: {element: $('body'), property: 'backgroundColor'},
				canvasBackground	: {element: $canvas, property:'backgroundColor'},
				borderColor			: {element: $canvas, property:'borderColor'},
				borderWidth			: {element: $canvas, property:'borderWidth'}
			};

			// settings activator
			var off = canvas(map, _.pick(actionObj,['background','canvasBackground','borderColor','borderWidth']));
			trial.deferred.promise().always(off);
		}

	};

	return actions;
});