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

function createLeaderboardEmbed(category, hd2Leaderboard, regimentLeaderboard, ranks) {
    const maxUsernameLength = 20; // Limit usernames to 20 characters

    const truncateUsername = (username) => {
        return username.length > maxUsernameLength
            ? `${username.slice(0, maxUsernameLength)}...`
            : username;
    };

    const formatUsernames = (leaderboard) =>
        leaderboard.map((entry, index) => {
            const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ` ${index + 1}`.padStart(3);
            return `${rankEmoji} ${truncateUsername(entry.nickname)}`;
        });

    const formatKills = (leaderboard) => leaderboard.map((entry) => `${entry.kills.toLocaleString()}`);

    const embed = new EmbedBuilder()
        .setTitle(`🏆 Leader Board - ${category.replace(/([A-Z])/g, ' $1')}`)
        .setDescription(`Leader Board of the 1st Colonial Regiment\nInformation for ${category}`)
        .addFields(
            // Career Page group
            { name: 'Helldivers (Career Page)', value: `\`\`\`\n${formatUsernames(hd2Leaderboard).join('\n')}\`\`\``, inline: true },
            { name: 'Kills (Career Page)', value: `\`\`\`\n${formatKills(hd2Leaderboard).join('\n')}\`\`\``, inline: true },
            { name: '\u200B', value: '\u200B', inline: false }, // Blank spacer

            // 1st Regiment group
            { name: 'Helldivers (1st Regiment)', value: `\`\`\`\n${formatUsernames(regimentLeaderboard).join('\n')}\`\`\``, inline: true },
            { name: 'Kills (1st Regiment)', value: `\`\`\`\n${formatKills(regimentLeaderboard).join('\n')}\`\`\``, inline: true },
            { name: '\u200B', value: '\u200B', inline: false } // Blank spacer
        )
        .addFields({
            name: 'Your Rank',
            value: `You are #${ranks.userCareerRank} in Career Page and #${ranks.userRegimentRank} in 1st Regiment.`,
            inline: false,
        })
        .setColor('#00b0f4')
        .setFooter({ text: '1st Colonial Regiment | HD2 Service Report Bot' })
        .setTimestamp();

    return embed;
}


module.exports = { createLeaderboardEmbed };
