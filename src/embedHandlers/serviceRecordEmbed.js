const { EmbedBuilder } = require('discord.js');
const { isDevMode } = require('../utils/envUtils');
const emojiMap = require('../utils/emojiMapLoader'); // Import the emoji map
const fs = require('fs');

async function generateServiceRecordEmbed(user, stats, guild) {
    const member = await guild.members.fetch(user.id);
    const nickname = member?.nickname || user.username;

    // Determine which roles file to load based on the environment
    const rolesFilePath = isDevMode()
        ? './src/data/rolesDev.json'
        : './src/data/rolesProd.json';
    const rolesData = JSON.parse(fs.readFileSync(rolesFilePath, 'utf8'));

    // Fetch user's roles
    const userRoles = member.roles.cache.map(role => role.id);

    // Filter and sort medals based on user roles and priority
    const medals = Object.entries(emojiMap.medals)
        .filter(([key, medal]) => userRoles.includes(medal.roleId))
        .sort((a, b) => a[1].priority - b[1].priority) // Sort by priority (ascending)
        .map(([key, medal]) => `${medal.emoji} **${key.replace(/_/g, ' ')}**: ${medal.description}`);

    // Calculate service time
    const joinedAt = member?.joinedAt || new Date();
    const serviceTime = calculateServiceTime(joinedAt);

    // Create the embed
    const embed = new EmbedBuilder()
        .setColor(0x1e90ff)
        .setTitle('1st Colonial Regiment Service Record')
        .setDescription(`Service record for ${nickname}`)
        .addFields(
            { name: 'Joined Discord', value: `<t:${Math.floor(joinedAt.getTime() / 1000)}:F>`, inline: false },
            { name: 'Service Time', value: serviceTime, inline: false },
            { name: 'Last Submission', value: `<t:${Math.floor(new Date(stats.lastUpdated).getTime() / 1000)}:R>`, inline: false }
        )
        .addFields(
            { name: 'Enemy Kills', value: `${stats.enemyKills}`, inline: true },
            { name: 'Terminid Kills', value: `${stats.terminidKills}`, inline: true },
            { name: 'Automaton Kills', value: `${stats.automatonKills}`, inline: true },
            { name: 'Illuminate Kills', value: `${stats.illuminateKills}`, inline: true },
            { name: 'Friendly Kills', value: `${stats.friendlyKills}`, inline: true },
            { name: 'Deaths', value: `${stats.deaths}`, inline: true },
            { name: 'Shots Fired', value: `${stats.shotsFired}`, inline: true },
            { name: 'Shots Hit', value: `${stats.shotsHit}`, inline: true }
        )
        .addFields(
            {
                name: 'Medals',
                value: medals.length > 0 ? medals.join('\n') : 'No medals earned yet.',
                inline: false,
            }
        )
        .setThumbnail('https://helldivers.wiki.gg/images/5/56/Ministry_of_Employment_Icon_Gray.png')
        .setFooter({ text: 'The Tip of The Spear' })
        .setTimestamp();

    return embed;
}

function calculateServiceTime(joinDate) {
    const now = new Date();
    const diff = new Date(now - joinDate);

    const years = diff.getUTCFullYear() - 1970;
    const months = diff.getUTCMonth();
    const days = diff.getUTCDate() - 1;

    return `${years} years, ${months} months, ${days} days`;
}

module.exports = { generateServiceRecordEmbed };
