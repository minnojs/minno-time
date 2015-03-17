/*
 * this file holds the trial sequence
 */
define(function(){
	var sequence;

	/**
	 * Getter/Setter for sequence
	 *
	 * @param  {Object || null} obj 	The new script, if it is not set this is simply a getter.
	 * @return {Object}     			The full script
	 */
	function getter(obj){
		obj && (sequence = obj);
		return sequence;
	}

	return getter;
});