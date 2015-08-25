/*
 * a function that takes a media object and creates appropriate html for it
 *
 * html(media, context)
 *		takes a media object such as {word: 'Morning'} (we do our best for the object to have only one property)
 *		the context is the object used for templating
 */
define(function(require) {
	var $ = require('jquery')
		,  preload = require('utils/preloader');

	function html(media){
		// all templateing is done within the inflate trial function and the sequencer
		var template = media.html || media.inlineTemplate || media.template; // give inline template precedence over template, because tempaltes are loaded into inlinetemplate
		var el;

		if (media.word) {
			el = $('<div>',{text:media.word});
		}
		else if (media.image) {
			el = $(preload.getImage(media.image));
		}
		else if (media.jquery) {
			el = media.jquery;
		}
		else if (template) { // html | template | inlineTemplate
			try {
				el = $(template);
			} catch (e) {
				throw new Error('HTML must be wrapped in an html element such as <span></span>. ' + template + ' is invalid');
			}
		} else {
			throw new Error('this is not a supported html type');
		}

		// We can get errors where the element is a text node (#3) because jquery is not set to deal with them
		// this is a bit of a hack, and should probably move to the html.js provider
		if (el[0].nodeType !== Node.ELEMENT_NODE){
			throw new Error('Media element must be an ELEMENT_NODE (#1) but was: "#' +  el[0].nodeType + '" instead. You should not pass <html> elements as media.');
		}

		return el;
	}

	return html;

});
