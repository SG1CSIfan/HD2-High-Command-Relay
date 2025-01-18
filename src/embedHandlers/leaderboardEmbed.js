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
    const maxFieldLength = 1024; // Discord embed field limit
    const maxLineLength = 50; // Limit each line to a maximum length

    // Function to truncate individual lines
    const truncateLine = (line) =>
        line.length > maxLineLength ? `${line.slice(0, maxLineLength)}...` : line;

    // Format leaderboard usernames
    const formatUsernames = (leaderboard) =>
        leaderboard.map((entry, index) => {
            const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`.padStart(3);
            return `${rankEmoji} ${truncateLine(entry.nickname)}`;
        });

    // Format kills
    const formatKills = (leaderboard) =>
        leaderboard.map((entry) => entry.kills.toLocaleString());

    // Function to split content into multiple fields
    const splitFields = (title, lines) => {
        const fields = [];
        let currentChunk = [];

        lines.forEach((line) => {
            const combinedLength = currentChunk.join('\n').length + line.length + 1;
            if (combinedLength > maxFieldLength) {
                fields.push({ name: title, value: `\`\`\`\n${currentChunk.join('\n')}\`\`\``, inline: true });
                currentChunk = [];
            }
            currentChunk.push(line);
        });

        if (currentChunk.length) {
            fields.push({ name: title, value: `\`\`\`\n${currentChunk.join('\n')}\`\`\``, inline: true });
        }

        return fields;
    };

    const hd2UserFields = splitFields('Helldivers (Career Page)', formatUsernames(hd2Leaderboard));
    const hd2KillFields = splitFields('Kills (Career Page)', formatKills(hd2Leaderboard));

    const regimentUserFields = splitFields('Helldivers (1st Regiment)', formatUsernames(regimentLeaderboard));
    const regimentKillFields = splitFields('Kills (1st Regiment)', formatKills(regimentLeaderboard));

    const embed = new EmbedBuilder()
        .setTitle(`🏆 Leader Board - ${category.replace(/([A-Z])/g, ' $1')}`)
        .setDescription(`Leader Board of the 1st Colonial Regiment\nInformation for ${category}`)
        .addFields([...hd2UserFields, ...hd2KillFields]) // Add Career Page fields
        .addFields({ name: '\u200B', value: '\u200B', inline: false }) // Spacer
        .addFields([...regimentUserFields, ...regimentKillFields]) // Add 1st Regiment fields
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
