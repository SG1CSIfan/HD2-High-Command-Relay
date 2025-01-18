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
                .setRequired(true)
                .addChoices(
                    { name: 'Total Kills', value: 'enemyKills' },
                    { name: 'Terminid Kills', value: 'terminidKills' },
                    { name: 'Automaton Kills', value: 'automatonKills' },
                    { name: 'Illuminate Kills', value: 'illuminateKills' }
                )
        ),
    async execute(interaction) {
        const category = interaction.options.getString('category');
        try {
            await interaction.deferReply(); // Show loading indicator
            const embed = await getLeaderboardData(interaction.guild, category);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('[ERROR] Failed to execute leaderboard command:', error);
            await interaction.editReply({ content: 'An error occurred while generating the leaderboard.', ephemeral: true });
        }
    },
};
