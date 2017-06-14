// # Settings
// This tutorial will show you how to use the API in order to set the global settings for the miTime. </br>
// The `API.addSettings()` function takes two arguments; the first is the property we want to affect (i.e. canvas), and the second is the settings object we want to set in it.
// Adding setting is accumulative. this means that adding a specific setting twice merges it in, and does not reset it to its defaults. </br>
// The basic structure of the add settings object is as follows:

//			API.addSettings('settingName',{
//				// some settings
//			});
define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor();


	// ### canvas
	// The canvas setting controls the general look that the player takes
	/* canvas */
	// ##### controling shape
	API.addSettings('canvas',{

		// `maxWidth` the maximum width (in pixels) that the canvas may reach. By default it is set to 500px.
		maxWidth: 800,
		// `proportions` controls the shape of the canvas (as height/width). By default it is set to 0.8.
		proportions : 0.8

		// ##### controling design
		,
		// `background` controls the background color of the whole screen
		background: 'violet',
		// `canvasBackground` controls the background color of the player canvas
		canvasBackground: 'lightblue',
		// `borderWidth` controls the width of the player canvas borders in pixels
		borderWidth: 4,
		// `borderColor` controls the color of the player canvas borders
		borderColor: 'black',
		// `css` allows you to add your custom css to the canvas element (using the jQuery css API).
		// This is an advanced way to affect the way your task looks globaly.
		css: {
			color:'tomato'
		}
	});

	// ### Logger
	// The logger section is responsible for logging options. </br>
	// See documentation if you want to add a custom logger function to replace the default logging action of the player.
	/* Logger */
	// `url` is the url to which we send the logged data (ask your IT team what it should be). You should set this if you want to log your data...
	API.addSettings('logger',{
		url: 'my.domain.org/controler.php',
		// `pulse` the maximum size of each data pulse to the server (see documentation for more details).
		// In this case we post to the server every 20 logs.
		pulse: 20,
		// `fullpath` when logging media names should we use the full path, or just the name (false by default)
		fullpath: false
	});

	// ### Base url
	// The base url section is responsible for loading images and templates. it allows the user to pick a base url from which to load all images and templates. </br>
	/* base url */
	// You can input a single url for use for both images and template.
	API.addSettings('base_url','media');
	// Or an object with seperate paths for templates and images.
	API.addSettings('base_url',{
		// `image`: the path to your images
		image: 'media/images',
		// `template`: the path to your templates
		template: 'media/templates'
	});

	// ### Redirect
	/* Redirect */
	// The redirect setting decides where to redirect the player at the end of the task.
	// By default, the player simply refreshes the current page.
	// This option is not used if the endTask hook is set.
	API.addSettings('redirect','my.domain.org/next/');

	// ### Meta data
	/* Meta data */
	// Meta data is server side data that should be returned with every request to the server.
	// Any key value pair in the meta data is added to every post the player makes to the server.
	// In order to create a post with three keys: json, session_id and task_id - you would write something like this:
	API.addSettings('metaData', {
		session_id	: 9872356,
		task_id		: '43BTW78'
	});

	// ### sequence
	API.addSequence([
		{
			input: [{handle:'end', on:'space'}],
			layout:[{media:{word:'Just a plain trial to show what we can do with settings'}}],
			interactions: [
				{
					conditions: [{type:'inputEquals',value:'end'}],
					actions: [{type:'endTrial'}]
				}
			]
		}
	]);

	return API.script;
});