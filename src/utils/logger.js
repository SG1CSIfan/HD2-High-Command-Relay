const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
const logFilePath = path.join(logDir, 'general.log');
const errorFilePath = path.join(logDir, 'error.log');

// Ensure the logs directory and files exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}
if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '');
}
if (!fs.existsSync(errorFilePath)) {
    fs.writeFileSync(errorFilePath, '');
}

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
