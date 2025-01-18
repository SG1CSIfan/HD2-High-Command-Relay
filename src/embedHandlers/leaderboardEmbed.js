const { EmbedBuilder } = require('discord.js');

function padLeaderboard(leaderboard) {
    while (leaderboard.length < 10) {
        leaderboard.push({ nickname: 'N/A', kills: 0 });
    }
    return leaderboard;
}

function formatLeaderboard(leaderboard) {
    return leaderboard
        .map((entry, index) => {
            const rankEmojis = ['🥇', '🥈', '🥉']; // Unicode emojis for 1st, 2nd, 3rd
            const rank = index < 3 ? rankEmojis[index] : `${(index + 1).toString().padStart(2)}`;
            return `${rank.padEnd(4)} ${entry.nickname}`;
        })
        .join('\n');
}

function formatKills(leaderboard) {
    return leaderboard
        .map(entry => entry.kills.toLocaleString().padStart(8)) // Adjusted padding for kill counts
        .join('\n');
}

function createLeaderboardEmbed(category, hd2Leaderboard, regimentLeaderboard) {
    padLeaderboard(hd2Leaderboard);
    padLeaderboard(regimentLeaderboard);

    return new EmbedBuilder()
        .setTitle(`🏆 Leader Board - ${category.replace(/([A-Z])/g, ' $1')}`)
        .setDescription(`Leader Board of the 1st Colonial Regiment\nInformation for ${category}`)
        .addFields(
            { name: 'HD2 Career Page', value: '** **', inline: false },
            {
                name: 'Helldivers',
                value: `\`\`\`\n${formatLeaderboard(hd2Leaderboard)}\n\`\`\``,
                inline: true,
            },
            {
                name: 'HD2 Career',
                value: `\`\`\`\n${formatKills(hd2Leaderboard)}\n\`\`\``,
                inline: true,
            },
            { name: '1st Regiment', value: '** **', inline: false },
            {
                name: 'Helldivers',
                value: `\`\`\`\n${formatLeaderboard(regimentLeaderboard)}\n\`\`\``,
                inline: true,
            },
            {
                name: '1st Regiment',
                value: `\`\`\`\n${formatKills(regimentLeaderboard)}\n\`\`\``,
                inline: true,
            }
        )
        .setColor('#00b0f4')
        .setFooter({ text: '1st Colonial Regiment | HD2 Service Report Bot' })
        .setTimestamp();
}

module.exports = { createLeaderboardEmbed };
