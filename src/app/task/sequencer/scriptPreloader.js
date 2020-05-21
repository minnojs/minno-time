/*
 * gets all media that needs preloading and preloads it
 */

import _ from 'lodash';
import preloader from './preloader';
import buildUrl from './buildUrl';

export default preloadScript;

function preloadScript(script, baseUrl){
    getScriptMedia(script).forEach(loadMedia);
    return preloader;

    function loadMedia(media){
        if (!_.isUndefined(media.image)) preloader.load(buildUrl(baseUrl, media.image, 'image'),'image');
        if (!_.isUndefined(media.template)) preloader.load(buildUrl(baseUrl, media.template,'template'),'template');
    }
}

/**
 * Iterates over a script and gathers all media
 **/
export function getScriptMedia(script){
    var mediaSets = script.mediaSets;
    var stimulusSets = _.map(script.stimulusSets, getStimMedia);
    var trialSets = _.map(script.trialSets, getTrialMedia);
    var sequence = _.filter(script.sequence,notMixer).map(getTrialMedia);
    var preload = _.get(script.settings,'preloadImages', []).map(function(url){ return {image:url}; });

    return _.flattenDeep([mediaSets, stimulusSets, trialSets, sequence, preload]).filter(notUndefined);
} 

function getTrialMedia(trial){
    return [
        _.map(trial.input, function(input){ return input.element; }),
        _.map(trial.stimuli, getStimMedia),
        _.map(trial.layout, getStimMedia)
    ];
}

function getStimMedia(stim){ return stim.media; }
function notMixer(trial){ return !trial.mixer; }
function notUndefined(val){ return !_.isUndefined(val); }
