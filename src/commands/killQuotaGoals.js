const { SlashCommandBuilder } = require('discord.js');
const { saveQuotaGoals, saveMessageId } = require('../handlers/persistentMessageHandler');
const { fetchKillStats } = require('../handlers/mysqlHandler');
const generateKillQuotaGoalsEmbed = require('../embedHandlers/killQuotaGoalsEmbed');
const { logError } = require('../utils/logger');
const { logMode } = require('../utils/logger');
const { isDevMode } = require('../utils/envUtils');

logMode(isDevMode ? 'Development' : 'Production');

const KILL_QUOTA_SCOPE = 'killQuota';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('killquotagoals')
        .setDescription('Set kill quotas and track progress.')
        .addIntegerOption(option =>
            option.setName('terminidgoal').setDescription('Set Terminid goal').setRequired(true))
        .addIntegerOption(option =>
            option.setName('automatongoal').setDescription('Set Automaton goal').setRequired(true))
        .addIntegerOption(option =>
            option.setName('illuminategoal').setDescription('Set Illuminate goal').setRequired(true)),

    async execute(interaction) {
        try {
            // Retrieve input values
            const terminidGoal = interaction.options.getInteger('terminidgoal');
            const automatonGoal = interaction.options.getInteger('automatongoal');
            const illuminateGoal = interaction.options.getInteger('illuminategoal');

            // Validate input
            if (terminidGoal <= 0 || automatonGoal <= 0 || illuminateGoal <= 0) {
                return interaction.reply({
                    content: 'All goals must be positive integers greater than zero.',
                    ephemeral: true,
                });
            }

            // Save goals
            await saveQuotaGoals(terminidGoal, automatonGoal, illuminateGoal);
            console.log(`[INFO] Kill quotas set - Terminid: ${terminidGoal}, Automaton: ${automatonGoal}, Illuminate: ${illuminateGoal}`);

            // Fetch current stats
            const totals = await fetchKillStats();
            console.log('[DEBUG] Current Kill Stats:', totals);

            // Generate embed
            let embed;
            try {
                console.log('[DEBUG] Goals:', { terminidGoal, automatonGoal, illuminateGoal });
                embed = generateKillQuotaGoalsEmbed(totals, { terminidGoal, automatonGoal, illuminateGoal });
            } catch (embedError) {
                console.error('[ERROR] Failed to generate embed:', embedError);
                return interaction.reply({
                    content: 'An error occurred while generating the embed. Please try again later.',
                    ephemeral: true,
                });
            }

            // Send the embed and save message ID
            const message = await interaction.reply({ embeds: [embed], fetchReply: true });
            await saveMessageId(KILL_QUOTA_SCOPE, message.id);
            console.log('[INFO] Kill Quota embed successfully sent.');

        } catch (error) {
            console.error('[ERROR] Failed to set Kill Quotas:', error);
            logError(error);
            await interaction.reply({
                content: 'An internal error occurred while setting kill quotas. Please try again later.',
                ephemeral: true,
            });
        }
    }
};
