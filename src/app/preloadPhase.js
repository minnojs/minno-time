import preload from './task/sequencer/sequencePreload';
import fastdom from 'fastdom';

export default preloadPhase;

function preloadPhase(canvas, script){
    var preloader = preload(script);

    if (preloader.progress() == 1) return Promise.resolve().then(emptyCanvas);

    canvas.innerHTML = '<div class="minno-progress"><div class="minno-progress-bar"></div></div>';

    var barStyle = canvas.getElementsByClassName('minno-progress-bar')[0].style;
    barStyle.width = preloader.progress() + '%';
    preloader.onload = function(){
        fastdom.mutate(function(){
            barStyle.width = preloader.progress()*100 + '%';
        });
    };

    return preloader.all()
        .then(emptyCanvas)['catch'](function(src){
            throw new Error('loading resource failed, do something about it! (you can start by checking the error log, you are probably reffering to the wrong url - ' + src +')');
        });

    function emptyCanvas(){
        while (canvas.firstChild) canvas.removeChild(canvas.firstChild);
    }
}

