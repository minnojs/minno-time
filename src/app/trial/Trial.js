import _ from 'lodash';
import input from './input/input';
import stimulusCollection from './stimulus/stimulusCollection';
import interactions from './interactions/interactions';
import stream from 'mithril-stream';

export default Trial;

var gid = 0;

// data is already fully inflated
function Trial(source, canvas, settings){
    // make sure we have all our stuff :)
    if (!source.interactions) throw new Error('Interactions not defined');

    this.canvas = canvas;
    this.settings = settings;
    this._source = source;

    this.$logs = stream();
    this.$events = stream();
    this.$end = this.$events.end;

    // make sure we always have a data container
    this.data = source.data || {};

    // create a uniqueId for this trial
    this._id = _.uniqueId('trial_');
    this.counter = gid++;

    this.input = input(this.$events, this);
    this.stimulusCollection = stimulusCollection(this, canvas);

    // listen for interactions
    this.$events.map(interactions(this));

    // the next trial we want to play
    // by default this is simply the next trial, this can be changed using the goto action
    // the syntax is [destination, properties]
    this._next = ['next',{}];
}

_.extend(Trial.prototype,{
    start: function(){
        var trial = this;

        // eslint-disable-next-line no-console
        if (this._source.DEBUG && window.DEBUG) console.group('Trial: ' + this.counter); 

        // wait until all simuli are loaded
        return trial.stimulusCollection.ready
            .then(function(){

                // activate input
                arrayWrap(trial._source.input).forEach(trial.input.add); // add each input
                trial.input.resetTimer(); // reset the interface timer so that event latencies are relative to now.

                // start running
                trial.$events({type:'begin',latency:0});
            });
    },

    end: function(){

        // eslint-disable-next-line no-console
        if (this._source.DEBUG && window.DEBUG) console.groupEnd('Trial: ' + this.counter); 

        // cancel all listeners
        this.input.destroy();

        this.$events.end(true);
        this.$end(true);
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

