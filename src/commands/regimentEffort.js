const { SlashCommandBuilder } = require('discord.js');
const { fetchWarEffortTotals } = require('../handlers/mysqlHandler');
const generateRegimentEffortEmbed = require('../embedHandlers/regimentEffortEmbed.js');
const { logError } = require('../utils/logger');
const { logMode } = require('../utils/logger');
const { isDevMode } = require('../utils/envUtils');

logMode(isDevMode ? 'Development' : 'Production');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('regimenteffort')
        .setDescription('Get the current regiment effort report.'),

    async execute(interaction) {
        try {
            const totals = await fetchWarEffortTotals();
            const embed = generateRegimentEffortEmbed(totals);
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            logError(error);
            await interaction.reply({ content: 'Failed to retrieve regiment effort. Please try again later.', ephemeral: true });
        }
    }
};
