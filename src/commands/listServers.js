const { SlashCommandBuilder } = require('@discordjs/builders');
const { hasPermissionForCommand } = require('../handlers/permissionHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list-servers')
        .setDescription('Lists all servers the bot is currently in.'),
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const guilds = await interaction.client.guilds.fetch(); // Fetch all guilds
            const guildList = guilds.map(
                guild => `**${guild.name}** - ID: \`${guild.id}\``
            );

            return interaction.editReply({
                content: guildList.length
                    ? `:information_source: Currently in ${guildList.length} servers:\n${guildList.join('\n')}`
                    : `:information_source: Not in any servers.`,
            });
        } catch (error) {
            console.error(`[ERROR] Failed to list servers:`, error);
            return interaction.editReply({
                content: `:x: Failed to retrieve the server list.`,
            });
        }
    },
};