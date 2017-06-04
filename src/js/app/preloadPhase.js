define(function(require){

    var preload = require('./sequencer/sequencePreload');

    return preloadPhase;

    function preloadPhase(canvas, script){
        var preloader = preload(script);

        if (preloader.progress() == 1) return Promise.resolve().then(emptyCanvas);

        canvas.innerHTML = [
            '<div class="meter-wrapper">',
            '   <div class="meter">',
            '       <span style="width: 0%"></span>',
            '   </div>',
            '</div>'
        ].join('');

        var barStyle = canvas.getElementsByTagName('span')[0].style;
        barStyle.width = preloader.progress() + '%';
        preloader.onload = function(){barStyle.width = preloader.progress()*100 + '%';};

        return preloader.all()
            .then(emptyCanvas)
            .catch(function(src){
                throw new Error('loading resource failed, do something about it! (you can start by checking the error log, you are probably reffering to the wrong url - ' + src +')');
            });

        function emptyCanvas(){
            while (canvas.firstChild) canvas.removeChild(canvas.firstChild);
        }
    }

});
