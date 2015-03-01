/*
 * inflates a trial/stimulus/media
 * this function is responsible for inheritance from the sets
 *
 * function inflate(source,type)
 * where source is the script for a component, and type is the type of component (trial/stimulus/media)
 *
 * the function returns an inflated script object (to be parsed by the constuctors)
 */
define(['jquery','./trial/trial_sets','./stimulus/stimulus_sets','./media/media_sets', './global'],function($,trialSets,stimulusSets,mediaSets, global){

	var customize = function customize(source){
		// check for a custom function and run it if it exists
		if (typeof source.customize === 'function'){
			source.customize.apply(source, [source, global()]);
			// remove customize function so that it gets called only once (don't delete because - performance)
			//source.customize = null;
		}
		return source;
	};

	// @param source - object to inflate
	// @param type - trial stimulus or media
	// @param recursive - whether this is a recursive call or not
	var inflate = function(source,type, recursive){

		var sets
			, inherit
			, parent
			, child;

		switch (type) {
			case 'trial': sets = trialSets(); break;
			case 'stimulus': sets = stimulusSets(); break;
			case 'media': sets = mediaSets(); break;
			default:
				throw new Error('Unknown set type ' + type);
		}

		// if we do not need to inherit anything, simply return source
		if (!source.inherit) {
			!recursive && customize(source);
			return source;
		}

		//if the inherit object is not an abject then it is probably a string and refers to a vanila set
		inherit = $.isPlainObject(source.inherit) ? source.inherit : {set:source.inherit};

		// make sure we know the set we're inheriting from
		if (!sets[inherit.set]) {
			throw new Error('Unknown '+ type +'Set: ' + inherit.set);
		}

		// get parent (recursively)
		parent = inflate(sets[inherit.set].inherit(inherit),type, true);

		// create inflated child
		child = $.extend(true,{},source);

		$.each(parent, function(key, value){
			// if this key is not set yet, copy it out of the parent (choose the copy method according to the type of data)
			if (!child[key]){
				// arrays
				if ($.isArray(parent[key])){
					child[key] = $.extend(true, [], value);
				}
				// objects
				else if (typeof parent[key] === 'object'){
					child[key] = $.extend(true, {}, value);
				}
				// primitives
				else {
					child[key] = value;
				}
			}
		});

		// we want to extend the childs data even if it already exists
		if (parent.data){
			child.data = $.extend(true, {}, parent.data, child.data);
		}

		// Personal customization functions - only if this is the last iteration of inflate
		// This way the customize function gets called only once.
		!recursive && customize(child);

		// return inflated trial
		return child;
	};

	return inflate;
});