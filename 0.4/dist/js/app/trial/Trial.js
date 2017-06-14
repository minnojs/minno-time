define(function(require){

    var _ = require('underscore');
    var pubsub = require('utils/pubsub');
    var input = require('utils/interface/interface');
    var stimulusCollection = require('../stimulus/stimulusCollection');
    var interactions = require('./interactions');
    var global_trial = require('./current_trial');
    var gid = 0;

    // data is already fully inflated
    function Trial(source, canvas){
        this.canvas = canvas;

        // make sure we always have a data container
        this.data = source.data || {};

        // keep source for later use
        this._source = source;

        // create a uniqueId for this trial
        this._id = _.uniqueId('trial_');
        this.counter = gid++;

        // make sure we have all our stuff :)
        if (!source.interactions) {
            throw new Error('Interactions not defined');
        }

        // add stimuli
        this.stimulusCollection = stimulusCollection(this, canvas);

        // subscription stack
        this._pubsubStack = [];

        // the next trial we want to play
        // by default this is simply the next trial, this can be changed using the goto action
        // the syntax is [destination, properties]
        this._next = ['next',{}];
    }

    _.extend(Trial.prototype,{
        start: function(){
            var trial = this;

            /* eslint no-console:false */
            if (this._source.DEBUG && window.DEBUG) console.group('Trial: ' + this.counter);
            /* eslint no-console:true */

            // wait until all simuli are loaded
            return trial.stimulusCollection.ready
                .then(function(){
                    // set global trial
                    global_trial(trial);

                    // setup all subscriptions
                    subscribe(trial, input);

                    // activate input
                    input.add(arrayWrap(trial._source.input));
                    input.resetTimer(); // reset the interface timer so that event latencies are relative to now.

                    // listen for interaction
                    interactions.activate(trial._source.interactions);
                });
        },

        end: function(){
            /* eslint no-console:false */
            if (this._source.DEBUG && window.DEBUG) console.groupEnd('Trial: ' + this.counter);
            /* eslint no-console:true */
            
            // cancel all listeners
            input.destroy();

            // stop interaction listeners
            interactions.disable();

            // unsubscribe
            this._pubsubStack.forEach(function(handle){ pubsub.unsubscribe(handle); });
            this._pubsubStack.length = 0;

            // unset global trial
            global_trial(undefined);

            // @TODO lets make the logger make some more sense. what is it doing here?
            pubsub.publish('log:send'); // see if we need to send the log stack

            if (_.isFunction(this.onend)) this.onend(this._next);
        },

        name: function(){
            // if we have an alias ues it
            if (this.alias) { return this.alias; }
            if (this.data.alias) { return this.data.alias; }

            // otherwise try using the set we inherited from
            if (_.isString(this._source.inherit)){ return this._source.inherit; }
            if (_.isPlainObject(this._source.inherit)){
                return this._source.inherit.set;
            }

            // we're out of options here
        }
    });

    function arrayWrap(arr){
        if (!arr){return [];}
        return _.isArray(arr) ? arr : [arr];
    }

    function subscribe(trial, input){
        // subscribe to end trial
        // ----------------------
        pubsub.subscribe('trial:end',trial._pubsubStack,trial.end.bind(trial));

        // subscribe to set attribute
        // ----------------------
        pubsub.subscribe('trial:setAttr',trial._pubsubStack,function(setter,eventData){
            if (_.isFunction(setter)) setter.apply(trial, [trial.data,eventData]);
            else _.extend(trial.data,setter);
        });

        // subscribe to set input
        // ----------------------
        pubsub.subscribe('trial:setInput',trial._pubsubStack,function(inputData){
            input.add(inputData);
        });

        // subscribe to remove input
        // -------------------------
        pubsub.subscribe('trial:removeInput',trial._pubsubStack,function(handleList){
            if (handleList == 'All' || _.include(handleList,'All')) input.destroy();
            else input.remove(handleList);
        });

        // subscribe to goto
        // -----------------
        pubsub.subscribe('trial:goto',trial._pubsubStack,function(options){
            trial._next = [options.destination, options.properties || {}];
        });

        // subscribe to start action
        // -------------------------
        pubsub.subscribe('stim:start', trial._pubsubStack, function(handle){
            trial.stimulusCollection.stimuli.forEach(function(stim){
                if (handle == 'All' || stim.handle == handle) stim.show();
            });
        });

        // subscribe to set attribute action
        // ---------------------------------
        pubsub.subscribe('stim:setAttr', trial._pubsubStack, function(handle,setter){
            trial.stimulusCollection.stimuli.forEach(function(stim){
                if (handle == 'All' || stim.handle == handle) {
                    if (_.isFunction(setter)) setter.apply(stim);
                    else _.extend(stim.data, setter);

                }
            });
        });

        // subscribe to stop stimulus action
        // ---------------------------------
        pubsub.subscribe('stim:stop', trial._pubsubStack, function(handle){
            trial.stimulusCollection.stimuli.forEach(function(stim){
                if (handle == 'All' || stim.handle == handle) stim.hide();
            });
        });
    }

    return Trial;
});
