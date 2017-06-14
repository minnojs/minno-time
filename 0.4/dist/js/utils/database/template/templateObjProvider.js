define(function(require){
    var _ = require('underscore');

    templateObjProvider.$inject = ['templateDefaultContext'];
    function templateObjProvider(templateDefaultContext){

        function templateObj(obj, context, options){
            var skip = _.get(options, 'skip', []);
            var result = {};
            var key;
            var ctx = _.assign({}, context, templateDefaultContext);

            for (key in obj){
                result[key] = (skip.indexOf(key) == -1) ? expand(obj[key]) : obj[key];
            }

            return result;

            function expand(value){
                if (_.isString(value)) return template(value, ctx);
                if (_.isArray(value)) return value.map(expand);
                if (_.isPlainObject(value)) return _.mapValues(value, expand);
                return value;
            }

            function template(input){
                // if there is no template just return the string
                if (!~input.indexOf('<%')) return input;
                return _.template(input)(context);
            }
        }

        return templateObj;


    }


    return templateObjProvider;
});
