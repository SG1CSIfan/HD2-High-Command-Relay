const { EmbedBuilder } = require('discord.js');

function generateWarEffortEmbed(totals) {
    return new EmbedBuilder()
        .setColor(0x1f8b4c)
        .setTitle('⚔️ Current War Effort')
        .addFields(
            { name: '🪖 Terminid Kills', value: `${totals.terminidKills}`, inline: true },
            { name: '🤖 Automaton Kills', value: `${totals.automatonKills}`, inline: true },
            { name: '💡 Illuminate Kills', value: `${totals.illuminateKills}`, inline: true },
            { name: '🧨 Friendly Kills', value: `${totals.friendlyKills}`, inline: true },
            { name: '☠️ Deaths', value: `${totals.deaths}`, inline: true },
            { name: '📸 Shots Fired', value: `${totals.shotsFired}`, inline: true },
            { name: '🎯 Shots Hit', value: `${totals.shotsHit}`, inline: true }
        )
        .setFooter({ text: 'Data updated periodically by High Command.' })
        .setTimestamp();
}

module.exports = { generateWarEffortEmbed };
