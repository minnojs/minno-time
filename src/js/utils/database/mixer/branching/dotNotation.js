define(function(require){
    var _ = require('underscore');

    function dotNotation(chain, obj){

        if (_.isUndefined(chain)) return;
        if (_.isString(chain)) chain = chain.split('.');

        // @TODO maybe lodash _.get?
        return chain.reduce(function(result, link){

            if (_.isPlainObject(result) || _.isArray(result)){
                return result[link];
            }

            return undefined;

        }, obj);
    }

    return dotNotation;
});
