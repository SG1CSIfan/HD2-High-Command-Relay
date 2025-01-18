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

function splitContentIntoFields(content, maxLength = 1024) {
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

function createLeaderboardEmbed(category, hd2Leaderboard, regimentLeaderboard, userRanks) {
    // Filter out "Unknown" users
    const filteredHD2Leaderboard = hd2Leaderboard.filter(entry => entry.nickname !== 'Unknown');
    const filteredRegimentLeaderboard = regimentLeaderboard.filter(entry => entry.nickname !== 'Unknown');

    const embed = new EmbedBuilder()
        .setTitle(`🏆 Leader Board - ${category.replace(/([A-Z])/g, ' $1')}`)
        .setDescription(`Leader Board of the 1st Colonial Regiment\nInformation for ${category}`)
        .setColor('#00b0f4')
        .setFooter({ text: '1st Colonial Regiment | HD2 Service Report Bot' })
        .setTimestamp();

    // Add HD2 Career Page fields
    embed.addFields(
        { name: 'HD2 Career Page', value: '** **', inline: false },
        {
            name: 'Helldivers',
            value: `\`\`\`${formatLeaderboard(filteredHD2Leaderboard)}\`\`\``,
            inline: true,
        },
        {
            name: 'HD2 Career',
            value: `\`\`\`${formatKills(filteredHD2Leaderboard)}\`\`\``,
            inline: true,
        }
    );

    // Add 1st Regiment fields
    embed.addFields(
        { name: '1st Regiment', value: '** **', inline: false },
        {
            name: 'Helldivers',
            value: `\`\`\`${formatLeaderboard(filteredRegimentLeaderboard)}\`\`\``,
            inline: true,
        },
        {
            name: '1st Regiment',
            value: `\`\`\`${formatKills(filteredRegimentLeaderboard)}\`\`\``,
            inline: true,
        }
    );

    // Add user rank
    embed.addFields({
        name: 'Your Rank',
        value: `You are #${userRanks.userCareerRank || 'N/A'} in Career Page and #${userRanks.userRegimentRank || 'N/A'} in 1st Regiment.`,
        inline: false,
    });

    return embed;
}


module.exports = { createLeaderboardEmbed };
