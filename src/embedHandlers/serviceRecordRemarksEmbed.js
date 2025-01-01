const { EmbedBuilder } = require('discord.js');

/**
 * Generate an embed for service record remarks.
 * @param {Array} positiveRemarks - Array of positive remarks with user and details.
 * @param {Array} negativeRemarks - Array of negative remarks with user and details.
 * @returns {EmbedBuilder} - The remarks embed.
 */
function generateServiceRecordRemarksEmbed(positiveRemarks, negativeRemarks) {
    const formatRemark = (remark) =>
        `<@${remark.remarkBy}> - ${remark.remarkDetails || 'No details provided'}`;

    const positiveText = positiveRemarks.length
        ? positiveRemarks.map(formatRemark).join('\n')
        : 'No positive remarks.';

    const negativeText = negativeRemarks.length
        ? negativeRemarks.map(formatRemark).join('\n')
        : 'No negative remarks.';

    return new EmbedBuilder()
        .setTitle('1st Colonial Regiment - Service Record Remarks')
        .addFields(
            { name: 'Positive Remarks', value: positiveText, inline: false },
            { name: 'Negative Remarks', value: negativeText, inline: false }
        )
        .setFooter({ text: 'Page 2/2' })
        .setColor(0x1e90ff);
}

module.exports = { generateServiceRecordRemarksEmbed };
