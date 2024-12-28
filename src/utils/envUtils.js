require('dotenv').config();

function isDevMode() {
    return process.env.DEV_MODE === 'true';
}

const config = {
    isDevMode: isDevMode(),
    clientId: process.env.CLIENT_ID,
    guildId: isDevMode() ? process.env.TEST_Guild_ID : process.env.MAIN_Guild_ID,
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
