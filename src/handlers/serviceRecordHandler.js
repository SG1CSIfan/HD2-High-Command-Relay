const { fetchCareerStats, fetchRegimentStats } = require('./mysqlHandler');
const { generateServiceRecordEmbed } = require('../embedHandlers/serviceRecordEmbed');
const emojiMap = require('../utils/emojiMapLoader');

/**
 * Handles the service record logic.
 * @param {Object} user - The Discord user object.
 * @param {Object} guild - The Discord guild object.
 * @returns {Promise<EmbedBuilder>} - The embed for the service record.
 */
async function handleServiceRecord(user, guild) {
    try {
        // Fetch Discord nickname or username
        const nickname = await fetchDiscordNickname(user.id, guild);

        // Fetch career stats with fallback
        const statsCareer = (await fetchCareerStats(user.id)) || {
            enemyKills: 0,
            terminidKills: 0,
            automatonKills: 0,
            illuminateKills: 0,
            friendlyKills: 0,
            deaths: 0,
            shotsFired: 0,
            shotsHit: 0,
            lastUpdated: null,
        };

        // Fetch regiment stats with fallback
        const statsRegiment = (await fetchRegimentStats(user.id)) || {
            enemyKills: 0,
            terminidKills: 0,
            automatonKills: 0,
            illuminateKills: 0,
            friendlyKills: 0,
            deaths: 0,
            shotsFired: 0,
            shotsHit: 0,
            lastUpdated: null,
        };

        // Safely access ranks and companies
        const ranks = emojiMap?.ranks || {};
        const companies = emojiMap?.companies || {};
        const medals = emojiMap?.medals || {};

        // Find the highest rank
        const rank = Object.values(ranks).find(rank => guild.members.cache.get(user.id)?.roles.cache.has(rank.roleId)) || { emoji: '', description: 'No Rank' };

        // Find the company
        const company = Object.values(companies).find(company => guild.members.cache.get(user.id)?.roles.cache.has(company.roleId)) || { emoji: '', description: 'No Company' };

        // Find medals
        const userMedals = Object.values(medals)
            .filter(medal => guild.members.cache.get(user.id)?.roles.cache.has(medal.roleId))
            .sort((a, b) => a.priority - b.priority);

        // Generate the embed with all gathered data
        const embed = await generateServiceRecordEmbed(user, statsCareer, statsRegiment, nickname, rank, company, userMedals, guild);

        return embed;
    } catch (error) {
        console.error('[ERROR] Failed to fetch service record stats:', error);
        throw error;
    }
}

/**
 * Fetches the Discord nickname or username for a given user ID.
 * @param {string} userId - The user ID to look up.
 * @param {Object} guild - The Discord guild object.
 * @returns {Promise<string>} - The nickname or username of the user.
 */
async function fetchDiscordNickname(userId, guild) {
    try {
        const member = await guild.members.fetch(userId);
        return member.nickname || member.user.username;
    } catch (error) {
        console.warn('[WARN] Failed to fetch Discord nickname for user:', userId, error);
        return 'Unknown User';
    }
}

module.exports = { handleServiceRecord, fetchDiscordNickname };
