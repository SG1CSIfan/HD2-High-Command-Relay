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

async function fetchKillStats() {
    const [rows] = await pool.query(`
        SELECT 
            SUM(terminidKills) AS terminidKills,
            SUM(automatonKills) AS automatonKills,
            SUM(illuminateKills) AS illuminateKills
        FROM service_reports
    `);
    return rows[0] || { terminidKills: 0, automatonKills: 0, illuminateKills: 0 };
}

async function fetchWarEffortTotals() {
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
}

module.exports = { saveOrUpdateReport, fetchKillStats, fetchWarEffortTotals };
