import Stimulus from './Stimulus';
import _ from 'lodash';

export default stimCollection;

function stimCollection(trial, canvas){
    validateStimuli('stimuli', trial._source);
    validateStimuli('layout', trial._source);

    var source = trial._source;
    var stimuli = _.map(source.stimuli, toStim);
    var layout = _.map(source.layout, toLayout).map(toStim);
    var stimReady = stimuli.concat(layout).map(function(stim,index){return stim.init(index);});

    var self = {
        canvas: canvas,
        stimuli: stimuli,
        layout: layout,
        ready: Promise.all(stimReady),
        getStimlist: getStimlist,
        getMedialist: getMedialist,
        destroy: destroy
    };

    return self;

    function toStim(stim){ return Stimulus(stim, trial, canvas); }
    function toLayout(stim){ stim.isLayout = true; return stim;}
}

function getStimlist(){
    return this.stimuli
        .filter(function(stim){return !stim.source.nolog;})
        .map(function(stim, index){return stim.name() || ('stim' + index);});
}

function getMedialist(options){
    return this.stimuli
        .filter(function(stim){return !stim.source.nolog;})
        .map(function(stim, index){return stim.mediaName(options) || ('media' + index);});
}

function destroy(){
    this.stimuli.concat(this.layout).forEach(function(stim){stim.destroy();});
}

export function validateStimuli(type, source){
    var stimuli = source[type];
    if (!stimuli) return;
    if (!Array.isArray(stimuli)) throw new Error(type + ' must be an array');
    if (!stimuli.every(function(stim){ return 'media' in stim; })) throw new Error('Each ' + type + ' stimulus must have a media property');
}
