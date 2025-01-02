const { isDevMode } = require('./envUtils');

let emojiMap;
let remarkRoles;

try {
    emojiMap = isDevMode()
        ? require('../data/emojiMapDev.js') // Adjust to .json or .js based on file type
        : require('../data/emojiMap.js');
} catch (error) {
    console.error('[ERROR] Failed to load emojiMap:', error);
    emojiMap = {}; // Default to an empty object
}

try {
    remarkRoles = isDevMode()
        ? require('../data/remarkRolesDev.json')
        : require('../data/remarkRoles.json');
} catch (error) {
    console.error('[ERROR] Failed to load remarkRoles:', error);
    remarkRoles = { allowedRemarkRoles: {} }; // Default to an empty object
}

module.exports = {
    ...emojiMap,
    remarkRoles: remarkRoles.allowedRemarkRoles,
};
