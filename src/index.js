const { Client, GatewayIntentBits } = require('discord.js');
const { registerCommands } = require('./handlers/commandHandler');
const { log } = require('./utils/logger');
const { loadOrUpdateEmbeds } = require('./utils/embedLoader');
const { readPersistentData } = require('./handlers/persistentMessageHandler');
const path = require('path');
require('dotenv').config();

console.log('DEV_MODE:', process.env.DEV_MODE);

const mode = process.env.DEV_MODE === 'true' ? 'DEVELOPMENT' : 'PRODUCTION';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers, // Add intent to fetch guild members
    ],
});

client.commands = new Map();

client.once('ready', async () => {
    console.log(`Bot logged in as ${client.user.tag} (${mode} MODE)`);
    log(`Bot logged in as ${client.user.tag} (${mode} MODE)`);

    // Register commands dynamically
    await registerCommands(client);

    // Preload members for all guilds
    try {
        console.log('[INFO] Preloading guild members...');
        for (const [guildId, guild] of client.guilds.cache) {
            await guild.members.fetch();
            console.log(`[INFO] Preloaded members for guild: ${guild.name} (${guildId})`);
        }
        console.log('[INFO] All guild members preloaded successfully.');
    } catch (error) {
        console.error('[ERROR] Failed to preload guild members:', error);
    }

    // Load update intervals dynamically from persistentMessage.json
    let data;
    try {
        data = await readPersistentData(); // From persistentMessageHandler
        console.log('[DEBUG] Data loaded from persistentMessage.json:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('[ERROR] Failed to read persistentMessage.json:', error);
        return;
    }

    const intervals = {};

    // Schedule updates for each scope with dynamic intervals
    for (const scope of ['killQuota', 'regimentEffort']) {
        console.log(`[DEBUG] Processing scope: ${scope}`);
        console.log(`[DEBUG] Scope Data:`, data[scope]);

        if (data[scope]?.interval && data[scope]?.channelId) {
            const interval = data[scope].interval * 1000; // Convert seconds to milliseconds

            intervals[scope] = setInterval(() => {
                loadOrUpdateEmbeds(client, scope);
            }, interval);

            console.log(`[INFO] Scheduled ${scope} updates every ${data[scope].interval} seconds.`);
        } else {
            console.warn(`[WARN] Interval or channel ID missing for ${scope}. Skipping updates.`);
            console.log(`[DEBUG] Interval: ${data[scope]?.interval}`);
            console.log(`[DEBUG] Channel ID: ${data[scope]?.channelId}`);
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    // Retrieve the registered command
    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.warn(`[WARN] Command ${interaction.commandName} not found.`);
        await interaction.reply({ content: 'Command not found.', ephemeral: true });
        return;
    }

    try {
        console.log(`[INFO] Executing command: ${interaction.commandName}`);
        await command.execute(interaction);
    } catch (error) {
        console.error('[ERROR] Failed to execute command:', error);
        await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
    }
});

// Log the bot in
client.login(process.env.DISCORD_BOT_TOKEN).catch((error) => {
    console.error('[ERROR] Failed to login:', error);
});
