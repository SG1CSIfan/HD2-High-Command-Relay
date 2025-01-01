const { SlashCommandBuilder } = require('@discordjs/builders');
const { handleServiceRecord } = require('../handlers/serviceRecordHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('service_record')
        .setDescription('View your service record or another user\'s record.')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('User to view the record for.')
                .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const targetUser = interaction.options.getUser('member') || interaction.user;

        try {
            const embed = await handleServiceRecord(targetUser, interaction.guild);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('[ERROR] Failed to fetch service record:', error);
            await interaction.editReply('An error occurred while fetching the service record. Please try again later.');
        }
    },
};
