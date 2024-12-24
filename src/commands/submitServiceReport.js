const { SlashCommandBuilder } = require('@discordjs/builders');
const { analyzeImage } = require('../utils/googleVision');
const { generateServiceReportEmbed } = require('../embedHandlers/serviceReportEmbed');
const { saveOrUpdateReport } = require('../handlers/mysqlHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('submitservicereport')
        .setDescription('Submit a Helldiver service report.')
        .addAttachmentOption(option =>
            option
                .setName('image')
                .setDescription('The service report image.')
                .setRequired(true)
        ),
        async execute(interaction) {
            try {
                await interaction.deferReply();
    
                const imageUrl = interaction.options.getAttachment('image')?.url;
                if (!imageUrl) {
                    return interaction.editReply('Please attach an image to submit a service report.');
                }
    
                //console.log('[DEBUG] Image URL:', imageUrl);
    
                // Fetch the member's nickname or fallback to username
                const member = await interaction.guild.members.fetch(interaction.user.id);
                const nickname = member?.nickname || interaction.user.username;
    
                const extractedData = await analyzeImage(imageUrl);
                //console.log('[DEBUG] Extracted Data:', extractedData);
    
                const report = {
                    userId: interaction.user.id,
                    ...extractedData,
                    timestamp: new Date(),
                };
    
                console.log('[DEBUG] Report Data:', report);
    
                // Save or update the report in the database
                const saveResult = await saveOrUpdateReport(report);
                //console.log('[DEBUG] Database Save Result:', saveResult);
    
                // Add submissionCount and rowId to the report for the embed
                report.submissionCount = saveResult.submissionCount || 1;
                report.rowId = saveResult.rowId || 'Unknown';
    
                // Generate the embed (pass the nickname here)
                const embed = generateServiceReportEmbed(report, imageUrl, nickname);
                //console.log('[DEBUG] Generated Embed:', embed);
    
                // Send the embed back to the user
                await interaction.editReply({ embeds: [embed] });
                //console.log('[DEBUG] Embed successfully sent to the user.');
            } catch (error) {
                console.error('[ERROR] Failed to process service report:', error);
    
                // Send an error message to the user
                await interaction.editReply({
                    content: 'Error processing your report. Please try again later.',
                    ephemeral: true,
                });
            }
        },
    };
    