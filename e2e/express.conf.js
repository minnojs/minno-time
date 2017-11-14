/* eslint-env node */
const express = require('express');
const path = require('path');

const server = express();

/**
 * Enable CORS and whitelist common headers
 */
server.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept'].join(',')
    );

    next();
});

server.use('/dist', express.static(path.join(__dirname, '../dist/')));
server.use('/scripts', express.static(path.join(__dirname, 'scripts')));
server.use('/', express.static(path.join(__dirname, '../example')));

/**
 * In case that the server is already running for debugging purposes
 * when the test runner starts and can't bind a new instance on port
 * 9000, it will attempt to ping this url and in the response is the
 * expected one it will run the tests
 */
server.get('/ping', (request, response) => {
    response
        .status(200)
        .header('Content-Type', 'application/json')
        .send(JSON.stringify({'pong': 'minno-time'}));
});

module.exports = server;
