const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
require('dotenv').config();

async function registerCommands(client) {
    const commands = [];
    const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));

    // Load commands dynamically
    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        console.log(`[INFO] Loaded command: ${command.data.name}`);
    }

    // Debugging environment variables
    console.log('CLIENT_ID:', process.env.CLIENT_ID);

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

    const targetGuildId = process.env.DEV_MODE === 'true' ? process.env.TEST_GUILD_ID : process.env.MAIN_GUILD_ID;
    const mode = process.env.DEV_MODE === 'true' ? 'DEVELOPMENT' : 'PRODUCTION';

    console.log(`[INFO] Running in ${mode} mode.`);
    console.log(`[INFO] Registering commands for guild: ${targetGuildId}`);

    try {
        // Register commands to the correct guild
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, targetGuildId),
            { body: commands }
        );
        console.log(`[INFO] Successfully registered ${commands.length} commands.`);
    } catch (error) {
        console.error('[ERROR] Failed to register commands:', error);
    }
}

// Optional: Unregister commands for cleaning up
async function unregisterCommands(client) {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
    const targetGuildId = process.env.DEV_MODE === 'true' ? process.env.TEST_GUILD_ID : process.env.MAIN_GUILD_ID;

    try {
        const registeredCommands = await rest.get(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, targetGuildId)
        );
        console.log(`[INFO] Found ${registeredCommands.length} commands to unregister.`);

        for (const command of registeredCommands) {
            await rest.delete(Routes.applicationGuildCommand(process.env.CLIENT_ID, targetGuildId, command.id));
            console.log(`[INFO] Deleted command: ${command.name}`);
        }
    } catch (error) {
        console.error('[ERROR] Failed to unregister commands:', error);
    }
}

module.exports = { registerCommands, unregisterCommands };
