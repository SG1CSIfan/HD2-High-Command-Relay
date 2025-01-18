async function filterLeaderboardMembers(rows, guild, limit = 10) {
    const members = [];

    for (const row of rows) {
        const member = guild.members.cache.get(row.userId);
        if (member) {
            members.push({
                nickname: member.nickname || member.user.username,
                kills: row.kills,
            });
        }
        // Stop if we've reached the limit
        if (members.length >= limit) {
            break;
        }
    }

    // Fill placeholders if not enough members
    while (members.length < limit) {
        members.push({ nickname: 'N/A', kills: 0 });
    }

    return members;
}

module.exports = { filterLeaderboardMembers };
