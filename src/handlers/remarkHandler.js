const pool = require('../utils/database');

/**
 * Add a remark to the database.
 * @param {Object} remarkData - The data of the remark.
 * @param {string} remarkData.userId - The ID of the user receiving the remark.
 * @param {string} remarkData.remarkBy - The ID of the user adding the remark.
 * @param {Date} remarkData.remarkDate - The date the remark was added.
 * @param {string} remarkData.remarkType - The type of the remark (Positive/Negative).
 * @param {string} remarkData.remarkDetails - The details of the remark.
 * @returns {Promise<void>}
 */
async function addPlayerRemark(remarkData) {
    try {
        await pool.execute(
            `INSERT INTO player_remarks (userId, remarkBy, remarkDate, remarkType, remarkDetails)
             VALUES (?, ?, ?, ?, ?)`,
            [
                remarkData.userId,         // The person receiving the remark
                remarkData.remarkBy,       // The person leaving the remark
                remarkData.remarkDate,     // Date of the remark
                remarkData.remarkType,     // Positive/Negative
                remarkData.remarkDetails,  // Remark details
            ]
        );
        console.log('[INFO] Remark added successfully.');
    } catch (error) {
        console.error('[ERROR] Failed to add remark:', error);
        throw error;
    }
}

/**
 * Fetch all remarks for a specific user.
 * @param {string} userId - The user ID.
 * @returns {Promise<Array>} - List of remarks.
 */
async function fetchRemarks(userId) {
    try {
        const [rows] = await pool.execute(
            `SELECT 
                r.remarkBy,
                r.remarkDate,
                r.remarkType,
                r.remarkDetails,
                u.username AS remarkByName
             FROM player_remarks AS r
             LEFT JOIN users AS u ON r.remarkBy = u.id
             WHERE r.userId = ?`,
            [userId]
        );
        return rows || [];
    } catch (error) {
        console.error('[ERROR] Failed to fetch remarks:', error);
        throw error;
    }
}

/**
 * Fetches remarks for a specific user.
 * @param {string} userId - The ID of the user whose remarks are being fetched.
 * @returns {Promise<Object>} - Positive and negative remarks for the user.
 */
async function fetchRemarksForUser(userId) {
    try {
        const [rows] = await pool.execute(
            'SELECT remarkBy, remarkType, remarkDetails FROM player_remarks WHERE userId = ?',
            [userId]
        );

        const positiveRemarks = rows.filter(row => row.remarkType === 'Positive');
        const negativeRemarks = rows.filter(row => row.remarkType === 'Negative');

        return { positiveRemarks, negativeRemarks };
    } catch (error) {
        console.error('[ERROR] Failed to fetch remarks for user:', error);
        throw error;
    }
}

module.exports = { addPlayerRemark, fetchRemarks, fetchRemarksForUser };
