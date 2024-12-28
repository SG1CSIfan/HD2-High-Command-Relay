const { SlashCommandBuilder } = require('@discordjs/builders');
const { analyzeImage } = require('../utils/googleVision');
const { generateServiceReportEmbed } = require('../embedHandlers/serviceReportEmbed');
const { saveOrUpdateReport, saveOrUpdateBaseline, savePlayerContribution } = require('../handlers/mysqlHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('submit_service_report')
        .setDescription('Submit a Helldiver service report.')
        .addAttachmentOption(option =>
            option
                .setName('image')
                .setDescription('The Career Page image.')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const imageUrl = interaction.options.getAttachment('image')?.url;
            if (!imageUrl) {
                return interaction.editReply('Please attach an image to submit a service report.');
            }

            const member = await interaction.guild.members.fetch(interaction.user.id);
            const nickname = member?.nickname || interaction.user.username;

            const extractedData = await analyzeImage(imageUrl);

            const report = {
                userId: interaction.user.id,
                ...extractedData,
                timestamp: new Date(),
                discordJoinDate: member?.joinedAt || new Date(),
            };

            console.log('[DEBUG] Report Data:', report);

            // Save or update the report in the service_reports table
            const saveResult = await saveOrUpdateReport(report);

            // Add the submission count and rowId for embed generation
            report.submissionCount = saveResult.submissionCount || 1;
            report.rowId = saveResult.rowId || 'Unknown';

            // Save or update the baseline data
            await saveOrUpdateBaseline(report);

            // Update the player contributions based on the baseline
            await savePlayerContribution(report);

            // Generate the embed
            const embed = generateServiceReportEmbed(report, imageUrl, nickname);

            // Send the embed back to the user
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('[ERROR] Failed to process service report:', error);

            await interaction.editReply({
                content: 'Error processing your report. Please try again later.',
                ephemeral: true,
            });
        }
    },
};
