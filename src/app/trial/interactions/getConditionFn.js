import _ from 'lodash';
import globalGetter from '../../global';

var global = globalGetter();
var conditionHash = {
    begin:begin,
    inputEquals:inputEquals,
    inputEqualsTrial:inputEqualsTrial,
    inputEqualsStim:inputEqualsStim,
    trialEquals:trialEquals,
    inputEqualsGlobal:inputEqualsGlobal,
    globalEquals:globalEquals,
    globalEqualsTrial:globalEqualsTrial,
    globalEqualsStim:globalEqualsStim,
    currentEquals:currentEquals,
    currentEqualsTrial:currentEqualsTrial,
    currentEqualsStim:currentEqualsStim,
    inputEqualsCurrent:inputEqualsCurrent,
    fn:fn,
    custom:custom,
};

export default function getConditonFn(condition){
    if (_.isFunction(condition)) return condition;
    if (_.isFunction(conditionHash[condition.type])) return conditionHash[condition.type];
    throw new Error('Unknown condition type: ' + JSON.stringify(condition));
}

function begin(inputData){ return inputData.type === 'begin'; }

function inputEquals(inputData, condition){
    var values = Array.isArray(condition.value) ? condition.value : [condition.value];
    return values.indexOf(inputData.handle) !== -1;
}

function inputEqualsTrial(inputData, condition, trial){ return inputData.handle === trial.data[condition.property]; }

function inputEqualsStim(inputData, condition, trial){
    // create search object
    var searchObj = {};
    if (condition.handle) searchObj['handle'] = condition.handle;
    searchObj[condition.property] = inputData.handle;

    // are there stimuli answering this descriptions?
    return hasData(searchObj,trial);
}

function trialEquals(inputData, condition, trial){
    if (typeof condition.property == 'undefined' || typeof condition.value == 'undefined') throw new Error('trialEquals requires both "property" and "value" to be defined');
    return condition.value === trial.data[condition.property];
}

function inputEqualsGlobal(inputData, condition){
    if (typeof condition.property == 'undefined') throw new Error('inputEqualsGlobal requires "property" to be defined');
    return inputData.handle === global[condition.property];
}

function globalEquals(inputData, condition){
    if (typeof condition.property == 'undefined' || typeof condition.value == 'undefined') throw new Error('globalEquals requires both "property" and "value" to be defined');
    return condition.value === global[condition.property];
}

function globalEqualsTrial(inputData, condition, trial){
    if (typeof condition.globalProp == 'undefined' || typeof condition.trialProp == 'undefined') throw new Error('globalEqualsTrial requires both "globalProp" and "trialProp" to be defined');
    return global[condition.globalProp] !== trial.data[condition.trialProp];
}

function globalEqualsStim(inputData, condition, trial){
    if (typeof condition.globalProp == 'undefined' || typeof condition.stimProp == 'undefined') throw new Error('globalEqualsStim requires both "globalProp" and "stimProp" to be defined');

    // create search object
    var searchObj = {};
    if (condition.handle) searchObj['handle'] = condition.handle;
    searchObj[condition.stimProp] = global[condition.globalProp];

    // are there stimuli answering this descriptions?
    return hasData(searchObj,trial);
}

function inputEqualsCurrent(inputData, condition){
    var current = global.current;
    if (typeof condition.property == 'undefined') throw new Error('inputEqualsCurrent requires "property" to be defined');
    return inputData.handle === current[condition.property];
}
function currentEquals(inputData, condition){
    var current = global.current;
    if (typeof condition.property == 'undefined' || typeof condition.value == 'undefined') throw new Error('currentEquals requires both "property" and "value" to be defined');
    return condition.value !== current[condition.property];
}

function currentEqualsTrial(inputData, condition, trial){
    var current = global.current;
    if (typeof condition.currentProp == 'undefined' || typeof condition.trialProp == 'undefined') throw new Error('currentEqualsTrial requires both "currentProp" and "trialProp" to be defined');
    return current[condition.currentProp] === trial.data[condition.trialProp];
}

function currentEqualsStim(inputData, condition, trial){
    var current = global.current;
    if (typeof condition.currentProp == 'undefined' || typeof condition.stimProp == 'undefined') throw new Error('currentEqualsStim requires both "currentProp" and "stimProp" to be defined');

    // create search object
    var searchObj = {};
    if (condition.handle) searchObj['handle'] = condition.handle;
    searchObj[condition.stimProp] = current[condition.currentProp];

    // are there stimuli answering this descriptions?
    return hasData(searchObj, trial);
}

function fn(inputData, condition, trial){
    return condition.value.apply(trial,[condition,inputData, trial]);
}

function custom(inputData, condition, trial){
    return condition.fn.apply(null, [condition, inputData, trial]);
}

function hasData(searchObj, trial){
    return trial.stimulusCollection.stimuli.some(function(stim){
        var data = stim.data;
        for (var key in searchObj) {
            if (searchObj[key] !== data[key]) return false;
        }
        return true;
    });
}
