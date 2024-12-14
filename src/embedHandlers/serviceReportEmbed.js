const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const emojiMap = require('../utils/emojiMapLoader');

// Load High Command messages from a JSON file
const messagesPath = path.join(__dirname, '../data/highCommandMessages.json');
const highCommandMessages = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));

function getRandomHighCommandMessage() {
    // Pick a random message from the JSON array
    return highCommandMessages[Math.floor(Math.random() * highCommandMessages.length)];
}

function generateServiceReportEmbed(data, imageUrl, nickname) {
    console.log('[DEBUG] Generating embed with data:', data);

    // Pick a random message from High Command
    const highCommandMessage = getRandomHighCommandMessage();

    return new EmbedBuilder()
        .setColor(0x1f8b4c)
        .setTitle('📡 Helldiver Service Report')
        .setDescription(
            `**Report Filed By**: **${nickname}**.\n` +
            `**Status**: Transmission Sent.\n` +
            `**Message from High Command**: ${highCommandMessage}`
        )
        .addFields(
            { name: '🆔 Record ID', value: `${data.rowId}`, inline: false },
            { name: '⚔️ Enemy Kills', value: `${data.enemyKills || 0}`, inline: false },
            { name: `${emojiMap.terminid} Terminid Kills`, value: `${data.terminidKills || 0}`, inline: true },
            { name: `${emojiMap.automaton} Automaton Kills`, value: `${data.automatonKills || 0}`, inline: true },
            { name: `${emojiMap.illuminate} Illuminate Kills`, value: `${data.illuminateKills || 0}`, inline: true },
            { name: `${emojiMap.friendlyKills} Friendly Kills`, value: `${data.friendlyKills || 0}`, inline: true },
            { name: `${emojiMap.deaths} Deaths`, value: `${data.deaths || 0}`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: `${emojiMap.shotsFired} Shots Fired`, value: `${data.shotsFired || 0}`, inline: true },
            { name: `${emojiMap.shotsHit} Shots Hit`, value: `${data.shotsHit || 0}`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: '📝 Submission Count', value: `${data.submissionCount || 1}`, inline: true }
        )
        .setThumbnail(data.thumbnail || null)
        .setImage(imageUrl)
        .setFooter({ text: 'Transmission approved by High Command.' })
        .setTimestamp();
}

module.exports = { generateServiceReportEmbed };
