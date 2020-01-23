/*
 * gets a condition array (or a single condition) and evaluates it
 * returns true if all statements are true, false otherwise
 *
 * a single condition looks like this:
 *
 *	condition = {
 *		type : 'begin/inputEquals/inputEqualsTrial/inputEqualsStim/function',
 *		value: 'right/trialAttribute/stimAttribute/customFunction',
 *		handle: 'stim handle' (optional in case we're targeting a stimulus)
 *	}
 *
 */

import getConditionFn from './getConditionFn';

export default conditionsEvaluate;

function conditionsEvaluate(conditions, inputData, trial){
    // make sure conditions is an array
    conditions = Array.isArray(conditions) ? conditions : [conditions];

    // do not activate empty condition arrays
    if (!conditions.length) return false;

    // if this is a begin event, make sure we only run interactions that have begin in them
    if (inputData.type == 'begin' && conditions.every(function(condition){return condition.type != 'begin';})) return false;

    return conditions.every(checkCondition);


    function checkCondition(condition){
        var value = getConditionFn(condition)(inputData, condition, trial);
        return condition.negate ? !value : value;
    }
}
