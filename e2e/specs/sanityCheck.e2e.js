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
    }
};

function surgeUrl(fileName){
    return `http://minno-time-e2e.surge.sh/example/?url=/e2e/scripts/${fileName}.js`;
}
