const fs = require('fs/promises');
const path = require('path');

const CONFIG_FILE_PATH = path.join(__dirname, '../data/botConfig.json');

async function loadConfig() {
    try {
        const data = await fs.readFile(CONFIG_FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('[ERROR] Failed to load bot configuration:', error);
        return {};
    }
}

async function saveConfig(config) {
    try {
        await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(config, null, 2));
        console.log('[INFO] Bot configuration saved successfully.');
    } catch (error) {
        console.error('[ERROR] Failed to save bot configuration:', error);
    }
}

module.exports = { loadConfig, saveConfig };
