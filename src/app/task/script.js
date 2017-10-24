/*
 * this file holds the script we are to run
 */

export default script;

var scriptObj = {};

/**
 * Getter/Setter fo script
 *
 * @param  {Object || null} obj 	The new script, if it is not set this is simply a getter.
 * @return {Object}     			The full script
 */
function script(obj){
    obj && (scriptObj = obj);
    return scriptObj;
}
