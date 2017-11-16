require('../nightwatch.conf.js');

module.exports = { // adapted from: https://git.io/vodU0
    'hello world': function(browser) {
        browser
            .url(surgeUrl('helloWorld'))
            .waitForElementPresent('.minno-stimulus')
            .assert.hidden('.minno-stimulus')
            .keys(browser.Keys.SPACE)
            .assert.visible('.minno-stimulus')
            .assert.containsText('.minno-stimulus', 'hello world')
            .end();
    },
    'center': function(browser){
        browser
            .url(surgeUrl('center'))
            .waitForElementPresent('.minno-stimulus')

            // both centered
            .execute(function(){
                var canvas = document.getElementsByClassName('minno-canvas')[0].getBoundingClientRect();
                var el = document.getElementsByClassName('minno-stimulus')[0].getBoundingClientRect();

                return {
                    left: el.left - canvas.left,
                    right: canvas.right - el.right,
                    top:  el.top - canvas.top,
                    bottom: canvas.bottom - el.bottom
                };
            }, [], function(deltas){
                const value = deltas.value;
                browser.assert.equal(value.right, value.left, 's1 centered x');
                browser.assert.equal(value.bottom, value.top, 's1 centered y');
            })

            // x centered
            .execute(function(){
                var canvas = document.getElementsByClassName('minno-canvas')[0].getBoundingClientRect();
                var el = document.getElementsByClassName('minno-stimulus')[1].getBoundingClientRect();

                return {
                    left: el.left - canvas.left,
                    right: canvas.right - el.right,
                    top:  el.top - canvas.top,
                    bottom: canvas.bottom - el.bottom
                };
            }, [], function(deltas){
                const value = deltas.value;
                browser.assert.equal(value.right, value.left, 's2 centered x');
                browser.assert.ok(value.bottom > value.top, 's2 not centered y');
            })

            // y centered
            .execute(function(){
                var canvas = document.getElementsByClassName('minno-canvas')[0].getBoundingClientRect();
                var el = document.getElementsByClassName('minno-stimulus')[2].getBoundingClientRect();

                return {
                    left: el.left - canvas.left,
                    right: canvas.right - el.right,
                    top:  el.top - canvas.top,
                    bottom: canvas.bottom - el.bottom
                };
            }, [], function(deltas){
                const value = deltas.value;
                browser.assert.ok(value.right < value.left, 's3 not centered x');
                browser.assert.equal(value.bottom, value.top, 's3 centered y');
            })
            .end();
    }
};

function surgeUrl(fileName){
    return `http://minno-time-e2e.surge.sh/example/?url=/e2e/scripts/${fileName}.js`;
}
