define(function(require){
    var _ = require('underscore');

    templateObjProvider.$inject = ['$filter'];
    function templateObjProvider($filter){
        var filter = $filter('template');

        function templateObj(obj, context, options){
            var skip = _.get(options, 'skip', []);
            var ctx = _.assign({}, context);

            return _.cloneDeep(obj, customizer);

            function customizer(value, key, object){
                if (obj === object && _.includes(skip, key)) return value;
                if (_.isString(value) && _.includes(value, '<%')) return filter(value,ctx);
            }
        }

        return templateObj;
    }

    return templateObjProvider;
});
