const { SlashCommandBuilder } = require('discord.js');
const { isDevMode } = require('../../src/utils/envUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Fetches the server status'),
    async execute(interaction) {
        if (isDevMode) {
            // Simulate fetching from the main server but posting to the test server
            await interaction.reply('Fetching status from the main server in Dev Mode...');
        } else {
            await interaction.reply('Fetching status from the main server in Production Mode...');
        }
    },
};
