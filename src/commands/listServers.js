const { SlashCommandBuilder } = require('@discordjs/builders');
const { hasPermissionForCommand } = require('../handlers/permissionHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list-servers')
        .setDescription('Lists all servers the bot is currently in.'),
    async execute(interaction) {
        // Check if the user has the appropriate role
        if (!hasPermissionForCommand(interaction.member, 'list_servers')) {
            return interaction.reply({
                content: `:x: You do not have permission to use this command.`,
                ephemeral: true,
            });
        }

        try {
            const guilds = interaction.client.guilds.cache.map(
                guild => `**${guild.name}** - ID: \`${guild.id}\``
            );

            return interaction.reply({
                content: guilds.length
                    ? `:information_source: Currently in ${guilds.length} servers:\n${guilds.join('\n')}`
                    : `:information_source: Not in any servers.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(`[ERROR] Failed to list servers:`, error);
            return interaction.reply({
                content: `:x: Failed to retrieve the server list.`,
                ephemeral: true,
            });
        }
    },
};
