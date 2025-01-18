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
                .setRequired(true) // Make it mandatory
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
                .setRequired(false) // Optional
        ),
    async execute(interaction) {
        const category = interaction.options.getString('category');
        const broadcast = interaction.options.getBoolean('broadcast') ?? false; // Default to false if blank

        try {
            await interaction.deferReply({ ephemeral: !broadcast }); // Ephemeral if broadcast is false
            const embed = await getLeaderboardData(interaction.guild, category);

            await interaction.editReply({
                embeds: [embed],
                ephemeral: !broadcast, // Show only to the user if broadcast is false
            });
        } catch (error) {
            console.error('[ERROR] Failed to execute leaderboard command:', error);
            await interaction.editReply({
                content: 'An error occurred while generating the leaderboard.',
                ephemeral: true,
            });
        }
    },
};
