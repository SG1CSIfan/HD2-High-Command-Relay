const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/general.log');
const errorFilePath = path.join(__dirname, '../logs/error.log');

function log(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, `[${timestamp}] [INFO] ${message}\n`);
}

function logError(error) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(errorFilePath, `[${timestamp}] [ERROR] ${error.stack || error}\n`);
}

function logMode(mode) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, `[${timestamp}] [MODE] Running in ${mode.toUpperCase()} mode.\n`);
    console.log(`[MODE] Running in ${mode.toUpperCase()} mode.`);
}

module.exports = { log, logError, logMode };
