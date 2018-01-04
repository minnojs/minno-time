/*
 * accepts an array of actions (or a single action)
 * and applies them
 *
 * actions = [
 *		{type:actionName,more:options},
 *		{actionName:options}
 * ]
 * @param actions: single action object or array of action objects
 * @param eventData: eventData object
 * @returns Boolean: endTrial whether this action stops further action activations
 */

import _ from 'lodash';
import actionList from './actionList';

export default applyActions;

function applyActions(actions, eventData, trial){
    // marks whether this is the final action to take
    var endTrial = false;

    actions = _.isArray(actions) ? actions : [actions];

    _.forEach(actions,function(action){
        var actionFn = actionList[action.type];
        if (!actionFn) throw new Error('unknown action: ' + action.type);

        // the only reason to halt action activation is the endTrial command
        if (action.type === 'endTrial') endTrial = true;
        actionFn(action, eventData, trial);
    });

    return endTrial;
}
