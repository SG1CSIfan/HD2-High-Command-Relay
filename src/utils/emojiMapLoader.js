const { isDevMode } = require('./envUtils');

const emojiMap = isDevMode ? require('../data/emojiMapDev') : require('../data/emojiMap');
const remarkRoles = isDevMode() ? require('../data/remarkRolesDev.json') : require('../data/remarkRoles.json');

module.exports = { ...emojiMap, remarkRoles: remarkRoles.allowedRemarkRoles };
