const emojiMap = process.env.DEV_MODE === 'true' 
    ? require('../data/emojiMapDev') 
    : require('../data/emojiMap');

module.exports = emojiMap;
