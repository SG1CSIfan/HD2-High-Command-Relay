require('dotenv').config();

function isDevMode() {
    return process.env.DEV_MODE === 'true'; // Ensure DEV_MODE is strictly 'true'
}

const config = {
    isDevMode: isDevMode(),
    clientId: process.env.CLIENT_ID,
    guildId: isDevMode() ? process.env.TEST_GUILD_ID : process.env.MAIN_GUILD_ID,
    discordBotToken: process.env.DISCORD_BOT_TOKEN,
};

function getEnvironmentValue() {
    return isDevMode() ? 'Development' : 'Production';
}

module.exports = {
    isDevMode,
    clientId: config.clientId,
    guildId: config.guildId,
    discordBotToken: config.discordBotToken,
    getEnvironmentValue,
};
