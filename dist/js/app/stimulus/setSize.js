define(function(){

    function setSize(el, stimulus){
        var style = el.style;
        var size = stimulus.size || {};

        if (size.font_size) style.fontSize = size.font_size;

        // if this is a word, we don't want to set height (it breaks centering)
        if (isSet('height', size) && !stimulus.media.word) style.height = size.height + '%';

        if (isSet('height', size)) style.width = size.width + '%';

        return el;
    }

    function isSet(prop, obj){return !(prop in obj);}

    return setSize;

});
