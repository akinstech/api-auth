'use strict';
const os = require('os');
const path = require('path');

const express = require('express');
const app = express();

// Setup our globals
global.AppRoot = path.resolve(__dirname);
global.App = require('./app/lib/global');

const log = global.App.require('lib/log');
const Auth = global.App.require('lib/auth');

const args = process.argv;

if (args[2]) {
    global.App.name = args[2];
}

if (args[3]) {
    global.App.port = args[3];
} else {
    global.App.port = process.env.PORT;
}

log.debug('Logging facilities online.');
log.info(`${global.App.longName} (${global.App.name}) [Build ${global.App.build}] Started.`);

// Your code goes here:
//
//


// Import Route Definisitons
const rootRouter = global.App.require('routes/root');
const userRouter = global.App.require('routes/user');

app.use(express.json());

app.use('/', rootRouter);
// app.use('/user', userRouter);

log.info(`API listening on port ${global.App.port}`);
app.listen(global.App.port);

// End of Code
