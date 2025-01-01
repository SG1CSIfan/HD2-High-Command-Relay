const { EmbedBuilder } = require('discord.js');

/**
 * Generates the service record embed.
 * @param {Object} user - The Discord user object.
 * @param {Object} statsCareer - Career stats object.
 * @param {Object} statsRegiment - Regiment stats object.
 * @param {string} nickname - The Discord nickname or username.
 * @param {Object} rank - The rank object containing emoji and description.
 * @param {Object} company - The company object containing emoji and description.
 * @param {Array} userMedals - List of medals earned by the user.
 * @param {Object} guild - The Discord guild object.
 * @returns {EmbedBuilder} - The generated service record embed.
 */
function generateServiceRecordEmbed(user, statsCareer, statsRegiment, nickname, rank, company, userMedals, guild) {
    // Generate the embed
    const embed = new EmbedBuilder()
        .setColor(0x1e90ff)
        .setTitle('1st Colonial Regiment Service Record')
        .setDescription(`Service record for  ${nickname} `)
        .addFields(
            { name: 'Joined 1st Colonial Regiment', value: `<t:${Math.floor(guild.members.cache.get(user.id)?.joinedAt?.getTime() / 1000)}:D>`, inline: false },
            { name: 'Service Time', value: calculateServiceTime(guild.members.cache.get(user.id)?.joinedAt), inline: false },
            { name: 'Last Submission', value: statsRegiment.lastUpdated ? `<t:${Math.floor(new Date(statsRegiment.lastUpdated).getTime() / 1000)}:D>` : 'No submissions yet.', inline: false }
        )
        .addFields(
            { name: 'Rank', value: `${rank.emoji} ${rank.description}`, inline: true },
            { name: 'Company', value: `${company.emoji} ${company.description}`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true } // Spacer
        )
        .addFields(
            { name: 'Stats', value: `Enemy Kills\nTerminid Kills\nAutomaton Kills\nIlluminate Kills\nFriendly Kills\nDeaths\nShots Fired\nShots Hit`, inline: true },
            { name: 'HD2 Career', value: `${statsCareer.enemyKills}\n${statsCareer.terminidKills}\n${statsCareer.automatonKills}\n${statsCareer.illuminateKills}\n${statsCareer.friendlyKills}\n${statsCareer.deaths}\n${statsCareer.shotsFired}\n${statsCareer.shotsHit}`, inline: true },
            { name: '1st Regiment', value: `${statsRegiment.enemyKills}\n${statsRegiment.terminidKills}\n${statsRegiment.automatonKills}\n${statsRegiment.illuminateKills}\n${statsRegiment.friendlyKills}\n${statsRegiment.deaths}\n${statsRegiment.shotsFired}\n${statsRegiment.shotsHit}`, inline: true }
        )
        .addFields(
            {
                name: 'Medals',
                value: userMedals.length > 0
                    ? userMedals.map(medal => `${medal.emoji} ${medal.description}`).join('\n')
                    : 'No medals earned yet.',
                inline: false,
            }
        )
        .setThumbnail('https://helldivers.wiki.gg/images/5/56/Ministry_of_Employment_Icon_Gray.png') // Replace with your thumbnail URL
        .setFooter({ text: 'The Tip of The Spear' })
        .setTimestamp();

    return embed;
}

/**
 * Calculate service time based on join date.
 * @param {Date} joinDate - The date the user joined the Discord server.
 * @returns {string} - Service time in "Years, Months, Days".
 */
function calculateServiceTime(joinDate) {
    if (!joinDate) return 'N/A';

    const now = new Date();
    const diff = new Date(now - joinDate);

    const years = diff.getUTCFullYear() - 1970;
    const months = diff.getUTCMonth();
    const days = diff.getUTCDate() - 1;

    return `${years} years, ${months} months, ${days} days`;
}

module.exports = { generateServiceRecordEmbed };
