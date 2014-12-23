/*
 * a function that takes a media object and creates appropriate html for it
 *
 * html(media, context)
 *		takes a media object such as {word: 'Morning'} (we do our best for the object to have only one property)
 *		the context is the object used for templating
 */
define(['jquery','underscore', 'utils/preloader'],function($,_, preload){

	var html = function(media, context){

		if (media.word) {
			media.displayType = 'element';
			media.type = 'word';
			media.el = $('<div>',{text:media.word});
		}
		else if (media.image) {
			media.displayType = 'element';
			media.type = 'image';
			media.el = preload.getImage(media.image);
		}
		else if (media.jquery) {
			media.displayType = 'element';
			media.type = 'jquery';
			media.el = media.jquery;
		}
		else if (media.html) {
			media.displayType = 'element';
			media.type = 'html';
			media.el = $(_.template(media.html,context || {}));
		}
		else if (media.template) {
			// the template should be already loaded through the preloading module - we load it synchronously here.
			// see https://github.com/jrburke/requirejs/wiki/Upgrading-to-RequireJS-2.1#enforcing-async-require-
			var template = require('text!' + media.template);

			media.displayType = 'element';
			media.type = 'html';
			try {
				media.el = $(_.template(template,context || {}));
			} catch(e){
				throw new Error('Templates must be wrapped in an html element such as <span></span>. ' + media.inlineTemplate + ' is invalid');
			}
		}
		else if (media.inlineTemplate) {
			media.displayType = 'element';
			media.type = 'html';
			try {
				media.el = $(_.template(media.inlineTemplate,context || {}));
			} catch(e){
				throw new Error('Templates must be wrapped in an html element such as <span></span>. ' + media.inlineTemplate + ' is invalid');
			}
		}
		else {
			return false; // this is not a supported html type
		}
	};

	return html;

});
