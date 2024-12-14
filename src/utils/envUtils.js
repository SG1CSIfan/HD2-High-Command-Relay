require('dotenv').config();

const isDevMode = process.env.DEV_MODE === 'true';
const TEST_GUILD_ID = process.env.TEST_GUILD_ID;
const MAIN_GUILD_ID = process.env.MAIN_GUILD_ID;

module.exports = {
    isDevMode,
    getGuildId() {
        return isDevMode ? TEST_GUILD_ID : MAIN_GUILD_ID;
    },
    logMode() {
        console.log(`Bot is running in ${isDevMode ? 'Development' : 'Production'} Mode`);
    },
};
