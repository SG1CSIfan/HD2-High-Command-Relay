const { EmbedBuilder } = require('discord.js');

function padLeaderboard(leaderboard) {
    while (leaderboard.length < 10) {
        leaderboard.push({ nickname: 'N/A', kills: 0 });
    }
    return leaderboard;
}

function splitFields(content, maxLength = 1024) {
    const fields = [];
    while (content.length > 0) {
        const chunk = content.slice(0, maxLength);
        const lastBreak = chunk.lastIndexOf('\n'); // Ensure we split at a line break
        const splitIndex = lastBreak > -1 ? lastBreak + 1 : maxLength;

        fields.push(content.slice(0, splitIndex).trim());
        content = content.slice(splitIndex);
    }
    return fields;
}

function createLeaderboardEmbed(category, hd2Leaderboard, regimentLeaderboard, ranks) {
    const formatLeaderboardUsernames = (leaderboard) =>
        leaderboard.map((entry, index) => {
            const rankEmojis = ['🥇', '🥈', '🥉'];
            const rank = index < 3 ? rankEmojis[index] : `${index + 1}`;
            return `${rank} ${entry.nickname}`;
        });

    const formatLeaderboardKills = (leaderboard) =>
        leaderboard.map((entry) => entry.kills.toLocaleString());

    const hd2Usernames = formatLeaderboardUsernames(hd2Leaderboard).join('\n');
    const hd2Kills = formatLeaderboardKills(hd2Leaderboard).join('\n');

    const regimentUsernames = formatLeaderboardUsernames(regimentLeaderboard).join('\n');
    const regimentKills = formatLeaderboardKills(regimentLeaderboard).join('\n');

    const embed = new EmbedBuilder()
        .setTitle(`🏆 Leader Board - ${category.replace(/([A-Z])/g, ' $1')}`)
        .setDescription(`Leader Board of the 1st Colonial Regiment\nInformation for ${category}`)
        .addFields(
            { name: 'HD2 Career - Usernames', value: `\`\`\`\n${hd2Usernames || 'No data available.'}\n\`\`\``, inline: true },
            { name: 'HD2 Career - Kills', value: `\`\`\`\n${hd2Kills || 'No data available.'}\n\`\`\``, inline: true },
            { name: '\u200b', value: '\u200b', inline: false }, // Spacer for visual separation
            { name: '1st Regiment - Usernames', value: `\`\`\`\n${regimentUsernames || 'No data available.'}\n\`\`\``, inline: true },
            { name: '1st Regiment - Kills', value: `\`\`\`\n${regimentKills || 'No data available.'}\n\`\`\``, inline: true }
        )
        .addFields({
            name: 'Your Rank',
            value: `You are #${ranks.userCareerRank || 'N/A'} in Career Page and #${ranks.userRegimentRank || 'N/A'} in 1st Regiment.`,
            inline: false,
        })
        .setColor('#00b0f4')
        .setFooter({ text: '1st Colonial Regiment | HD2 Service Report Bot' })
        .setTimestamp();

    return embed;
}

module.exports = { createLeaderboardEmbed };
