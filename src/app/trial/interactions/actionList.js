import _ from 'lodash';
import fastdom from 'fastdom';
import global from '../../global';
import applyCanvasStyles from '../../task/canvas/applyCanvasStyles';

export default actions;

// @TODO: see if we can afford to change the signature of actions
// I'd like to have the trial go first here (used almost always).
var actions = {
    /*
     * Stimulus actions
     */
    showStim: function(action, eventData, trial){
        var handle = action.handle || action;
        trial.stimulusCollection.stimuli.forEach(function(stim){
            if (handle == 'All' || stim.handle == handle) stim.show();
        });
    },

    hideStim: function(action, eventData, trial){
        var handle = action.handle || action;
        trial.stimulusCollection.stimuli.forEach(function(stim){
            if (handle == 'All' || stim.handle == handle) stim.hide();
        });
    },

    setStimAttr: function(action, eventData, trial){
        var handle = action.handle;
        var setter = action.setter;
        trial.stimulusCollection.stimuli.forEach(function(stim){
            if (handle == 'All' || stim.handle == handle) {
                if (_.isFunction(setter)) setter.apply(stim);
                else _.extend(stim.data, setter);
            }
        });
    },

    /*
     * Trial actions
     */

    setTrialAttr: function(action, eventData, trial){
        var setter = action.setter;
        if (typeof setter == 'undefined') throw new Error('The setTrialAttr action requires a setter property');
        if (_.isFunction(setter)) setter.apply(trial, [trial.data,eventData]);
        else _.extend(trial.data,setter);
    },

    setInput: function(action, eventData, trial){
        if (typeof action.input == 'undefined') throw new Error('The setInput action requires an input property');
        trial.input.add(action.input);
    },

    trigger: function(action, eventData, trial){
        if (typeof action.handle == 'undefined') throw new Error('The trigger action requires a handle property');
        trial.input.add({handle:action.handle, on:'timeout', duration:+action.duration || 0});
    },

    removeInput: function(action, eventData, trial){
        var input = trial.input;
        var handleList = action.handle;
        if (typeof handleList == 'undefined') throw new Error('The removeInput action requires a handle property');
        if (handleList == 'All' || _.include(handleList,'All')) input.removeAll();
        else input.remove(handleList);
    },

    goto: function(action, eventData, trial){
        trial._next = [action.destination,action.properties];
    },

    endTrial: function(action, eventData, trial){
        trial.end();
    },

    resetTimer: function(action,eventData,trial){
        // when to reset timer
        action.immidiate ? reset() :  fastdom.mutate(reset);

        function reset(){
            eventData.latency = 0;
            trial.input.resetTimer();
        }
    },

    /*
     * Logger
     */

    log: function(action,eventData,trial){
        trial.$logs(arguments);
    },

    /*
     * Misc
     */

    setGlobalAttr: function(action){
        switch (typeof action.setter){
            case 'function':
                action.setter.apply(null,[global(), action]);
                break;
            case 'object':
                _.extend(global(), action.setter);
                break;
            default:
                throw new Error('setGlobalAttr requires a "setter" property');
        }
    },

    custom: function(action,eventData, trial){
        if (typeof action.fn != 'function') throw new Error('The custom action requires a fn propery');
        action.fn(action, eventData, trial);
    },

    canvas: function(action, eventData, trial){
        var canvas = trial.cavnas;
        var map = {
            background 			: {element: document.body, property: 'backgroundColor'},
            canvasBackground	: {element: canvas, property:'backgroundColor'},
            borderColor			: {element: canvas, property:'borderColor'},
            borderWidth			: {element: canvas, property:'borderWidth'}
        };

        // settings activator
        var off = applyCanvasStyles(map, _.pick(action,['background','canvasBackground','borderColor','borderWidth']));
        trial.$end.map(off);
    }

};

