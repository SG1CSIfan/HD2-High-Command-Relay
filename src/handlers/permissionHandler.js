const { isDevMode } = require('../utils/envUtils');
const remarkRoles = isDevMode()
    ? require('../data/remarkRolesDev.json')
    : require('../data/remarkRoles.json');

/**
 * Check if a user has permission for a specific command.
 * @param {Object} member - The Discord guild member object.
 * @param {string} commandName - The command name to check.
 * @returns {boolean}
 */
function hasPermissionForCommand(member, commandName) {
    const commandConfig = remarkRoles.commands[commandName];

    if (!commandConfig) {
        console.warn(`[WARN] No configuration found for command: ${commandName}`);
        return false;
    }

    const { allowedRoles } = commandConfig;

    for (const role of allowedRoles) {
        if (role.hierarchical) {
            // Check for the role and above
            const roleIds = allowedRoles.map(r => r.id);
            const index = roleIds.indexOf(role.id);

            if (index !== -1) {
                const hierarchySubset = roleIds.slice(index);
                if (member.roles.cache.some(r => hierarchySubset.includes(r.id))) {
                    return true;
                }
            }
        } else {
            // Check for specific role only
            if (member.roles.cache.has(role.id)) {
                return true;
            }
        }
    }

    return false;
}

module.exports = { hasPermissionForCommand };
