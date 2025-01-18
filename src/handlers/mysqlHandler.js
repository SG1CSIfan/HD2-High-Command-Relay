const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
});

async function saveOrUpdateReport(report) {
    console.log('[DEBUG] Saving report to database:', report);

    try {
        // Check if the user already exists in the table
        const [rows] = await pool.execute(
            'SELECT id, submissionCount FROM service_reports WHERE userId = ?',
            [report.userId]
        );

        if (rows.length > 0) {
            // If user exists, increment submissionCount and update stats
            const rowId = rows[0].id; // Fetch the row ID
            const submissionCount = rows[0].submissionCount + 1;

            const [result] = await pool.execute(
                `UPDATE service_reports 
                SET enemyKills = ?, terminidKills = ?, automatonKills = ?, illuminateKills = ?, 
                    friendlyKills = ?, deaths = ?, shotsFired = ?, shotsHit = ?, 
                    submissionCount = ?, timestamp = ?
                WHERE userId = ?`,
                [
                    report.enemyKills,
                    report.terminidKills,
                    report.automatonKills,
                    report.illuminateKills,
                    report.friendlyKills,
                    report.deaths,
                    report.shotsFired,
                    report.shotsHit,
                    submissionCount,
                    report.timestamp,
                    report.userId,
                ]
            );

            console.log('[DEBUG] Updated existing record:', result);
            return { updated: true, submissionCount, rowId };
        } else {
            // If user does not exist, insert a new record with submissionCount = 1
            const [insertResult] = await pool.execute(
                `INSERT INTO service_reports 
                (userId, enemyKills, terminidKills, automatonKills, illuminateKills, 
                 friendlyKills, deaths, shotsFired, shotsHit, submissionCount, timestamp) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    report.userId,
                    report.enemyKills,
                    report.terminidKills,
                    report.automatonKills,
                    report.illuminateKills,
                    report.friendlyKills,
                    report.deaths,
                    report.shotsFired,
                    report.shotsHit,
                    1, // Initial submissionCount
                    report.timestamp,
                ]
            );

            console.log('[DEBUG] Inserted new record:', insertResult);

            // Fetch the new row ID
            const [newRow] = await pool.execute(
                'SELECT id FROM service_reports WHERE userId = ?',
                [report.userId]
            );

            const rowId = newRow[0]?.id || null;

            return { updated: false, submissionCount: 1, rowId };
        }
    } catch (error) {
        console.error('[ERROR] Failed to save or update report:', error);
        throw error;
    }
}

async function saveOrUpdateBaseline(report) {
    try {
        // Check if the userId exists in player_baseline
        const [rows] = await pool.execute(
            'SELECT discord_join_date FROM player_baseline WHERE userid = ?',
            [report.userId ?? null]
        );

        if (rows.length === 0) {
            // If no userId exists, insert a new record
            await pool.execute(
                `INSERT INTO player_baseline 
                (userid, enemyKills, terminidKills, automatonKills, illuminateKills, 
                 friendlyKills, deaths, shotsFired, shotsHit, first_submission, discord_join_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

                [
                    report.userId ?? null,
                    report.enemyKills ?? 0,
                    report.terminidKills ?? 0,
                    report.automatonKills ?? 0,
                    report.illuminateKills ?? 0,
                    report.friendlyKills ?? 0,
                    report.deaths ?? 0,
                    report.shotsFired ?? 0,
                    report.shotsHit ?? 0,
                    report.firstSubmission ?? new Date(),
                    report.discordJoinDate ?? new Date(), // Add current date if not provided
                ]
            );
            console.log('[DEBUG] New player_baseline record created.');
        } else {
            // If userId exists, check if discord_join_date is missing
            const discordJoinDate = rows[0].discord_join_date;

            if (!discordJoinDate) {
                // Update the record with the missing discord_join_date
                await pool.execute(
                    `UPDATE player_baseline 
                     SET discord_join_date = ? 
                     WHERE userid = ?`,
                    [
                        report.discordJoinDate ?? new Date(), // Add the provided or current date
                        report.userId ?? null,
                    ]
                );
                console.log('[DEBUG] Updated discord_join_date for existing player_baseline record.');
            } else {
                console.log('[DEBUG] Player_baseline record exists and discord_join_date is already set. Skipping update.');
            }
        }
    } catch (error) {
        console.error('[ERROR] Failed to save/update Player_baseline:', error);
        throw error;
    }
}

async function savePlayerContribution(report) {
    try {
        // Fetch the baseline stats for the user
        const [baselineRows] = await pool.execute(
            'SELECT * FROM player_baseline WHERE userid = ?',
            [report.userId]
        );

        if (baselineRows.length === 0) {
            console.warn('[WARN] No player_baseline found for user:', report.userId);
            return;
        }

        const baseline = baselineRows[0];

        // Calculate differences
        const contribution = {
            userId: report.userId,
            enemyKills: report.enemyKills - baseline.enemyKills,
            terminidKills: report.terminidKills - baseline.terminidKills,
            automatonKills: report.automatonKills - baseline.automatonKills,
            illuminateKills: report.illuminateKills - baseline.illuminateKills,
            friendlyKills: report.friendlyKills - baseline.friendlyKills,
            deaths: report.deaths - baseline.deaths,
            shotsFired: report.shotsFired - baseline.shotsFired,
            shotsHit: report.shotsHit - baseline.shotsHit,
        };

        // Insert or update the player's contributions
        const [rows] = await pool.execute(
            'SELECT userid FROM player_contributions WHERE userid = ?',
            [report.userId]
        );

        if (rows.length === 0) {
            await pool.execute(
                `INSERT INTO player_contributions 
                (userid, enemyKills, terminidKills, automatonKills, illuminateKills, friendlyKills, deaths, shotsFired, shotsHit) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    contribution.userId,
                    contribution.enemyKills,
                    contribution.terminidKills,
                    contribution.automatonKills,
                    contribution.illuminateKills,
                    contribution.friendlyKills,
                    contribution.deaths,
                    contribution.shotsFired,
                    contribution.shotsHit,
                ]
            );
            console.log('[DEBUG] New player contribution record created.');
        } else {
            await pool.execute(
                `UPDATE player_contributions 
                SET enemyKills = ?, terminidKills = ?, automatonKills = ?, illuminateKills = ?, friendlyKills = ?, deaths = ?, shotsFired = ?, shotsHit = ? 
                WHERE userid = ?`,
                [
                    contribution.enemyKills,
                    contribution.terminidKills,
                    contribution.automatonKills,
                    contribution.illuminateKills,
                    contribution.friendlyKills,
                    contribution.deaths,
                    contribution.shotsFired,
                    contribution.shotsHit,
                    contribution.userId,
                ]
            );
            console.log('[DEBUG] Player contribution record updated.');
        }
    } catch (error) {
        console.error('[ERROR] Failed to save/update player contributions:', error);
        throw error;
    }
}

async function fetchCareerStats(userId) {
    if (!userId) {
        console.warn('[WARN] No userId provided for fetchCareerStats.');
        return null;
    }

    try {
        const [rows] = await pool.execute(
            `SELECT 
                enemyKills,
                terminidKills,
                automatonKills,
                illuminateKills,
                friendlyKills,
                deaths,
                shotsFired,
                shotsHit,
                timestamp AS lastUpdated
             FROM service_reports
             WHERE userId = ?`,
            [userId]
        );

        if (rows.length === 0) {
            console.log('[DEBUG] No career stats found for user:', userId);
            return {
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
        }

        return rows[0];
    } catch (error) {
        console.error('[ERROR] Failed to fetch career stats for user:', userId, error);
        throw error;
    }
}

async function fetchRegimentStats(userId) {
    if (!userId) {
        console.warn('[WARN] No userId provided for fetchRegimentStats.');
        return null;
    }

    try {
        const [rows] = await pool.execute(
            `SELECT 
                enemyKills,
                terminidKills,
                automatonKills,
                illuminateKills,
                friendlyKills,
                deaths,
                shotsFired,
                shotsHit,
                last_updated AS lastUpdated
             FROM player_contributions
             WHERE userId = ?`,
            [userId]
        );

        if (rows.length === 0) {
            console.log('[DEBUG] No regiment stats found for user:', userId);
            return {
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
        }

        return rows[0];
    } catch (error) {
        console.error('[ERROR] Failed to fetch regiment stats for user:', userId, error);
        throw error;
    }
}

async function fetchKillStats() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                SUM(terminidKills) AS terminidKills,
                SUM(automatonKills) AS automatonKills,
                SUM(illuminateKills) AS illuminateKills
            FROM service_reports
        `);
        return rows[0] || { terminidKills: 0, automatonKills: 0, illuminateKills: 0 };
    } catch (error) {
        console.error('[ERROR] Failed to fetch kill stats:', error);
        return { terminidKills: 0, automatonKills: 0, illuminateKills: 0 };
    }
}

async function fetchWarEffortTotals() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                SUM(terminidKills) AS terminidKills,
                SUM(automatonKills) AS automatonKills,
                SUM(illuminateKills) AS illuminateKills,
                SUM(friendlyKills) AS friendlyKills,
                SUM(deaths) AS deaths,
                SUM(shotsFired) AS shotsFired,
                SUM(shotsHit) AS shotsHit,
                COUNT(*) AS totalSubmissions
            FROM service_reports
        `);
        return rows[0] || {};
    } catch (error) {
        console.error('[ERROR] Failed to fetch war effort totals:', error);
        return {};
    }
}

module.exports = {
    pool, 
    saveOrUpdateReport, 
    fetchKillStats, 
    fetchWarEffortTotals,
    saveOrUpdateBaseline,
    savePlayerContribution,
    fetchRegimentStats,
    fetchCareerStats
 };
