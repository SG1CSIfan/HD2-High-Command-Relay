const { pool } = require('./mysqlHandler');
const { createLeaderboardEmbed } = require('../embedHandlers/leaderboardEmbed');
const { filterLeaderboardMembers } = require('./leaderboardFilterHandler');
const leaderboardCache = new Map();

// Function to get user rank
async function getUserRank(userId, category, tableName) {
    const query = `
        SELECT COUNT(*) + 1 AS \`rank\`
        FROM ${tableName}
        WHERE ${category} > (
            SELECT ${category}
            FROM ${tableName}
            WHERE userId = ?
        )
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows[0]?.rank || 'N/A';
}

// Function to resolve nicknames
async function resolveNicknames(rows, guild) {
    const members = await Promise.all(
        rows.map(async (row) => {
            try {
                let member = guild.members.cache.get(row.userId);
                if (!member) {
                    member = await guild.members.fetch(row.userId).catch(() => null);
                }
                const nickname = member?.nickname || member?.user?.username;
                return nickname ? { nickname, kills: row.kills } : null;
            } catch {
                return null;
            }
        })
    );

    // Filter and return only top 10 active users
    return members.filter((entry) => entry && entry.kills > 0).slice(0, 10);
}

// Function to get leaderboard data
async function getLeaderboardData(guild, category, userId) {
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

        // Resolve nicknames
        const hd2Leaderboard = await resolveNicknames(hd2Rows, guild);
        const regimentLeaderboard = await resolveNicknames(regimentRows, guild);

        console.log('[DEBUG] Nicknames resolved.');

        // Fetch user rank
        const userCareerRank = await getUserRank(userId, category, 'service_reports');
        const userRegimentRank = await getUserRank(userId, category, 'player_contributions');

        const embed = createLeaderboardEmbed(category, hd2Leaderboard, regimentLeaderboard, {
            userCareerRank,
            userRegimentRank,
        });

        // Cache the result
        leaderboardCache.set(cacheKey, { embed, timestamp: Date.now() });

        return embed;
    } catch (error) {
        console.error('[ERROR] Failed to get leaderboard data:', error);
        throw error;
    }
}

module.exports = { getLeaderboardData };
