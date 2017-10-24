import _ from 'lodash';

export default transformLogs;

function transformLogs(action,eventData,trial){
    var global = window.piGlobal;
    var trialData = trial.data, inputData = eventData, logStack = global().current.logs;
    var fullpath = _.get(trial, 'settings.logger.fullpath', false);

    var stimList = trial.stimulusCollection.getStimlist();
    var mediaList = trial.stimulusCollection.getMedialist({fullpath:fullpath});

    return {
        log_serial : logStack.length,
        trial_id: trial.counter,
        name: trial.name(),
        responseHandle: inputData.handle,
        latency: Math.floor(inputData.latency),
        stimuli: stimList,
        media: mediaList,
        data: trialData
    };
}
