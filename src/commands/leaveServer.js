const { SlashCommandBuilder } = require('@discordjs/builders');
const { hasPermissionForCommand } = require('../handlers/permissionHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave-server')
        .setDescription('Leave the specified server, admin-only command.')
        .addStringOption(option =>
            option
                .setName('guildid')
                .setDescription('ID of the guild to leave.')
                .setRequired(true)
        ),
    async execute(interaction) {
        // Check if the user has the appropriate role
        if (!hasPermissionForCommand(interaction.member, 'leave_server')) {
            return interaction.reply({
                content: `:x: You do not have permission to use this command.`,
                ephemeral: true,
            });
        }

        const guildID = interaction.options.getString('guildid');
        if (!guildID) {
            return interaction.reply({
                content: `:x: Must specify guild ID.`,
                ephemeral: true,
            });
        }

        try {
            const guild = await interaction.client.guilds.fetch(guildID);
            if (!guild) {
                return interaction.reply({
                    content: `:x: No guild found with ID ${guildID}.`,
                    ephemeral: true,
                });
            }

            await guild.leave();
            return interaction.reply({
                content: `:white_check_mark: Successfully left guild with ID ${guild.id}.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(`[ERROR] Failed to leave guild:`, error);
            return interaction.reply({
                content: `:x: Failed to leave the guild. Please try again later.`,
                ephemeral: true,
            });
        }
    },
};
