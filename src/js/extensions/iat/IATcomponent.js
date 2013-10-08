define(function(require){

	var   _				= require('underscore')
		, API			= require('app/API')
		, properties	= require('./properties')
		, categories	= require('./categories')
		, trials		= require('./trial/trials')
		, stimuli		= require('./stimuli/stimuli')
		, sequence		= require('./sequence');


	// cache API play so we can extend it.
	var APIplay = API.play;

	_.extend(API,{
		setProperties: function setProperties(propertiesObj){
			_.extend(properties,propertiesObj);
		},
		setCategory: function setCategory(name,categoryObj){
			var allowed_names = ['concept1','concept2', 'attribute1', 'attribute2'];
			if (_.indexOf(allowed_names,name) === -1){
				throw new Error (name + " is not a valid category name, please use one of the folowing: 'concept1','concept2', 'attribute1', 'attribute2'.");
			}

			// make sure we have a category name
			categoryObj.name || (categoryObj.name = name);
			// make sure we have a category title
			categoryObj.title || (categoryObj.title = categoryObj.name);

			// create appropriate media set
			if (!categoryObj.media || !categoryObj.media.length) {
				throw new Error ('You must supply a media list for ' + name);
			}
			API.addMediaSets(name,categoryObj.media);

			// set category
			categories[name] = categoryObj;
		},
		play : function IATcomponentPlay(){
			API.addSettings('base_url', {image:properties.images_base_url, template:properties.templates_base_url});
			API.addTrialSets(trials());
			API.addStimulusSets(stimuli());
			API.addSequence(sequence);
			APIplay.apply(this);
		}
	});

window.a = API;

	return API;
});