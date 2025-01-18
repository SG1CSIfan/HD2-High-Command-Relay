const { pool } = require('./mysqlHandler');
const { createLeaderboardEmbed } = require('../embedHandlers/leaderboardEmbed');
const { filterLeaderboardMembers } = require('./leaderboardFilterHandler'); // Import the function
const leaderboardCache = new Map();

async function getLeaderboardData(guild, category) {
    if (!guild || !guild.members) {
        throw new Error('Invalid guild object provided to getLeaderboardData.');
    }

    const cacheKey = `${guild.id}-${category}`;
    const cached = leaderboardCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < 60000) {
        console.log('[DEBUG] Returning cached leaderboard data.');
        return cached.embed;
    }

    try {
        const start = Date.now();

        // Fetch leaderboard data
        const [hd2Rows] = await pool.query(
            `SELECT userId, ${category} AS kills 
             FROM service_reports 
             ORDER BY ${category} DESC 
             LIMIT 50`
        );

        const [regimentRows] = await pool.query(
            `SELECT userId, ${category} AS kills 
             FROM player_contributions 
             ORDER BY ${category} DESC 
             LIMIT 50`
        );

        console.log(`[DEBUG] Database fetch complete in ${Date.now() - start}ms.`);

        // Filter members for both leaderboards
        const hd2Leaderboard = await filterLeaderboardMembers(hd2Rows, guild);
        const regimentLeaderboard = await filterLeaderboardMembers(regimentRows, guild);

        console.log('[DEBUG] Leaderboards filtered.');

        const embed = createLeaderboardEmbed(category, hd2Leaderboard, regimentLeaderboard);

        // Cache the result
        leaderboardCache.set(cacheKey, { embed, timestamp: Date.now() });

        return embed;
    } catch (error) {
        console.error('[ERROR] Failed to get leaderboard data:', error);
        throw error;
    }
}

module.exports = { getLeaderboardData };
