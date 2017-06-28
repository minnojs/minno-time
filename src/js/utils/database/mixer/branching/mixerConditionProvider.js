define(function(require){
    var _ = require('underscore');

    mixerConditionProvider.$inject = ['mixerDotNotation', 'piConsole'];
    function mixerConditionProvider(dotNotation, piConsole){
        var operatorHash = {
            gt: forceNumeric(_.gt),
            greaterThan: forceNumeric(_.gt),
            gte: forceNumeric(_.gte),
            greaterThanOrEqual: forceNumeric(_.gte),
            equals: _.eq,
            'in': _.rearg(_.contains,1,0), // effectively reverse
            contains: _.rearg(_.contains,1,0), // effectively reverse
            exactly: exactly,
            isTruthy: isTruthy
        };

        function mixerCondition(condition, context){
            var operator = getOperator(condition);
            var left = dotNotation(condition.compare,context);
            var right = dotNotation(condition.to,context);

            piConsole(['conditions']).info('Condition: ', left, operator || 'equals', right, condition);
            if (condition.DEBUG && console) console.info('Condition: ', left, condition.operator || 'equals', right, condition); // eslint-disable-line no-console 

            return condition.negate
                ? !operator.apply(context,[left, right, context])
                : operator.apply(context,[left, right, context]);
        }

        return mixerCondition;

 
        // extract the operator function from the condition
        function getOperator(condition){
            var operator = condition.operator;
            if (_.isFunction(condition)) return condition;
            if (!_.has(condition, 'operator')) return _.has(condition,'to') ? _.eq : isTruthy;
            if (_.isFunction(operator)) return operator;
            return operatorHash[operator];
        }

        function isTruthy(left){ return !!left; }
        function exactly(left,right){ return left === right;}
        function forceNumeric(cb){ return function(left,right){ return [left,right].every(_.isNumber) ? cb(left,right) : false; }; } 

    }

    return mixerConditionProvider;
});
