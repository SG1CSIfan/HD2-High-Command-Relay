class ReportConverter {
    constructor(data, userId) {
        this.report = {
            userId,
            enemyKills: parseInt(data.enemyKills || 0, 10),
            terminidKills: parseInt(data.terminidKills || 0, 10),
            automatonKills: parseInt(data.automatonKills || 0, 10),
            illuminateKills: parseInt(data.illuminateKills || 0, 10),
            friendlyKills: parseInt(data.friendlyKills || 0, 10),
            deaths: parseInt(data.deaths || 0, 10),
            shotsFired: parseInt(data.shotsFired || 0, 10),
            shotsHit: parseInt(data.shotsHit || 0, 10),
            timestamp: new Date(),
        };
    }

    // Convert report object to JSON format
    toJSON() {
        return this.report;
    }
}

module.exports = ReportConverter;
