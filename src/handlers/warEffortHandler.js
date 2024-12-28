const { loadConfig } = require('../handlers/configHandler');

async function fetchWarEffortTotals() {
    try {
        const [rows] = await pool.query('SELECT * FROM service_reports');
        const totals = rows.reduce(
            (acc, row) => ({
                terminidKills: acc.terminidKills + row.terminidKills,
                automatonKills: acc.automatonKills + row.automatonKills,
                illuminateKills: acc.illuminateKills + row.illuminateKills,
                friendlyKills: acc.friendlyKills + row.friendlyKills,
                deaths: acc.deaths + row.deaths,
                shotsFired: acc.shotsFired + row.shotsFired,
                shotsHit: acc.shotsHit + row.shotsHit,
            }),
            {
                terminidKills: 0,
                automatonKills: 0,
                illuminateKills: 0,
                friendlyKills: 0,
                deaths: 0,
                shotsFired: 0,
                shotsHit: 0,
            }
        );

        // Load goals from configuration
        const config = await loadConfig();
        const goals = config.warEffort.goals || {};

        // Add progress percentages
        return {
            ...totals,
            terminidProgress: ((totals.terminidKills / goals.terminidKills) * 100).toFixed(2),
            automatonProgress: ((totals.automatonKills / goals.automatonKills) * 100).toFixed(2),
            illuminateProgress: ((totals.illuminateKills / goals.illuminateKills) * 100).toFixed(2),
        };
    } catch (error) {
        console.error('[ERROR] Failed to fetch war effort totals:', error);
        throw error;
    }
}

module.exports = { fetchWarEffortTotals };
