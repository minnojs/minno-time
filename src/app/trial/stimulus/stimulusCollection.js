import Stimulus from './Stimulus';

export default stimCollection;

function stimCollection(trial, canvas){
    var source = trial._source;
    var stimuli = source.stimuli.map(toStim);
    var layout = source.layout.map(toLayout).map(toStim);
    var ready = Promise.all(stimuli.concat(layout).map(function(stim){return stim.init();}));
    var self = {
        canvas: canvas,
        stimuli: stimuli,
        layout: layout,
        ready: ready,
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
