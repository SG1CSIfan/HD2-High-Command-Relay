const { SlashCommandBuilder } = require('@discordjs/builders');
const { handleServiceRecord } = require('../handlers/serviceRecordHandler');
const { generateServiceRecordRemarksEmbed } = require('../embedHandlers/serviceRecordRemarksEmbed');
const { fetchRemarksForUser } = require('../handlers/remarkHandler');
const { hasPermissionForCommand } = require('../handlers/permissionHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('full_service_record')
        .setDescription('Freedom Caste Only: View the full service record including stats and remarks.')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('User to view the record for.')
                .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const targetUser = interaction.options.getUser('member') || interaction.user;

        // Permission Check
        if (!hasPermissionForCommand(interaction.member, 'full_service_record')) {
            return interaction.editReply({
                content: 'You do not have permission to use this command.',
                ephemeral: true,
            });
        }

        try {
            const guild = interaction.guild;

            // Generate stats embed
            const statsEmbed = await handleServiceRecord(targetUser, guild);

            // Fetch remarks
            const { positiveRemarks, negativeRemarks } = await fetchRemarksForUser(targetUser.id);

            // Generate remarks embed
            const remarksEmbed = generateServiceRecordRemarksEmbed(positiveRemarks, negativeRemarks);

            // Send initial embed with buttons
            const message = await interaction.editReply({
                embeds: [statsEmbed],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: 'Previous',
                                style: 1,
                                customId: 'stats_previous',
                                disabled: true,
                            },
                            {
                                type: 2,
                                label: 'Next',
                                style: 1,
                                customId: 'remarks_next',
                            },
                        ],
                    },
                ],
            });

            // Button interaction collector
            const collector = message.createMessageComponentCollector({
                filter: i => i.user.id === interaction.user.id,
                time: 60000, // 60 seconds for button collection
            });

            let currentPage = 1;

            collector.on('collect', async i => {
                if (i.customId === 'remarks_next') {
                    currentPage = 2;
                    await i.update({
                        embeds: [remarksEmbed],
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        label: 'Previous',
                                        style: 1,
                                        customId: 'stats_previous',
                                    },
                                    {
                                        type: 2,
                                        label: 'Next',
                                        style: 1,
                                        customId: 'remarks_next',
                                        disabled: true,
                                    },
                                ],
                            },
                        ],
                    });
                } else if (i.customId === 'stats_previous') {
                    currentPage = 1;
                    await i.update({
                        embeds: [statsEmbed],
                        components: [
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        label: 'Previous',
                                        style: 1,
                                        customId: 'stats_previous',
                                        disabled: true,
                                    },
                                    {
                                        type: 2,
                                        label: 'Next',
                                        style: 1,
                                        customId: 'remarks_next',
                                    },
                                ],
                            },
                        ],
                    });
                }
            });

            collector.on('end', () => {
                message.edit({
                    components: [], // Remove buttons after timeout
                });
            });
        } catch (error) {
            console.error('[ERROR] Failed to execute command:', error);
            await interaction.editReply({
                content: 'An error occurred while fetching the full service record. Please try again later.',
                ephemeral: true,
            });
        }
    },
};
