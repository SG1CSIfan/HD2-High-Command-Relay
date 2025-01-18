const { SlashCommandBuilder } = require('@discordjs/builders');
const { getLeaderboardData } = require('../handlers/leaderboardHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('View the top players.')
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('Choose a leaderboard category.')
                .setRequired(true) // Mandatory field
                .addChoices(
                    { name: 'Total Kills', value: 'enemyKills' },
                    { name: 'Terminid Kills', value: 'terminidKills' },
                    { name: 'Automaton Kills', value: 'automatonKills' },
                    { name: 'Illuminate Kills', value: 'illuminateKills' }
                )
        )
        .addBooleanOption(option =>
            option
                .setName('broadcast')
                .setDescription('Make the leaderboard visible to everyone or only to you (optional).')
                .setRequired(false) // Optional field
        ),
    async execute(interaction) {
        const category = interaction.options.getString('category');
        const broadcast = interaction.options.getBoolean('broadcast') ?? false; // Default to false if not provided

        try {
            // Use deferReply with the ephemeral option based on broadcast
            await interaction.deferReply({ ephemeral: !broadcast });

            // Get leaderboard embed
            const embed = await getLeaderboardData(interaction.guild, category, interaction.user.id);

            // Send the leaderboard response
            await interaction.editReply({
                embeds: [embed],
                ephemeral: !broadcast, // Ephemeral response based on broadcast
            });
        } catch (error) {
            console.error('[ERROR] Failed to execute leaderboard command:', error);

            // Error response
            await interaction.editReply({
                content: 'An error occurred while generating the leaderboard. Please try again later.',
                ephemeral: true,
            });
        }
    },
};
