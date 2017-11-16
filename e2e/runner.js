/* eslint-env node */
const server = require('./express.conf');
const sauceConnect = require('node-sauce-connect');
let socket;

let opts = process.argv.slice(2);
if (opts.indexOf('--config') === -1) opts = opts.concat(['--config', 'e2e/nightwatch.conf.js']);

if (opts.indexOf('--env') === -1) {
    /**
   * If no environment is provided - environment meaning a combination of OS and Browser as
   * defined in the nightwatch.conf.js file - the tests will run on all environments unless
   * one is specified
   */
    const config = require('./nightwatch.conf');
    const envs = Object.keys(config.test_settings).filter(key => key !== 'default').join(',');
    opts = opts.concat(['--env', envs]);
}

const start = () => {
    if (1 || opts.indexOf('--sauce') === -1) return runNightWatch();
    sauceConnect.start([]);
    sauceConnect.defaultInstance.stdout.on('data', connectMessage => {
        const message = connectMessage.toString();
        console.log(message);
        if (!/Sauce Connect is up, you may start your tests/.test(message)) return;
        runNightWatch();
    });

    function runNightWatch(){
        const spawn = require('cross-spawn');
        const runner = spawn('node_modules/.bin/nightwatch', opts, { stdio: 'inherit' });

        runner.on('exit', function (code) {
            sauceConnect.stop();
            socket.close();
            process.exit(code);
        });

        runner.on('error', function (err) {
            sauceConnect.stop();
            socket.close();
            throw err;
        });
    }
};

console.log('Attempting to start mocks server...');
socket = server
    .listen(9000, () => {
        console.log('Server started, running tests...');
        start();
    })
    .on('error', () => {
        console.log('Port 9000 already in use, attempting to see if it is another mocks server instance...');

        const http = require('http');

        const error = () => {
            console.log('Failed! Make sure that port 9000 is available');
        };

        http
            .get('http://127.0.0.1:9000/ping', response => {
                if (response.statusCode !== 200 || !/^application\/json/.test(response.headers['content-type'])) {
                    error();
                    response.resume();
                    return;
                }

                response.setEncoding('utf8');
                let rawData = '';
                let success = false;
                response.on('data', chunk => { rawData += chunk; });
                response.on('end', () => {
                    try {
                        let parsedData = JSON.parse(rawData);
                        if (parsedData.pong && parsedData.pong === 'minno-time') { success = true; }
                    } catch (e) {/* empty */}

                    if (success) { 
                        console.log('Mock server found, running tests!');
                        start();
                    } else error();

                });
            })
            .on('error', error);
    });
