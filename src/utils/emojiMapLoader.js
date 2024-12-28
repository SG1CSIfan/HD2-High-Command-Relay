const { isDevMode } = require('./envUtils');
const emojiMap = isDevMode ? require('../data/emojiMapDev') : require('../data/emojiMap');

module.exports = emojiMap;
