const { SlashCommandBuilder } = require('discord.js');
const { saveQuotaGoals, getMessageId, saveMessageId } = require('../handlers/persistentMessageHandler');
const { fetchKillStats } = require('../handlers/mysqlHandler');
const { generateKillQuotaGoalsEmbed } = require('../embedHandlers/killQuotaGoalsEmbed');
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
            const embed = await generateKillQuotaGoalsEmbed(totals, { terminidGoal, automatonGoal, illuminateGoal }, interaction.channel);

            // Check for existing embed
            const channel = interaction.channel;
            const existingMessageId = await getMessageId(KILL_QUOTA_SCOPE);

            if (existingMessageId) {
                try {
                    // Fetch and update existing embed
                    const message = await channel.messages.fetch(existingMessageId);
                    await message.edit({ embeds: [embed] });
                    console.log('[INFO] Existing Kill Quota embed updated.');
                } catch (error) {
                    console.warn('[WARN] Existing Kill Quota embed not found or cannot be updated. Creating a new one.');
                    // If the message fetch fails, post a new embed
                    const newMessage = await channel.send({ embeds: [embed] });
                    await saveMessageId(KILL_QUOTA_SCOPE, newMessage.id);
                    console.log('[INFO] New Kill Quota embed posted.');
                }
            } else {
                // If no existing message ID, create a new embed
                const newMessage = await channel.send({ embeds: [embed] });
                await saveMessageId(KILL_QUOTA_SCOPE, newMessage.id);
                console.log('[INFO] New Kill Quota embed posted.');
            }

            await interaction.reply({ content: 'Kill quotas have been set and the embed has been updated.', ephemeral: true });
        } catch (error) {
            console.error('[ERROR] Failed to set Kill Quotas:', error);
            logError(error);
            if (!interaction.replied) {
                await interaction.reply({
                    content: 'An internal error occurred while setting kill quotas. Please try again later.',
                    ephemeral: true,
                });
            } else {
                await interaction.followUp({
                    content: 'An internal error occurred. Please try again later.',
                    ephemeral: true,
                });
            }
        }
    }
};
