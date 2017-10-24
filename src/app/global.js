import _ from 'lodash';
export default global;

// initiate piGloabl
var glob = window.piGlobal || (window.piGlobal = {});

/**
 * getter setter for the global object
 * @param  {Object} obj     The object to add to the global
 * @param  {Bool} 	replace A new object to fully replace the old global
 * @return {Object}         The full global
 */
function global(obj, replace){

    if (replace) {
        glob = obj;
        return glob;
    }

    if (_.isPlainObject(obj)){
        _.each(function(value, key){
            /* eslint-disable no-console */
            console.warn && global[key] && console.warn('Overwriting "' + key  + '" in global object.');
            /* eslint-enable no-console */
        });
        _.merge(glob, obj);
    }

    return glob;
}

