import _ from 'lodash';
export default setSize;

function setSize(el, stimulus){
    var style = el.style;
    var size = stimulus.size || {};

    if (size.font_size) style.fontSize = size.font_size;

    // if this is a word, we don't want to set height (it breaks centering)
    if (isSet('height', size) && !isWordMedia(stimulus.media)) style.height = size.height + '%';

    if (isSet('width', size)) style.width = size.width + '%';

    return el;
}

function isSet(prop, obj){return prop in obj;}
function isWordMedia(media){ return _.isString(media) || _.isString(media.word); }
