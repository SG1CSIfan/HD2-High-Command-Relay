const { SlashCommandBuilder } = require('@discordjs/builders');
const { addPlayerRemark } = require('../handlers/remarkHandler');
const { hasPermissionForCommand } = require('../handlers/permissionHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remark_service_record')
        .setDescription('Add a positive or negative remark to a player.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The player to leave a remark for.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('remark_type')
                .setDescription('Positive or Negative.')
                .setRequired(true)
                .addChoices(
                    { name: 'Positive', value: 'Positive' },
                    { name: 'Negative', value: 'Negative' }
                )
        )
        .addStringOption(option =>
            option.setName('details')
                .setDescription('The details of the remark.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const remarkType = interaction.options.getString('remark_type');
        const remarkDetails = interaction.options.getString('details');
        const member = interaction.member;

        try {
            // Check permission for this command
            if (!hasPermissionForCommand(member, 'remark_service_record')) {
                await interaction.reply({
                    content: 'You do not have permission to use this command.',
                    ephemeral: true,
                });
                return;
            }

            // Add remark
            const remarkData = {
                userId: targetUser.id,
                remarkBy: interaction.user.id,
                remarkDate: new Date(),
                remarkType,
                remarkDetails,
            };

            await addPlayerRemark(remarkData);
            await interaction.reply({
                content: `Remark added successfully for ${targetUser}.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error('[ERROR] Failed to add remark:', error);
            if (!interaction.replied) {
                await interaction.reply('An error occurred while adding the remark.');
            }
        }
    },
};
