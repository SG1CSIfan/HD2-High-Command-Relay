const { EmbedBuilder } = require('discord.js');
const emojiMap = require('../utils/emojiMapLoader');

function generateRegimentEffortEmbed(totals) {
    return new EmbedBuilder()
        .setColor(0x1f8b4c)
        .setTitle('⚔️ Regiment Effort Report')
        .setDescription('Summary of the ongoing war effort.')
        .addFields(
            { name: `${emojiMap.terminid} Terminid Kills`, value: `${totals.terminidKills}`, inline: true },
            { name: `${emojiMap.automaton} Automaton Kills`, value: `${totals.automatonKills}`, inline: true },
            { name: `${emojiMap.illuminate} Illuminate Kills`, value: `${totals.illuminateKills}`, inline: true },
            { name: `${emojiMap.friendlyKills} Friendly Fire`, value: `${totals.friendlyKills}`, inline: true },
            { name: `${emojiMap.deaths} Operative Deaths`, value: `${totals.deaths}`, inline: true },
            { name: `${emojiMap.shotsFired} Shots Fired`, value: `${totals.shotsFired}`, inline: true },
            { name: `${emojiMap.shotsHit} Shots Hit`, value: `${totals.shotsHit}`, inline: true },
            { name: '📋 Total Submissions', value: `${totals.totalSubmissions}`, inline: false }
        )
        .setFooter({ text: 'Report prepared by High Command', timestamp: new Date() });
}

module.exports = {
    generateRegimentEffortEmbed
};