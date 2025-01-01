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

    return allowedRoles.some(roleConfig => {
        const guildRole = member.guild.roles.cache.get(roleConfig.id);
        const memberRole = member.roles.cache.get(roleConfig.id);

        if (!guildRole) {
            console.warn(`[WARN] Role ID ${roleConfig.id} not found in guild.`);
            return false;
        }

        // Hierarchical check
        if (roleConfig.hierarchical) {
            // Check if the member has a role equal to or higher in position
            return member.roles.highest.position >= guildRole.position;
        }

        // Specific role check
        return !!memberRole;
    });
}

module.exports = { hasPermissionForCommand };
