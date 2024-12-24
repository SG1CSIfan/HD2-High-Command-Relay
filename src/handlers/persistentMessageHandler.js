const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const PERSISTENT_FILE = path.resolve(__dirname, '../data/persistentMessage.json');
console.log('[DEBUG] Absolute path to persistentMessage.json:', PERSISTENT_FILE);

console.log('[DEBUG] Resolved path:', PERSISTENT_FILE);

function ensurePersistentFile() {
    const dir = path.dirname(PERSISTENT_FILE);

    // Ensure the 'data' directory exists
    if (!fs.existsSync(dir)) {
        console.warn('[WARN] Data directory not found. Creating it...');
        fs.mkdirSync(dir, { recursive: true });
    }

    // Check if the file exists
    if (!fs.existsSync(PERSISTENT_FILE)) {
        console.warn('[WARN] persistentMessage.json not found. Creating it...');
        const defaultData = {
            killQuota: {
                channelId: '',
                messageId: '',
                terminidGoal: 0,
                automatonGoal: 0,
                illuminateGoal: 0,
                interval: 60
            },
            regimentEffort: {
                channelId: '',
                messageId: '',
                interval: 60
            }
        };
        fs.writeFileSync(PERSISTENT_FILE, JSON.stringify(defaultData, null, 2));
        console.log('[INFO] persistentMessage.json created with default values.');
    } else {
        console.log('[INFO] persistentMessage.json already exists. Skipping creation.');
    }
}

// Ensure the file exists on script load
ensurePersistentFile();

/**
 * Reads the persistentMessage.json file.
 */
async function readPersistentData() {
    console.log('[DEBUG] Using persistentMessage.json from:', PERSISTENT_FILE);
    try {
        const data = await fsPromises.readFile(PERSISTENT_FILE, 'utf8');
        console.log('[DEBUG] Raw JSON Data:', data);
        return JSON.parse(data);
    } catch (error) {
        console.error('[ERROR] Failed to parse persistentMessage.json:', error);
        throw error;
    }
}

/**
 * Writes data back to the persistentMessage.json file.
 */
async function writePersistentData(data) {
    await fsPromises.writeFile(PERSISTENT_FILE, JSON.stringify(data, null, 2));
}

/**
 * Saves a message ID for a specific scope.
 */
async function saveMessageId(scope, messageId) {
    const data = await readPersistentData();
    if (!data[scope]) data[scope] = {};
    data[scope].messageId = messageId;
    await writePersistentData(data);
    console.log(`[INFO] Saved message ID for ${scope}.`);
}

async function getQuotaGoals() {
    try {
        const data = JSON.parse(await fsPromises.readFile(PERSISTENT_FILE, 'utf8'));
        return data.killQuota || {};
    } catch (error) {
        console.error('[ERROR] Failed to read quota goals from persistentMessage.json:', error);
        throw error;
    }
}

module.exports = {
    saveMessageId,
    readPersistentData,
    writePersistentData,
    getQuotaGoals
};
