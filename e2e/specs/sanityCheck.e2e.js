require('../nightwatch.conf.js');

module.exports = { // adapted from: https://git.io/vodU0
    'hello world': function(browser) {
        browser
            .url(surgeUrl('helloWorld'))
            .waitForElementPresent('.minno-stimulus')
            .assert.hidden('.minno-stimulus')
            .keys(browser.Keys.SPACE) // chrome, edge
            .setValue('.minno-canvas', browser.Keys.SPACE) // FF
            .waitForElementVisible('.minno-stimulus')
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
                browser.assert.ok(Math.abs(value.right - value.left) < 0.1, 's1 centered x');
                browser.assert.ok(Math.abs(value.bottom - value.top) < 0.1, 's1 centered y');
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
                browser.assert.ok(Math.abs(value.right - value.left) < 0.1, 's2 centered x');
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
                browser.assert.ok(Math.abs(value.bottom - value.top) < 0.1, 's3 centered y');
            })
            .end();
    }
};

function surgeUrl(fileName){
    return `http://minno-time-e2e.surge.sh/example/?url=/e2e/scripts/${fileName}.js`;
}
