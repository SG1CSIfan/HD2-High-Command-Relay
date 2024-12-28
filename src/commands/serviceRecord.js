const { SlashCommandBuilder } = require('@discordjs/builders');
const { fetchUserStats } = require('../handlers/mysqlHandler');
const { generateServiceRecordEmbed } = require('../embedHandlers/serviceRecordEmbed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('helldiver_service_record')
        .setDescription('View your service record or another user\'s record.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to view the record for.')
                .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply();
        
        const targetUser = interaction.options.getUser('target') || interaction.user;

        try {
            // Fetch user stats from the database
            const userStats = await fetchUserStats(targetUser.id);

            if (!userStats) {
                return interaction.editReply(`No service record found for **${targetUser.username}**.`);
            }

            // Generate the embed
            const embed = await generateServiceRecordEmbed(targetUser, userStats, interaction.guild);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('[ERROR] Failed to fetch service record:', error);
            await interaction.editReply('An error occurred while fetching the service record. Please try again later.');
        }
    }
};
