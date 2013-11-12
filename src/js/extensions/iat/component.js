define(function(require){

	var   _				= require('underscore')
		, API			= require('app/API')
		, properties	= require('./data/properties')
		, categories	= require('./data/categories')
		, trials		= require('./trial/trials')
		, instructions	= require('./trial/instructions')
		, stimuli		= require('./stimuli/stimuli')
		, sequence		= require('./data/sequence');


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
		setInstructions: function setInstructions(){
			instructions.apply(this, arguments);
		},
		play : function IATcomponentPlay(){
			// settings
			API.addSettings('canvas',_.defaults(properties.canvas,{
				background:properties.background,
				canvasBackground:properties.background
			}));
			API.addSettings('base_url', {image:properties.images_base_url, template:properties.templates_base_url});
			API.addSettings('logger',{pulse: properties.pulse, url : properties.post_url});
			API.addSettings('redirect',properties.next_url);

			// trials and stimuli
			API.addTrialSets(trials());
			API.addStimulusSets(stimuli());

			// sequence
			API.addSequence(sequence());

			// call the original API play
			APIplay.apply(this);
		}
	});

	return API;
});