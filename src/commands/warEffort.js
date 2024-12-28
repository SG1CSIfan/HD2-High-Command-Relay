const { SlashCommandBuilder } = require('discord.js');
const { generateWarEffortEmbed } = require('../embedHandlers/warEffortEmbed');
const { loadConfig, saveConfig } = require('../handlers/configHandler');
const { fetchWarEffortTotals } = require('../handlers/warEffortHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wareffort')
        .setDescription('Get a one-time report of the current war effort.'),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            // Fetch totals and generate embed
            const totals = await fetchWarEffortTotals();
            const embed = generateWarEffortEmbed(totals);

            // Reply with the embed
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('[ERROR] Failed to execute wareffort command:', error);
            await interaction.editReply({
                content: 'An error occurred while generating the war effort report.',
                ephemeral: true,
            });
        }
    },

    async updateWarEffortMessage(client) {
        const config = await loadConfig();
        const warEffortConfig = config.warEffort;

        if (!warEffortConfig || !warEffortConfig.channelId) {
            console.error('[ERROR] War Effort channel ID is not configured.');
            return;
        }

        try {
            const channel = await client.channels.fetch(warEffortConfig.channelId);
            const totals = await fetchWarEffortTotals();
            const embed = generateWarEffortEmbed(totals);

            if (warEffortConfig.messageId) {
                const message = await channel.messages.fetch(warEffortConfig.messageId);
                await message.edit({ embeds: [embed] });
                console.log('[INFO] War Effort message updated.');
            } else {
                const newMessage = await channel.send({ embeds: [embed] });
                warEffortConfig.messageId = newMessage.id;
                await saveConfig(config);
                console.log('[INFO] New War Effort message posted.');
            }
        } catch (error) {
            console.error('[ERROR] Failed to update War Effort message:', error);
        }
    },

    scheduleWarEffortUpdate(client) {
        loadConfig().then((config) => {
            const warEffortConfig = config.warEffort;
            if (!warEffortConfig) return;

            const interval = (warEffortConfig.updateInterval || 600) * 1000;
            setInterval(() => this.updateWarEffortMessage(client), interval);
        });
    },
};
