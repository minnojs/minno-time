define(function(require){
    var fastdom = require('utils/fastdom');
    var getSize = require('utils/getSize');

    return setPlace;

    function setPlace(stimulus, canvas, el){
        return new Promise(function(resolve){
            fastdom.measure(function(){
                var canvasSize = getSize(canvas);
                var elSize = getSize(el);

                fastdom.mutate(function(){
                    var style = el.style;
                    var top, bottom, left, right; // will hold the offset for the locations

                    // get location setting and set center as default
                    var location = stimulus.location || {};
                    if (typeof location.top == 'undefined' && typeof location.bottom == 'undefined') location.top = 'center';
                    if (typeof location.left == 'undefined' && typeof location.right == 'undefined') location.right = 'center';

                    // set offsets:
                    switch (location.top){
                        case undefined :
                            /* falls through */
                        case 'auto'     : top = 'auto'; break;
                        case 'center'    : top = (canvasSize.height - elSize.height)/2 +'px'; break;
                        default            : top = (canvasSize.height * location.top)/100 +'px';
                    }

                    switch (location.bottom){
                        case undefined :
                            /* falls through */
                        case 'auto'     : bottom = 'auto'; break;
                        case 'center'    : bottom = (canvasSize.height - elSize.height)/2 +'px'; break;
                        default            : bottom = (canvasSize.height * (location.bottom))/100 +'px';
                    }

                    switch (location.left){
                        case undefined :
                            /* falls through */
                        case 'auto'     : left = 'auto'; break;
                        case 'center'    : left = (canvasSize.width - elSize.width)/2 +'px'; break;
                        default            : left = (canvasSize.width * location.left)/100 +'px';
                    }

                    switch (location.right){
                        case undefined :
                            /* falls through */
                        case 'auto'     : right = 'auto'; break;
                        case 'center'    : right = (canvasSize.width - elSize.width)/2 +'px'; break;
                        default            : right = (canvasSize.width * (location.right))/100 +'px';
                    }

                    style.top = top;
                    style.bottom = bottom;
                    style.left = left;
                    style.right = right;

                    resolve(el);
                });
            });
        });
    }
});
