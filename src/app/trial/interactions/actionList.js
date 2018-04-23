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

    endTrial: function(){
        // this is explicitly managed in interaction.js
        // in order to improve trial lifecycle control
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
    },

    /*
     *  Mouse tracking
     */
    startMouseTracking: function(action, eventData, trial){
        if (trial.data.listener) return trial.$message({ type:'warn', message: 'Mouse tracking has already been activated.' });

        var startTime = performance.now();
        var canvas = trial.canvas;// get its computed style
        var logAs = action.logAs || 'mousetracker';

        // get canvas borders so that we can compute relative to the content box
        var styling = getComputedStyle(canvas);
        var topBorder = parseInt(styling.getPropertyValue('border-top-width'));
        var leftBorder = parseInt(styling.getPropertyValue('border-left-width'));

        var trackedStimuli = trial.stimulusCollection.stimuli.filter(function(stim){ return _.contains(action.logStimulusLocation, stim.handle); });

        var listener = _.throttle(function(e){
            var canvasLocation = canvas.getBoundingClientRect();
            var correctedCanvas = {x:canvasLocation.x+leftBorder, y:canvasLocation.y+topBorder};
            var mouseLocation = { mouseX: e.clientX - correctedCanvas.x, mouseY: e.clientY - correctedCanvas.y };

            var locations = trackedStimuli.reduce(function(acc, val){
                var rect = val.el.getBoundingClientRect();
                _.set(acc, val.handle+'X',rect.x - correctedCanvas.x);
                _.set(acc, val.handle+'Y',rect.y - correctedCanvas.y);
                return acc;
            }, mouseLocation);

            var results = _.mapValues(_.set(locations, 'time', performance.now()-startTime), Math.round);

            trial.data[logAs].push(results);
        }, action.logRate || 15);

        trial.data[logAs] = [];
        trial.data.$listener = listener;

        document.addEventListener('mousemove', listener);
        trial.$events.end.map(function(){ // make sure that the listener is removed at the end of the trial
            document.removeEventListener('mousemove', listener);
        });
    },


    stopMouseTracking: function(e, ed, trial){
        _.isFunction(trial.data.$listener) && document.removeEventListener('mousemove', trial.data.$listener);
    }
};

