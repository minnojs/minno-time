require('../nightwatch.conf.js');

module.exports = { // adapted from: https://git.io/vodU0
    'hello world': function(browser) {
		browser.url('http://localhost:9000/index.html?url=scripts/helloWorld.js', function(){
			browser
			.waitForElementPresent('.minno-stimulus')
			.assert.hidden('.minno-stimulus')
			.element('css selector', '.minno-canvas')
			.keys(browser.Keys.SPACE, function(){
				browser
				.assert.visible('.minno-stimulus')
				.assert.containsText('.minno-stimulus', 'hello world')
				.end();
			});
		})
    }
};

