/* eslint-env browser */
/* global ace */
(function(){
    var win, hasError = false;
    var elements = document.querySelectorAll('[playground]') || [];
    Array.prototype.forEach.call(elements, playgroundSetup);

    var scripts = document.getElementsByTagName('script');
    var runminnoUrl = scripts[scripts.length-1].src.replace(/playground\.js$/, 'runminno.html');
    window.playgroundSetup = playgroundSetup;

    function playgroundSetup(el, mgrFn){
        var button = el.querySelector('.activate-button');
        var editor = window.e = ace.edit(el.querySelector('.editor'));

        editor.setTheme('ace/theme/solarized_light');
        editor.getSession().setMode('ace/mode/javascript');
        editor.setHighlightActiveLine(true);
        editor.setShowPrintMargin(false);
        editor.setFontSize('16px');
        editor.renderer.setShowGutter(false);
        editor.$blockScrolling = Infinity;

        button.addEventListener('click', click);
        return editor;

        function click(){
            hasError = false; // assume the feedback is success

            // clean out open window
            if (win){
                win.close();
                win = null;
            }

            win = window.open(runminnoUrl, 'Playground');

            win.onload = function(){
                win.addEventListener('unload', function() {
                    window.focus();
                    fade(el.querySelector(hasError ? '.error-message' : '.success-message'));
                });
                win.activate(mgrFn ? mgrFn() : editor.getValue());
            };
        }
    }

    window.addEventListener('error', function(e){
        console.error(e);
        hasError = true;
    });

    function fade(el){
        el.style.display = 'block';
        el.classList.add('fadeIn');
        setTimeout(function(){
            el.style.display = 'none';
            el.classList.remove('fadeIn');
        }, 6000);
    }
})();
