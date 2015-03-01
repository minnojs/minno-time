// # Touch devices
// There are several changes required for support of touch devices.
// This tutorial will show you how to fully support them in you tasks.
define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor();

	API.addSequence([
		{
			// ##### touch input
			// The input objects support a meta property: `touch`.
			// If touch is undefined then this input will always be used.
			// If it is set to true then the input will be used only in touch devices.
			// If it is set to false then the input will be used only in non touch devices.
			input: [
				// This input will be available on touch devices too (mostly, it won't be available for lack of keyboard though)
				{handle:'end', on:'space'},

				// But these will be available only on touch devices.

				// There are several touch targeted input shortcuts that you can use (they work for non touch devices too though).
				// These are `rightTouch`, `leftTouch`, `topTouch` and `bottomTouch`. </br>
				{handle:'end',on:'rightTouch', touch:true},
				{handle:'end',on:'leftTouch', touch: true}
			],

			// ##### touchMedia
			// Sometimes you want to display distinct media for touch devices.
			// For these cases, the stimulus object supports the `touchMedia` parameter
			// that accepts an alternative media object that will be displayed on touch devices instead of the regular one.
			// If a `touchMedia` parameter is not defined the regular media will be used instead.
			layout:[
				{
					location:{top:20},
					media:{word:'this will always be here'}
				},
				{
					location:{bottom:20},
					media:{word:'Only on regular'},
					touchMedia:{word:'Only on touch'}
				}
			],


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