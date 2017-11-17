/* eslint-env node */
const SauceLabs = require('saucelabs');

const TRAVIS_JOB_NUMBER = process.env.TRAVIS_JOB_NUMBER
const SAUCE_USERNAME = process.env.SAUCE_USERNAME
const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY

const SCREENSHOT_PATH = './screenshots/';
const BINPATH = './node_modules/nightwatch/bin/';
const IS_SAUCE = process.argv.slice(2).indexOf('--sauce') !== -1;

const localSettings = {
    default: {
        'screenshots': {
            'enabled': false, // if you want to keep screenshots
            'path': './screenshots' // save screenshots here
        },
        'globals': {
            'waitForConditionTimeout': 5000 // sometimes internet is slow so wait.
        },
        'desiredCapabilities': { // use Chrome as the default browser for tests
            'browserName': 'chrome'
        }
    },
    chrome: {
        'desiredCapabilities': {
            'browserName': 'chrome',
            'javascriptEnabled': true // turn off to test progressive enhancement
        }
    }
};

const sauceSettings = {
    default: {
        launch_url: 'http://ondemand.saucelabs.com:80',
        selenium_port: 80,
        selenium_host: 'ondemand.saucelabs.com',
        silent: true,
        port: 4445,
        username: SAUCE_USERNAME,
        access_key: SAUCE_ACCESS_KEY,
        desiredCapabilities: {
            build: 'build-' + TRAVIS_JOB_NUMBER,
            'tunnel-identifier': TRAVIS_JOB_NUMBER
        },
        'globals': {
            afterEach:afterEach,
            'waitForConditionTimeout': 10000 // sometimes internet is slow so wait.
        },
    },
    chrome: {
        'desiredCapabilities': {
            'browserName': 'chrome',
            'javascriptEnabled': true // turn off to test progressive enhancement
        }
    },

/*
    ie11: {
        integration: true,
        desiredCapabilities: {
            browserName: 'internet explorer',
            platform: 'Windows 10',
            version: '11.103',
            javascriptEnabled: true,
            acceptSslCerts: true
        }
    },
    firefox56: {
        integration: true,
        'seleniumVersion' : '3.5.0'
        desiredCapabilities: {
            browserName: 'firefox',
            platform: 'Windows 10',
            version: '56.0',
            javascriptEnabled: true,
            acceptSslCerts: true
        }
    },
    safari10: {
        integration: true,
        desiredCapabilities: {
            browserName: 'safari',
            platform: 'OS X 10.11',
            version: '10.0',
            javascriptEnabled: true,
            acceptSslCerts: true
        }
    }
    */
};

// we use a nightwatch.conf.js file so we can include comments and helper functions
module.exports = {
    'src_folders': [
        'e2e/specs'// Where you are storing your Nightwatch e2e tests
    ],
    filter: '**/*.e2e.js',
    'output_folder': './reports', // reports (test outcome) output by nightwatch
    'selenium': { // downloaded by selenium-download module (see readme)
        'start_process': true, // tells nightwatch to start/stop the selenium process
        'server_path': './node_modules/nightwatch/bin/selenium.jar',
        'host': '127.0.0.1',
        'port': 4444, // standard selenium port
        'cli_args': { // chromedriver is downloaded by selenium-download (see readme)
            'webdriver.chrome.driver' : './node_modules/nightwatch/bin/chromedriver'
        }
    },
    test_settings: IS_SAUCE ? sauceSettings : localSettings
};

/**
 * selenium-download does exactly what it's name suggests;
 * downloads (or updates) the version of Selenium (& chromedriver)
 * on your localhost where it will be used by Nightwatch.
 /the following code checks for the existence of `selenium.jar` before trying to run our tests.
 */

require('fs').stat(BINPATH + 'selenium.jar', function (err, stat) { // got it?
    if (err || !stat || stat.size < 1) {
        require('selenium-download').ensure(BINPATH, function(error) {
            if (error) throw new Error(error); // no point continuing so exit!
            console.log('✔ Selenium & Chromedriver downloaded to:', BINPATH);
        });
    }
});

function padLeft (count) { // theregister.co.uk/2016/03/23/npm_left_pad_chaos/
    return count < 10 ? '0' + count : count.toString();
}

var FILECOUNT = 0; // "global" screenshot file count
/**
 * The default is to save screenshots to the root of your project even though
 * there is a screenshots path in the config object above! ... so we need a
 * function that returns the correct path for storing our screenshots.
 * While we're at it, we are adding some meta-data to the filename, specifically
 * the Platform/Browser where the test was run and the test (file) name.
 */
function imgpath (browser) {
    var a = browser.options.desiredCapabilities;
    var meta = [a.platform];
    meta.push(a.browserName ? a.browserName : 'any');
    meta.push(a.version ? a.version : 'any');
    meta.push(a.name); // this is the test filename so always exists.
    var metadata = meta.join('~').toLowerCase().replace(/ /g, '');
    return SCREENSHOT_PATH + metadata + '_' + padLeft(FILECOUNT++) + '_';
}

module.exports.imgpath = imgpath;
module.exports.SCREENSHOT_PATH = SCREENSHOT_PATH;


/**
 * execute a callback after each test, informing Saucelabs
 * whether the test has passed or not, to be able to generate
 * the browser compatibility matrix
 *
 * Expected env variables:
 *   SAUCE_USERNAME
 *   SAUCE_ACCESS_KEY
 */
function afterEach(client, done) {
    const saucelabs = new SauceLabs({
        username: process.env.SAUCE_USERNAME,
        password: process.env.SAUCE_ACCESS_KEY
    })

    const title = client.currentTest.name
    const sessionId = client.capabilities['webdriver.remote.sessionid']
    const passed = client.currentTest.results.failed === 0 && client.currentTest.results.errors === 0

    saucelabs.updateJob(sessionId, {
        title: title,
        passed: passed
    }, done)
}
