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
		else if (template) { // html | template | inlineTemplate
			media.displayType = 'element';
			media.type = 'html';
			try {
				media.el = $(template);
			} catch (e) {
				throw new Error('HTML must be wrapped in an html element such as <span></span>. ' + template + ' is invalid');
			}
		} else {
			return false; // this is not a supported html type
		}
	}

	return html;

});

dom = stream.merge([
    resize: document.addEventListener('resize', stream());
    events: stream|eventEmitter => {type:'click', name:'rightClick', payload:{}} // payload includes any info that actions/conditions need
]);
function(sources){return sink;}


stimState = {
    $show: false,
    id:uniqueId},
    stimulus)


const stimuli = trial.stimulus.map(stimToState).map(stream);
const $stimuli = stream.merge(stimuli); // a stream of stream, will be updated with every change of stim state

const sink = {$stimuli, $messages, $trial}

function stimToState(stim){
    return Object.assign({
        $show:false,
        id: uniqueId(),
    }, stim);
}



const stimulus = {
    $show:false,

    init(){
        this.$view = $state.map(stimView);
    },
    view(){return this.$view();}
}

function stimView({type}){
    switch (type){
        case 'image': return m('image', {src:content});
        case 'word': return m('span', content);
        case 'mithril': return content;
    }
}









